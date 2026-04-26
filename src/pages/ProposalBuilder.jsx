import React, { useEffect, useMemo, useState } from 'react';
import {
    Download,
    Eye,
    FileJson,
    Loader2,
    Printer,
    RotateCcw,
    Sparkles,
    Upload,
} from 'lucide-react';
import './ProposalBuilder.css';
import {
    createDefaultCustomProposalData,
    customProposalSlug,
    loadStoredCustomProposalData,
    normalizeCustomProposalData,
    saveStoredCustomProposalData,
} from '../proposals/customProposal';

function Field({ label, children, hint }) {
    return (
        <label className="proposal-builder-field">
            <span>{label}</span>
            {children}
            {hint ? <small>{hint}</small> : null}
        </label>
    );
}

function Section({ title, description, children }) {
    return (
        <section className="proposal-builder-section">
            <div className="proposal-builder-section-heading">
                <h2>{title}</h2>
                {description ? <p>{description}</p> : null}
            </div>
            <div className="proposal-builder-section-body">{children}</div>
        </section>
    );
}

function formatApiError(payload) {
    const parts = [payload.error || 'Proposal generation failed.'];

    if (payload.detail) {
        parts.push(String(payload.detail).slice(0, 420));
    }

    if (payload.vercelEnv || payload.gitBranch || payload.deploymentUrl) {
        parts.push(
            `Vercel env: ${payload.vercelEnv || 'unknown'} | Branch: ${payload.gitBranch || 'unknown'} | Deployment: ${payload.deploymentUrl || 'unknown'}`
        );
    }

    return parts.join(' ');
}

function readImageDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function toHex(value) {
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0');
}

function rgbToHex([red, green, blue]) {
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function getSaturation([red, green, blue]) {
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    return max === 0 ? 0 : (max - min) / max;
}

async function extractLogoPalette(dataUrl) {
    const image = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    const size = 72;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, size, size);
    const pixels = context.getImageData(0, 0, size, size).data;
    const buckets = new Map();

    for (let index = 0; index < pixels.length; index += 16) {
        const alpha = pixels[index + 3];
        if (alpha < 150) {
            continue;
        }

        const color = [
            Math.round(pixels[index] / 24) * 24,
            Math.round(pixels[index + 1] / 24) * 24,
            Math.round(pixels[index + 2] / 24) * 24,
        ];
        const brightness = (color[0] + color[1] + color[2]) / 3;
        if (brightness < 24 || brightness > 238) {
            continue;
        }

        const key = color.join(',');
        buckets.set(key, (buckets.get(key) || 0) + 1);
    }

    const colors = [...buckets.entries()]
        .map(([key, count]) => ({ color: key.split(',').map(Number), count }))
        .sort((left, right) => right.count - left.count)
        .slice(0, 8);

    const saturated = colors.find(({ color }) => getSaturation(color) > 0.22)?.color;
    const primary = colors[0]?.color || [47, 61, 47];
    const accent = saturated || colors[1]?.color || [140, 122, 79];

    return {
        primary: rgbToHex(primary),
        accent: rgbToHex(accent),
        background: '#f7f5ef',
        muted: '#d8d2c2',
    };
}

