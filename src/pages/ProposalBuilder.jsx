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

function setIn(target, path, value) {
    if (path.length === 0) {
        return value;
    }

    const [head, ...rest] = path;
    const clone = Array.isArray(target) ? [...target] : { ...target };
    clone[head] = setIn(target?.[head], rest, value);
    return clone;
}

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

export default function ProposalBuilder() {
    const [proposal, setProposal] = useState(() => loadStoredCustomProposalData());
    const [brief, setBrief] = useState('');
    const [instructions, setInstructions] = useState('');
    const [notes, setNotes] = useState([]);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRenderingPdf, setIsRenderingPdf] = useState(false);
    const previewUrl = useMemo(
        () => `/proposal-template?proposal=${customProposalSlug}`,
        [],
    );
    const printUrl = useMemo(
        () => `/proposal-template?proposal=${customProposalSlug}&print=1`,
        [],
    );

    useEffect(() => {
        saveStoredCustomProposalData(proposal);
    }, [proposal]);

    function update(path, value) {
        setProposal((current) => setIn(current, path, value));
    }

    function handleLogoUpload(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            update(['clientLogo'], reader.result);
        };
        reader.readAsDataURL(file);
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

        if (brief.trim().length < 40) {
            setError('Paste a fuller brief before generating.');
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
                    proposal,
                }),
            });

            const payload = await result.json();

            if (!result.ok) {
                throw new Error(payload.error || 'Proposal generation failed.');
            }

            const generatedProposal = normalizeCustomProposalData({
                ...payload.proposal,
                clientLogo: proposal.clientLogo || payload.proposal.clientLogo,
            });

            setProposal(generatedProposal);
            setNotes(payload.notes || []);
            setStatus(`Generated with ${payload.model || 'OpenAI'}. Review the page sections before sending.`);
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
            } catch (error) {
                window.alert('That JSON file could not be imported.');
            }
        };
        reader.readAsText(file);
    }

    function handleReset() {
        setProposal(createDefaultCustomProposalData());
        setBrief('');
        setInstructions('');
        setNotes([]);
        setStatus('');
        setError('');
    }

    const { overview, messaging, strategy, investment, nextSteps } = proposal.pages;

    return (
        <main className="proposal-builder">
            <header className="proposal-builder-hero">
                <div>
                    <p>Proposal Builder</p>
                    <h1>Build a client proposal from a raw brief.</h1>
                    <span>
                        Paste the client context, generate the first draft, tighten the fields, then
                        download the proposal as a PDF.
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

            <Section title="AI Brief" description="Paste the same kind of context you would give in chat.">
                <div className="proposal-builder-ai-panel">
                    <Field label="Raw Brief">
                        <textarea
                            rows={12}
                            value={brief}
                            onChange={(event) => setBrief(event.target.value)}
                            placeholder="Client, offer, goals, audience, deliverables, price, payment terms, brand tone, page notes..."
                        />
                    </Field>
                    <Field label="Extra Direction">
                        <textarea
                            rows={12}
                            value={instructions}
                            onChange={(event) => setInstructions(event.target.value)}
                            placeholder="Make it more premium, add a stronger cover, keep payment terms phased, use a confident but warm voice..."
                        />
                    </Field>
                    <div className="proposal-builder-ai-actions">
                        <button type="button" onClick={handleGenerateProposal} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="proposal-builder-spin" size={18} /> : <Sparkles size={18} />}
                            Generate Proposal
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

            <Section title="General" description="These fields drive the proposal identity and footer.">
                <div className="proposal-builder-grid proposal-builder-grid--three">
                    <Field label="Client Name">
                        <input
                            value={proposal.client}
                            onChange={(event) => update(['client'], event.target.value)}
                        />
                    </Field>
                    <Field label="Proposal Title">
                        <input
                            value={proposal.title}
                            onChange={(event) => update(['title'], event.target.value)}
                        />
                    </Field>
                    <Field label="Prepared By">
                        <input
                            value={proposal.preparedBy}
                            onChange={(event) => update(['preparedBy'], event.target.value)}
                        />
                    </Field>
                    <Field label="Contact Email">
                        <input
                            value={proposal.contact}
                            onChange={(event) => update(['contact'], event.target.value)}
                        />
                    </Field>
                    <Field label="Logo URL or data">
                        <input
                            value={proposal.clientLogo || ''}
                            onChange={(event) => update(['clientLogo'], event.target.value)}
                        />
                    </Field>
                    <Field label="Upload Logo" hint="Uploads are stored in the browser for this draft.">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} />
                    </Field>
                </div>
            </Section>

            <Section title="Page 1: Cover" description="Client framing, opening title, and the three overview paragraphs.">
                <div className="proposal-builder-grid proposal-builder-grid--two">
                    <Field label="Top Label">
                        <input
                            value={overview.eyebrow}
                            onChange={(event) => update(['pages', 'overview', 'eyebrow'], event.target.value)}
                        />
                    </Field>
                    <Field label="Kicker">
                        <input
                            value={overview.kicker}
                            onChange={(event) => update(['pages', 'overview', 'kicker'], event.target.value)}
                        />
                    </Field>
                </div>

                <Field label="Main Heading">
                    <input
                        value={overview.title}
                        onChange={(event) => update(['pages', 'overview', 'title'], event.target.value)}
                    />
                </Field>

                {overview.paragraphs.map((paragraph, index) => (
                    <Field key={index} label={`Overview Paragraph ${index + 1}`}>
                        <textarea
                            rows={4}
                            value={paragraph}
                            onChange={(event) => update(['pages', 'overview', 'paragraphs', index], event.target.value)}
                        />
                    </Field>
                ))}
            </Section>

            <Section title="Page 2: Video Concepts" description="Each card uses a concept, a sample script, and a visuals block.">
                <div className="proposal-builder-grid proposal-builder-grid--two">
                    <Field label="Top Label">
                        <input
                            value={messaging.eyebrow}
                            onChange={(event) => update(['pages', 'messaging', 'eyebrow'], event.target.value)}
                        />
                    </Field>
                    <Field label="Kicker">
                        <input
                            value={messaging.kicker}
                            onChange={(event) => update(['pages', 'messaging', 'kicker'], event.target.value)}
                        />
                    </Field>
                </div>

                <Field label="Page Heading">
                    <input
                        value={messaging.title}
                        onChange={(event) => update(['pages', 'messaging', 'title'], event.target.value)}
                    />
                </Field>

                <div className="proposal-builder-grid proposal-builder-grid--two">
                    {messaging.frameworks.map((framework, frameworkIndex) => (
                        <div key={frameworkIndex} className="proposal-builder-card">
                            <Field label="Card Label">
                                <input
                                    value={framework.subtitle}
                                    onChange={(event) => update(['pages', 'messaging', 'frameworks', frameworkIndex, 'subtitle'], event.target.value)}
                                />
                            </Field>
                            <Field label="Card Title">
                                <input
                                    value={framework.title}
                                    onChange={(event) => update(['pages', 'messaging', 'frameworks', frameworkIndex, 'title'], event.target.value)}
                                />
                            </Field>

                            {framework.sections.map((section, sectionIndex) => (
                                <Field
                                    key={sectionIndex}
                                    label={section.label}
                                    hint={section.label === 'Sample Script' ? 'Separate paragraphs with a blank line.' : undefined}
                                >
                                    <textarea
                                        rows={section.label === 'Sample Script' ? 10 : 4}
                                        value={section.text}
                                        onChange={(event) => update(['pages', 'messaging', 'frameworks', frameworkIndex, 'sections', sectionIndex, 'text'], event.target.value)}
                                    />
                                </Field>
                            ))}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Page 3: Strategy" description="Use these blocks for phase positioning, target, and business goal.">
                <div className="proposal-builder-grid proposal-builder-grid--two">
                    <Field label="Top Label">
                        <input
                            value={strategy.eyebrow}
                            onChange={(event) => update(['pages', 'strategy', 'eyebrow'], event.target.value)}
                        />
                    </Field>
                    <Field label="Kicker">
                        <input
                            value={strategy.kicker}
                            onChange={(event) => update(['pages', 'strategy', 'kicker'], event.target.value)}
                        />
                    </Field>
                </div>

                <Field label="Page Heading">
                    <input
                        value={strategy.title}
                        onChange={(event) => update(['pages', 'strategy', 'title'], event.target.value)}
                    />
                </Field>

                <Field label="Intro Paragraph">
                    <textarea
                        rows={3}
                        value={strategy.intro}
                        onChange={(event) => update(['pages', 'strategy', 'intro'], event.target.value)}
                    />
                </Field>

                <div className="proposal-builder-grid proposal-builder-grid--two">
                    {strategy.phases.map((phase, phaseIndex) => (
                        <div key={phaseIndex} className="proposal-builder-card">
                            <Field label="Phase Label">
                                <input
                                    value={phase.label}
                                    onChange={(event) => update(['pages', 'strategy', 'phases', phaseIndex, 'label'], event.target.value)}
                                />
                            </Field>
                            <Field label="Phase Title">
                                <input
                                    value={phase.title}
                                    onChange={(event) => update(['pages', 'strategy', 'phases', phaseIndex, 'title'], event.target.value)}
                                />
                            </Field>
                            <Field label="Target">
                                <input
                                    value={phase.target}
                                    onChange={(event) => update(['pages', 'strategy', 'phases', phaseIndex, 'target'], event.target.value)}
                                />
                            </Field>
                            <Field label="Goal">
                                <textarea
                                    rows={5}
                                    value={phase.goal}
                                    onChange={(event) => update(['pages', 'strategy', 'phases', phaseIndex, 'goal'], event.target.value)}
                                />
                            </Field>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Page 4: Investment" description="Package positioning, included work, and payment schedule.">
                <div className="proposal-builder-grid proposal-builder-grid--three">
                    <Field label="Top Label">
                        <input
                            value={investment.eyebrow}
                            onChange={(event) => update(['pages', 'investment', 'eyebrow'], event.target.value)}
                        />
                    </Field>
                    <Field label="Kicker">
                        <input
                            value={investment.kicker}
                            onChange={(event) => update(['pages', 'investment', 'kicker'], event.target.value)}
                        />
                    </Field>
                    <Field label="Total Investment">
                        <input
                            value={investment.total}
                            onChange={(event) => update(['pages', 'investment', 'total'], event.target.value)}
                        />
                    </Field>
                </div>

                <Field label="Page Heading">
                    <input
                        value={investment.title}
                        onChange={(event) => update(['pages', 'investment', 'title'], event.target.value)}
                    />
                </Field>

                <Field label="Intro Paragraph">
                    <textarea
                        rows={3}
                        value={investment.intro}
                        onChange={(event) => update(['pages', 'investment', 'intro'], event.target.value)}
                    />
                </Field>

                <div className="proposal-builder-grid proposal-builder-grid--two">
                    <div className="proposal-builder-card">
                        <h3>Included</h3>
                        {investment.included.map((item, itemIndex) => (
                            <div key={itemIndex} className="proposal-builder-mini-stack">
                                <Field label={`Item ${itemIndex + 1} Title`}>
                                    <input
                                        value={item.title}
                                        onChange={(event) => update(['pages', 'investment', 'included', itemIndex, 'title'], event.target.value)}
                                    />
                                </Field>
                                <Field label={`Item ${itemIndex + 1} Text`}>
                                    <textarea
                                        rows={3}
                                        value={item.text}
                                        onChange={(event) => update(['pages', 'investment', 'included', itemIndex, 'text'], event.target.value)}
                                    />
                                </Field>
                            </div>
                        ))}
                    </div>

                    <div className="proposal-builder-card">
                        <Field label="Payment Schedule Heading">
                            <input
                                value={investment.paymentTitle}
                                onChange={(event) => update(['pages', 'investment', 'paymentTitle'], event.target.value)}
                            />
                        </Field>

                        {investment.paymentSchedule.map((item, itemIndex) => (
                            <div key={itemIndex} className="proposal-builder-mini-stack">
                                <Field label={`Milestone ${itemIndex + 1}`}>
                                    <input
                                        value={item.milestone}
                                        onChange={(event) => update(['pages', 'investment', 'paymentSchedule', itemIndex, 'milestone'], event.target.value)}
                                    />
                                </Field>
                                <Field label={`Milestone ${itemIndex + 1} Detail`}>
                                    <textarea
                                        rows={3}
                                        value={item.detail}
                                        onChange={(event) => update(['pages', 'investment', 'paymentSchedule', itemIndex, 'detail'], event.target.value)}
                                    />
                                </Field>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            <Section title="Page 5: Next Steps" description="Final CTA flow and step-by-step rollout.">
                <div className="proposal-builder-grid proposal-builder-grid--two">
                    <Field label="Top Label">
                        <input
                            value={nextSteps.eyebrow}
                            onChange={(event) => update(['pages', 'nextSteps', 'eyebrow'], event.target.value)}
                        />
                    </Field>
                    <Field label="Kicker">
                        <input
                            value={nextSteps.kicker}
                            onChange={(event) => update(['pages', 'nextSteps', 'kicker'], event.target.value)}
                        />
                    </Field>
                </div>

                <Field label="Page Heading">
                    <input
                        value={nextSteps.title}
                        onChange={(event) => update(['pages', 'nextSteps', 'title'], event.target.value)}
                    />
                </Field>

                <Field label="Intro Paragraph">
                    <textarea
                        rows={3}
                        value={nextSteps.intro}
                        onChange={(event) => update(['pages', 'nextSteps', 'intro'], event.target.value)}
                    />
                </Field>

                <div className="proposal-builder-grid proposal-builder-grid--two">
                    {nextSteps.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="proposal-builder-card">
                            <Field label={`Step ${stepIndex + 1} Number`}>
                                <input
                                    value={step.number}
                                    onChange={(event) => update(['pages', 'nextSteps', 'steps', stepIndex, 'number'], event.target.value)}
                                />
                            </Field>
                            <Field label={`Step ${stepIndex + 1} Title`}>
                                <input
                                    value={step.title}
                                    onChange={(event) => update(['pages', 'nextSteps', 'steps', stepIndex, 'title'], event.target.value)}
                                />
                            </Field>
                            <Field label={`Step ${stepIndex + 1} Text`}>
                                <textarea
                                    rows={4}
                                    value={step.text}
                                    onChange={(event) => update(['pages', 'nextSteps', 'steps', stepIndex, 'text'], event.target.value)}
                                />
                            </Field>
                        </div>
                    ))}
                </div>
            </Section>
        </main>
    );
}
