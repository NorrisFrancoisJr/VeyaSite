# Proposal Builder Deployment

## Vercel

Set these environment variables in Vercel:

```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
PUBLIC_APP_ORIGIN=https://your-vercel-domain.vercel.app
MODAL_PDF_ENDPOINT=https://your-modal-endpoint.modal.run
```

`MODAL_PDF_ENDPOINT` is optional. Without it, the app still generates proposals and uses browser print for PDF export.

Vercel settings:

```bash
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

## Modal PDF Renderer

Deploy the renderer after your Vercel URL exists:

```bash
python3 -m pip install modal
modal setup
modal deploy modal/proposal_pdf_renderer.py
```

Copy the Modal endpoint URL into Vercel as `MODAL_PDF_ENDPOINT`.

## Team Workflow

1. Open `/proposal-builder`.
2. Paste a raw brief.
3. Click `Generate Proposal`.
4. Review and edit fields.
5. Use `Open Preview`, `Print PDF`, or `Cloud PDF`.
6. Download JSON if you want a portable backup.

There is no database in this version. Drafts are browser-local only and should be exported as JSON if they need to be kept.