export default function ProposalBuilder() {
    const [proposal, setProposal] = useState(() => loadStoredCustomProposalData());
    const [brief, setBrief] = useState('');
    const [instructions, setInstructions] = useState('');
    const [pageCount, setPageCount] = useState(4);
    const [logoName, setLogoName] = useState('');
    const [notes, setNotes] = useState([]);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRenderingPdf, setIsRenderingPdf] = useState(false);
    const previewUrl = useMemo(() => `/proposal-template?proposal=${customProposalSlug}`, []);
    const printUrl = useMemo(() => `/proposal-template?proposal=${customProposalSlug}&print=1`, []);

    useEffect(() => {
        saveStoredCustomProposalData(proposal);
    }, [proposal]);

    async function handleLogoUpload(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            const dataUrl = await readImageDataUrl(file);
            const palette = await extractLogoPalette(dataUrl);
            setLogoName(file.name);
            setProposal((current) => normalizeCustomProposalData({
                ...current,
                clientLogo: dataUrl,
                brand: palette,
            }));
            setStatus('Logo added. I pulled a starting color direction from it.');
            setError('');
        } catch (uploadError) {
            setError('The logo could not be read. Try a PNG, JPG, or SVG file.');
        }
    }

    function handleDownloadJson() {
        const blob = new Blob([JSON.stringify(proposal, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${proposal.client || 'proposal'}-proposal.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    async function handleGenerateProposal() {
        setError('');
        setStatus('');
        setNotes([]);

        if (brief.trim().length < 20) {
            setError('Paste a brief before generating.');
            return;
        }

        setIsGenerating(true);

        try {
            const result = await fetch('/api/generate-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brief,
                    instructions,
                    pageCount,
                    logoName,
                    logoDataUrl: proposal.clientLogo,
                    brandColors: proposal.brand,
                }),
            });

            const payload = await result.json();

            if (!result.ok) {
                throw new Error(formatApiError(payload));
            }

            const generatedProposal = normalizeCustomProposalData(payload.proposal);
            setProposal(generatedProposal);
            setNotes(payload.notes || []);
            setStatus(`Generated ${generatedProposal.pages.length} page${generatedProposal.pages.length === 1 ? '' : 's'} with ${payload.model || 'OpenAI'}.`);
        } catch (generationError) {
            setError(generationError.message);
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleRenderPdf() {
        setError('');
        setStatus('');
        setIsRenderingPdf(true);

        try {
            const result = await fetch('/api/render-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proposal }),
            });

            if (!result.ok) {
                let message = 'Cloud PDF rendering is not available yet.';
                try {
                    const payload = await result.json();
                    message = payload.error || message;
                } catch (error) {
                    message = await result.text();
                }

                throw new Error(message);
            }

            const blob = await result.blob();
            const url = URL.createObjectURL(blob);
            const filename = `${proposal.client || 'proposal'}-${proposal.title || 'proposal'}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${filename}.pdf`;
            anchor.click();
            URL.revokeObjectURL(url);
            setStatus('PDF downloaded.');
        } catch (renderError) {
            setError(`${renderError.message} Use Print PDF for now.`);
        } finally {
            setIsRenderingPdf(false);
        }
    }

    function handleImportJson(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            try {
                setProposal(normalizeCustomProposalData(JSON.parse(String(reader.result))));
                setStatus('JSON imported.');
                setError('');
            } catch (importError) {
                window.alert('That JSON file could not be imported.');
            }
        };
        reader.readAsText(file);
    }

    function handleReset() {
        setProposal(createDefaultCustomProposalData());
        setBrief('');
        setInstructions('');
        setPageCount(4);
        setLogoName('');
        setNotes([]);
        setStatus('');
        setError('');
    }

    return (
        <main className="proposal-builder">
            <header className="proposal-builder-hero">
                <div>
                    <p>Proposal Builder</p>
                    <h1>Turn a rough brief into a finished PDF.</h1>
                    <span>
                        Add the client context, optional direction, page count, and logo. The AI
                        decides the structure and writes the document.
                    </span>
                </div>

                <div className="proposal-builder-actions">
                    <a href={previewUrl} target="_blank" rel="noreferrer">
                        <Eye size={18} />
                        Open Preview
                    </a>
                    <a href={printUrl} target="_blank" rel="noreferrer">
                        <Printer size={18} />
                        Print PDF
                    </a>
                    <button type="button" onClick={handleRenderPdf} disabled={isRenderingPdf}>
                        {isRenderingPdf ? <Loader2 className="proposal-builder-spin" size={18} /> : <Download size={18} />}
                        Cloud PDF
                    </button>
                    <button type="button" onClick={handleDownloadJson}>
                        <FileJson size={18} />
                        Download JSON
                    </button>
                    <label className="proposal-builder-import">
                        <Upload size={18} />
                        Import JSON
                        <input type="file" accept="application/json" onChange={handleImportJson} />
                    </label>
                    <button type="button" onClick={handleReset}>
                        <RotateCcw size={18} />
                        Reset
                    </button>
                </div>
            </header>

            <Section title="Build The Document" description="This is intentionally loose. Give it the kind of brief you would give me in chat.">
                <div className="proposal-builder-ai-panel proposal-builder-ai-panel--flex">
                    <Field label="Brief">
                        <textarea
                            rows={14}
                            value={brief}
                            onChange={(event) => setBrief(event.target.value)}
                            placeholder="Client, goal, offer, audience, deliverables, price, payment terms, tone, constraints, anything that matters..."
                        />
                    </Field>

                    <Field label="Extra Direction">
                        <textarea
                            rows={14}
                            value={instructions}
                            onChange={(event) => setInstructions(event.target.value)}
                            placeholder="Premium and minimal. Use more whitespace. Make the cover stronger. Default to 4 pages unless I specify otherwise..."
                        />
                    </Field>

                    <div className="proposal-builder-controls">
                        <Field label="Pages" hint="Default is 4. Use 1-10 pages when the brief needs it.">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={pageCount}
                                onChange={(event) => setPageCount(event.target.value)}
                            />
                        </Field>

                        <Field label="Optional Logo" hint={logoName || 'PNG, JPG, or SVG. Stored only in this browser draft.'}>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} />
                        </Field>

                        {proposal.clientLogo ? (
                            <div className="proposal-builder-logo-preview">
                                <img src={proposal.clientLogo} alt="Uploaded client logo" />
                                <div>
                                    <span>Logo loaded</span>
                                    <small>{proposal.brand.primary} / {proposal.brand.accent}</small>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="proposal-builder-ai-actions">
                        <button type="button" onClick={handleGenerateProposal} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="proposal-builder-spin" size={18} /> : <Sparkles size={18} />}
                            Generate PDF Draft
                        </button>
                        <span>No database. Drafts live in this browser until cleared or overwritten.</span>
                    </div>

                    {status ? <p className="proposal-builder-status">{status}</p> : null}
                    {error ? <p className="proposal-builder-error">{error}</p> : null}
                    {notes.length ? (
                        <div className="proposal-builder-notes">
                            <h3>AI Notes</h3>
                            {notes.map((note) => (
                                <p key={note}>{note}</p>
                            ))}
                        </div>
                    ) : null}
                </div>
            </Section>

            <Section title="Current Draft" description="The editable source is the brief. Regenerate when you want a different structure or page count.">
                <div className="proposal-builder-draft-summary">
                    <div>
                        <span>Client</span>
                        <strong>{proposal.client}</strong>
                    </div>
                    <div>
                        <span>Title</span>
                        <strong>{proposal.title}</strong>
                    </div>
                    <div>
                        <span>Pages</span>
                        <strong>{proposal.pages.length}</strong>
                    </div>
                </div>

                <div className="proposal-builder-page-list">
                    {proposal.pages.map((page) => (
                        <article key={`${page.page}-${page.title}`}>
                            <span>{page.page}</span>
                            <h3>{page.title}</h3>
                            <p>{page.eyebrow}</p>
                        </article>
                    ))}
                </div>
            </Section>
        </main>
    );
}
