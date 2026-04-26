const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const proposalSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['proposal', 'notes'],
    properties: {
        proposal: {
            type: 'object',
            additionalProperties: false,
            required: ['slug', 'client', 'title', 'preparedBy', 'contact', 'clientLogo', 'brand', 'pages'],
            properties: {
                slug: { type: 'string' },
                client: { type: 'string' },
                title: { type: 'string' },
                preparedBy: { type: 'string' },
                contact: { type: 'string' },
                clientLogo: { type: 'string' },
                brand: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['primary', 'accent', 'background', 'muted'],
                    properties: {
                        primary: { type: 'string' },
                        accent: { type: 'string' },
                        background: { type: 'string' },
                        muted: { type: 'string' },
                    },
                },
                pages: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['page', 'eyebrow', 'title', 'kicker', 'intro', 'layout', 'callout', 'sections'],
                        properties: {
                            page: { type: 'string' },
                            eyebrow: { type: 'string' },
                            title: { type: 'string' },
                            kicker: { type: 'string' },
                            intro: { type: 'string' },
                            layout: { type: 'string' },
                            callout: { type: 'string' },
                            sections: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    additionalProperties: false,
                                    required: ['heading', 'body', 'items'],
                                    properties: {
                                        heading: { type: 'string' },
                                        body: { type: 'string' },
                                        items: {
                                            type: 'array',
                                            items: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        notes: {
            type: 'array',
            items: { type: 'string' },
        },
    },
};

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

function extractOutputText(payload) {
    if (typeof payload.output_text === 'string') {
        return payload.output_text;
    }

    const content = payload.output
        ?.flatMap((item) => item.content || [])
        ?.find((item) => item.type === 'output_text' && typeof item.text === 'string');

    return content?.text || '';
}

function clampPageCount(value) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return 4;
    }

    return Math.min(Math.max(parsed, 1), 10);
}

function cleanText(value, fallback = '') {
    return String(value || fallback).trim();
}

function cleanBrand(brand = {}, fallback = {}) {
    return {
        primary: cleanText(brand.primary, fallback.primary || '#2f3d2f'),
        accent: cleanText(brand.accent, fallback.accent || '#8c7a4f'),
        background: cleanText(brand.background, fallback.background || '#f7f5ef'),
        muted: cleanText(brand.muted, fallback.muted || '#d8d2c2'),
    };
}

function cleanProposal(proposal, { requestedPageCount, logoDataUrl, brandColors }) {
    const pages = Array.isArray(proposal.pages) ? proposal.pages : [];
    const cleanedPages = pages.slice(0, requestedPageCount).map((page, index) => ({
        page: String(index + 1).padStart(2, '0'),
        eyebrow: cleanText(page.eyebrow, index === 0 ? 'Proposal' : 'Section'),
        title: cleanText(page.title, index === 0 ? proposal.title : `Page ${index + 1}`),
        kicker: cleanText(page.kicker),
        intro: cleanText(page.intro),
        layout: cleanText(page.layout, index === 0 ? 'cover' : 'feature'),
        callout: cleanText(page.callout),
        sections: (Array.isArray(page.sections) ? page.sections : []).map((section) => ({
            heading: cleanText(section.heading),
            body: cleanText(section.body),
            items: (Array.isArray(section.items) ? section.items : [])
                .map((item) => cleanText(item))
                .filter(Boolean),
        })).filter((section) => section.heading || section.body || section.items.length),
    }));

    while (cleanedPages.length < requestedPageCount) {
        cleanedPages.push({
            page: String(cleanedPages.length + 1).padStart(2, '0'),
            eyebrow: 'Proposal',
            title: `Page ${cleanedPages.length + 1}`,
            kicker: '',
            intro: '',
            layout: 'feature',
            callout: '',
            sections: [],
        });
    }

    return {
        slug: 'custom',
        client: cleanText(proposal.client, 'Client'),
        title: cleanText(proposal.title, 'Client Proposal'),
        preparedBy: cleanText(proposal.preparedBy, 'Norris Francois Jr.'),
        contact: cleanText(proposal.contact, 'contact@norrisfrancoisjr.com'),
        clientLogo: logoDataUrl || '',
        brand: cleanBrand(proposal.brand, brandColors),
        pages: cleanedPages,
    };
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        response.status(405).json({ error: 'Method not allowed.' });
        return;
    }

    if (!process.env.OPENAI_API_KEY) {
        response.status(500).json({
            error: 'OPENAI_API_KEY is not set on the server.',
            vercelEnv: process.env.VERCEL_ENV || 'unknown',
            gitBranch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
            deploymentUrl: process.env.VERCEL_URL || 'unknown',
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

    const brief = cleanText(body.brief);
    const instructions = cleanText(body.instructions);
    const requestedPageCount = clampPageCount(body.pageCount);
    const brandColors = cleanBrand(body.brandColors || {});
    const logoName = cleanText(body.logoName);
    const hasLogo = Boolean(body.logoDataUrl);

    if (brief.length < 20) {
        response.status(400).json({
            error: 'Paste a brief before generating.',
        });
        return;
    }

    const prompt = `
You are Norris Francois Jr.'s senior proposal strategist, copywriter, and document architect.

Build a polished landscape PDF document from the raw brief. It may be a proposal, brand guide, campaign plan, scope document, or strategic pitch depending on what the brief asks for. Do not force every output into the same structure.

Default behavior:
- Create exactly ${requestedPageCount} pages.
- If the user did not specify page count, ${requestedPageCount} is the default.
- Keep the offer faithful to the brief.
- You may clean flow, sharpen copy, infer section order, and make the document feel more premium.
- Do not invent hard pricing, dates, deliverables, guarantees, or payment terms unless the brief clearly implies them.
- If important details are missing, make conservative assumptions and list them in notes.
- Write concise, client-ready copy that fits landscape pages. Avoid long walls of text.

Document architecture:
- Decide the best page titles and section structure for this brief.
- Page 1 should function as a strong cover/opening page.
- Later pages should prioritize clarity, sales flow, deliverables, investment, timeline, terms, or next steps only when relevant.
- Each page should have 2-4 sections.
- Use callout for a short high-emphasis line when useful; otherwise return an empty string.
- layout can be one of: cover, feature, grid, timeline, investment, closing.

Brand:
- Use the uploaded logo colors as directional inspiration when available.
- Logo uploaded: ${hasLogo ? 'yes' : 'no'}
- Logo file name: ${logoName || 'none'}
- Suggested brand colors: ${JSON.stringify(brandColors)}
- Return accessible hex colors in brand.primary, brand.accent, brand.background, and brand.muted.

Identity:
- Default preparedBy to "Norris Francois Jr."
- Default contact to "contact@norrisfrancoisjr.com"

Raw brief:
${brief}

Extra direction:
${instructions || 'None'}
`;

    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL,
            input: prompt,
            text: {
                format: {
                    type: 'json_schema',
                    name: 'proposal_builder_output',
                    strict: true,
                    schema: proposalSchema,
                },
            },
        }),
    });

    if (!openAiResponse.ok) {
        const errorText = await openAiResponse.text();
        response.status(openAiResponse.status).json({
            error: 'OpenAI proposal generation failed.',
            detail: errorText,
        });
        return;
    }

    const payload = await openAiResponse.json();
    const text = extractOutputText(payload);

    try {
        const generated = JSON.parse(text);
        response.status(200).json({
            proposal: cleanProposal(generated.proposal, {
                requestedPageCount,
                logoDataUrl: body.logoDataUrl || '',
                brandColors,
            }),
            notes: generated.notes || [],
            model: MODEL,
        });
    } catch (error) {
        response.status(502).json({
            error: 'OpenAI returned a response that could not be parsed.',
            detail: text,
        });
    }
}
