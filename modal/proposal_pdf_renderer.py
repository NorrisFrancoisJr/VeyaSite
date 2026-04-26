import os

import modal

app = modal.App("veya-proposal-pdf-renderer")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("fastapi[standard]==0.115.6", "playwright==1.49.1")
    .run_commands("playwright install --with-deps chromium")
)


@app.function(
    image=image,
    timeout=120,
)
@modal.fastapi_endpoint(method="POST")
async def render_pdf(payload: dict):
    from fastapi import Response
    from playwright.async_api import async_playwright

    proposal = payload.get("proposal")
    origin = (payload.get("origin") or os.environ.get("PUBLIC_APP_ORIGIN") or "").rstrip("/")

    if not proposal:
        return Response("Missing proposal payload.", status_code=400)

    if not origin:
        return Response("Missing app origin.", status_code=400)

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(args=["--no-sandbox"])
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(origin, wait_until="networkidle")
        await page.evaluate(
            """(proposalData) => {
                localStorage.setItem('veya.customProposal.v1', JSON.stringify(proposalData));
            }""",
            proposal,
        )
        await page.goto(f"{origin}/proposal-template?proposal=custom", wait_until="networkidle")
        await page.emulate_media(media="print")
        await page.evaluate("document.fonts ? document.fonts.ready : Promise.resolve()")
        pdf = await page.pdf(
            format="Letter",
            landscape=True,
            print_background=True,
            margin={"top": "0in", "right": "0in", "bottom": "0in", "left": "0in"},
        )
        await browser.close()

    return Response(
        pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="proposal.pdf"'},
    )
