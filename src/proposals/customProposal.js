export const customProposalSlug = 'custom';
export const customProposalStorageKey = 'veya.customProposal.v2';

const defaultBrand = {
    primary: '#2f3d2f',
    accent: '#8c7a4f',
    background: '#f7f5ef',
    muted: '#d8d2c2',
};

function clone(data) {
    return JSON.parse(JSON.stringify(data));
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function normalizeSection(section = {}) {
    return {
        heading: String(section.heading || '').trim(),
        body: String(section.body || '').trim(),
        items: asArray(section.items).map((item) => String(item || '').trim()).filter(Boolean),
    };
}

function normalizePage(page = {}, index = 0) {
    const fallbackTitle = index === 0 ? 'The Opportunity' : `Page ${index + 1}`;

    return {
        page: String(page.page || String(index + 1).padStart(2, '0')).trim(),
        eyebrow: String(page.eyebrow || 'Proposal').trim(),
        title: String(page.title || fallbackTitle).trim(),
        kicker: String(page.kicker || '').trim(),
        intro: String(page.intro || '').trim(),
        layout: String(page.layout || (index === 0 ? 'cover' : 'feature')).trim(),
        callout: String(page.callout || '').trim(),
        sections: asArray(page.sections).map(normalizeSection).filter((section) => (
            section.heading || section.body || section.items.length
        )),
    };
}

export function createDefaultCustomProposalData() {
    return {
        slug: customProposalSlug,
        client: 'Client Name',
        title: 'Client Proposal',
        preparedBy: 'Norris Francois Jr.',
        contact: 'contact@norrisfrancoisjr.com',
        clientLogo: '',
        brand: clone(defaultBrand),
        pages: [
            {
                page: '01',
                eyebrow: 'Campaign Overview',
                title: 'A sharper path from attention to action.',
                kicker: 'Built from the client brief.',
                intro: 'Paste a raw brief, add direction, and generate a polished landscape PDF.',
                layout: 'cover',
                callout: 'The goal is to make the offer feel clear, premium, and easy to say yes to.',
                sections: [
                    {
                        heading: 'How this works',
                        body: 'The AI will determine the best proposal structure from the brief, then create a concise client-ready document.',
                        items: [],
                    },
                ],
            },
            {
                page: '02',
                eyebrow: 'Strategy',
                title: 'The strategic frame.',
                kicker: '',
                intro: '',
                layout: 'feature',
                callout: '',
                sections: [],
            },
            {
                page: '03',
                eyebrow: 'Scope',
                title: 'The work.',
                kicker: '',
                intro: '',
                layout: 'grid',
                callout: '',
                sections: [],
            },
            {
                page: '04',
                eyebrow: 'Next Steps',
                title: 'The path forward.',
                kicker: '',
                intro: '',
                layout: 'timeline',
                callout: '',
                sections: [],
            },
        ],
    };
}

export function normalizeCustomProposalData(input = {}) {
    const fallback = createDefaultCustomProposalData();
    const pages = asArray(input.pages).length ? asArray(input.pages) : fallback.pages;

    return {
        slug: customProposalSlug,
        client: String(input.client || fallback.client).trim(),
        title: String(input.title || fallback.title).trim(),
        preparedBy: String(input.preparedBy || fallback.preparedBy).trim(),
        contact: String(input.contact || fallback.contact).trim(),
        clientLogo: String(input.clientLogo || '').trim(),
        brand: {
            ...fallback.brand,
            ...(input.brand && typeof input.brand === 'object' ? input.brand : {}),
        },
        pages: pages.map(normalizePage),
    };
}

export function loadStoredCustomProposalData() {
    if (typeof window === 'undefined') {
        return createDefaultCustomProposalData();
    }

    try {
        const raw = window.localStorage.getItem(customProposalStorageKey);
        if (!raw) {
            return createDefaultCustomProposalData();
        }

        return normalizeCustomProposalData(JSON.parse(raw));
    } catch (error) {
        console.warn('Could not load saved proposal draft.', error);
        return createDefaultCustomProposalData();
    }
}

export function saveStoredCustomProposalData(data) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(
        customProposalStorageKey,
        JSON.stringify(normalizeCustomProposalData(data)),
    );
}
