function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk.toString();
        });

        request.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });

        request.on('error', reject);
    });
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        response.status(405).json({ error: 'Method not allowed.' });
        return;
    }

    if (!process.env.MODAL_PDF_ENDPOINT) {
        response.status(501).json({
            error: 'MODAL_PDF_ENDPOINT is not configured. Use browser print or deploy the Modal renderer.',
        });
        return;
    }

    let body;
    try {
        body = await readBody(request);
    } catch (error) {
        response.status(400).json({ error: 'Request body must be valid JSON.' });
        return;
    }

    const modalResponse = await fetch(process.env.MODAL_PDF_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(process.env.MODAL_PDF_TOKEN
                ? { Authorization: `Bearer ${process.env.MODAL_PDF_TOKEN}` }
                : {}),
        },
        body: JSON.stringify({
            proposal: body.proposal,
            origin: process.env.PUBLIC_APP_ORIGIN || request.headers.origin,
        }),
    });

    if (!modalResponse.ok) {
        response.status(modalResponse.status).json({
            error: 'Modal PDF renderer failed.',
            detail: await modalResponse.text(),
        });
        return;
    }

    const pdfBuffer = Buffer.from(await modalResponse.arrayBuffer());
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="proposal.pdf"');
    response.status(200).send(pdfBuffer);
}
