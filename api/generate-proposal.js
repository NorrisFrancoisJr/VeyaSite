const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const proposalSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['proposal', 'notes'],
    properties: {
        proposal: {
            type: 'object',
            additionalProperties: false,
            required: ['slug', 'client', 'title', 'preparedBy', 'contact', 'clientLogo', 'pages'],
            properties: {
                slug: { type: 'string' },
                client: { type: 'string' },
                title: { type: 'string' },
                preparedBy: { type: 'string' },
                contact: { type: 'string' },
                clientLogo: { type: 'string' },
                pages: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['overview', 'messaging', 'strategy', 'investment', 'nextSteps'],
                    properties: {
                        overview: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['eyebrow', 'page', 'title', 'kicker', 'paragraphs'],
                            properties: {
                                eyebrow: { type: 'string' },
                                page: { type: 'string' },
                                title: { type: 'string' },
                                kicker: { type: 'string' },
                                paragraphs: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                            },
                        },
                        messaging: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['eyebrow', 'page', 'kicker', 'title', 'frameworks'],
                            properties: {
                                eyebrow: { type: 'string' },
                                page: { type: 'string' },
                                kicker: { type: 'string' },
                                title: { type: 'string' },
                                frameworks: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['title', 'subtitle', 'sections'],
                                        properties: {
                                            title: { type: 'string' },
                                            subtitle: { type: 'string' },
                                            sections: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    additionalProperties: false,
                                                    required: ['label', 'text'],
                                                    properties: {
                                                        label: { type: 'string' },
                                                        text: { type: 'string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        strategy: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['eyebrow', 'page', 'kicker', 'title', 'intro', 'phases'],
                            properties: {
                                eyebrow: { type: 'string' },
                                page: { type: 'string' },
                                kicker: { type: 'string' },
                                title: { type: 'string' },
                                intro: { type: 'string' },
                                phases: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['label', 'title', 'target', 'goal'],
                                        properties: {
                                            label: { type: 'string' },
                                            title: { type: 'string' },
                                            target: { type: 'string' },
                                            goal: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                        investment: {
                            type: 'object',
                            additionalProperties: false,
                            required: [
                                'eyebrow',
                                'page',
                                'kicker',
                                'title',
                                'intro',
                                'totalLabel',
                                'total',
                                'includedTitle',
                                'included',
                                'paymentTitle',
                                'paymentSchedule',
                            ],
                            properties: {
                                eyebrow: { type: 'string' },
                                page: { type: 'string' },
                                kicker: { type: 'string' },
                                title: { type: 'string' },
                                intro: { type: 'string' },
                                totalLabel: { type: 'string' },
                                total: { type: 'string' },
                                includedTitle: { type: 'string' },
                                included: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['title', 'text'],
                                        properties: {
                                            title: { type: 'string' },
                                            text: { type: 'string' },
                                        },
                                    },
                                },
                                paymentTitle: { type: 'string' },
                                paymentSchedule: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['milestone', 'detail'],
                                        properties: {
                                            milestone: { type: 'string' },
                                            detail: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                        nextSteps: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['eyebrow', 'page', 'kicker', 'title', 'intro', 'steps'],
                            properties: {
                                eyebrow: { type: 'string' },
                                page: { type: 'string' },
                                kicker: { type: 'string' },
                                title: { type: 'string' },
                                intro: { type: 'string' },
                                steps: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        required: ['number', 'title', 'text'],
                                        properties: {
                                            number: { type: 'string' },
                                            title: { type: 'string' },
                                            text: { type: 'string' },
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

function cleanProposal(proposal) {
    return {
        ...proposal,
        slug: 'custom',
        pages: {
            ...proposal.pages,
            overview: { ...proposal.pages.overview, page: '01' },
            messaging: { ...proposal.pages.messaging, page: '02' },
            strategy: { ...proposal.pages.strategy, page: '03' },
            investment: { ...proposal.pages.investment, page: '04' },
            nextSteps: { ...proposal.pages.nextSteps, page: '05' },
        },
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

    const brief = String(body.brief || '').trim();
    const existingProposal = body.proposal || {};
    const instructions = String(body.instructions || '').trim();

    if (brief.length < 40) {
        response.status(400).json({
            error: 'Paste a fuller brief before generating a proposal.',
        });
        return;
    }

    const prompt = `
You are Norris Francois Jr.'s proposal strategist and copywriter. Build a polished five-page landscape proposal from a raw client brief.

Keep the offer faithful to the brief. You may clean flow, clarify strategy, and write stronger copy, but do not invent pricing, dates, deliverables, or payment terms unless the brief omits them. If a detail is missing, make a conservative professional assumption and add it to notes.

The output must fit this exact proposal structure:
Page 1: cover overview with three concise paragraphs.
Page 2: two video/content concepts. Each concept must have exactly three sections with labels "THE CREATIVE CONCEPT", "Sample Script", and "THE VISUALS". Sample Script should be written as a client-ready voiceover or ad read with paragraph breaks.
Page 3: two strategic phases with target and goal.
Page 4: investment, four included items, and three payment milestones.
Page 5: four next steps.

Default preparedBy to "Norris Francois Jr." and contact to "contact@norrisfrancoisjr.com" unless the brief says otherwise.

Raw brief:
${brief}

Additional instructions:
${instructions || 'None'}

Current draft to improve or replace:
${JSON.stringify(existingProposal, null, 2)}
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
            proposal: cleanProposal(generated.proposal),
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
