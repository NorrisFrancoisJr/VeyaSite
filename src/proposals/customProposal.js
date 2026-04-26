import { safeHavenRealEstateProposal } from './safeHavenRealEstate';

export const customProposalSlug = 'custom';
export const customProposalStorageKey = 'veya.customProposal.v1';

function cloneProposalData(data) {
    return JSON.parse(JSON.stringify(data));
}

function mergeProposalShape(template, value) {
    if (Array.isArray(template)) {
        const source = Array.isArray(value) ? value : [];
        return template.map((item, index) => mergeProposalShape(item, source[index]));
    }

    if (template && typeof template === 'object') {
        const source = value && typeof value === 'object' ? value : {};
        return Object.keys(template).reduce((result, key) => {
            result[key] = mergeProposalShape(template[key], source[key]);
            return result;
        }, {});
    }

    return value ?? template;
}

export function createDefaultCustomProposalData() {
    const proposal = cloneProposalData(safeHavenRealEstateProposal);
    proposal.slug = customProposalSlug;
    return proposal;
}

export function normalizeCustomProposalData(input) {
    return mergeProposalShape(createDefaultCustomProposalData(), input);
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
