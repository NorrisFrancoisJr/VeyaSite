import React, { useEffect } from 'react';
import './ProposalTemplate.css';
import { sabifiRiverResortProposal } from '../proposals/sabifiRiverResort';
import { safeHavenRealEstateProposal } from '../proposals/safeHavenRealEstate';
import {
    customProposalSlug,
    loadStoredCustomProposalData,
} from '../proposals/customProposal';

const proposals = {
    [sabifiRiverResortProposal.slug || 'sabifi-river-resort']: sabifiRiverResortProposal,
    [safeHavenRealEstateProposal.slug]: safeHavenRealEstateProposal,
};

function PageHeader({ eyebrow, page }) {
    return (
        <header className="proposal-page-top">
            <span>{eyebrow}</span>
            <span>{page}</span>
        </header>
    );
}

function PageFooter({ proposal }) {
    return (
        <footer className="proposal-page-bottom">
            <span>{proposal.preparedBy}</span>
            <span>{proposal.client}</span>
            <span>{proposal.contact}</span>
        </footer>
    );
}

function ProposalActions() {
    return (
        <div className="proposal-actions" aria-label="Proposal actions">
            <a href="/" className="proposal-action-link">Back to site</a>
            <button type="button" onClick={() => window.print()}>Save as PDF</button>
        </div>
    );
}

function splitParagraphs(text) {
    return String(text || '')
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

function GenericProposal({ proposal }) {
    const brand = proposal.brand || {};
    const style = {
        '--proposal-charcoal': brand.primary || '#2f3d2f',
        '--proposal-earth': brand.accent || '#8c7a4f',
        '--proposal-page': brand.muted || '#d8d2c2',
        '--proposal-paper': brand.background || '#f7f5ef',
    };

    return (
        <main className="proposal-template proposal-template-generic" style={style} aria-label={`${proposal.title} proposal`}>
            <ProposalActions />

            {proposal.pages.map((page, index) => (
                <section
                    key={`${page.page}-${page.title}`}
                    className={`proposal-page proposal-generic-page proposal-generic-page-${page.layout || 'feature'} ${index === 0 ? 'proposal-generic-cover' : ''}`}
                >
                    <PageHeader eyebrow={page.eyebrow} page={page.page} />

                    <div className="proposal-generic-heading">
                        {index === 0 && proposal.clientLogo ? (
                            <img className="proposal-generic-logo" src={proposal.clientLogo} alt={`${proposal.client} logo`} />
                        ) : null}
                        <p>{index === 0 ? proposal.client : page.kicker}</p>
                        <h1>{index === 0 ? proposal.title : page.title}</h1>
                        {index === 0 && page.title !== proposal.title ? <h2>{page.title}</h2> : null}
                        {page.intro ? <span>{page.intro}</span> : null}
                    </div>

                    <div className="proposal-generic-content">
                        {page.sections.map((section) => (
                            <article key={`${page.page}-${section.heading}`} className="proposal-generic-section">
                                {section.heading ? <h3>{section.heading}</h3> : null}
                                {splitParagraphs(section.body).map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                                {section.items.length ? (
                                    <ul>
                                        {section.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                ) : null}
                            </article>
                        ))}
                    </div>

                    {page.callout ? (
                        <blockquote className="proposal-generic-callout">{page.callout}</blockquote>
                    ) : null}

                    <PageFooter proposal={proposal} />
                </section>
            ))}
        </main>
    );
}

function SabifiProposal({ proposal }) {
    const { vision, focus, deliverables, investment, nextSteps } = proposal.pages;

    return (
        <main className="proposal-template" aria-label="Veya Creative proposal template">
            <ProposalActions />

            <section className="proposal-page proposal-page-cover">
                <PageHeader eyebrow={vision.eyebrow} page={vision.page} />
                <div className="proposal-cover-grid">
                    <img className="proposal-logo" src="/veya-logo.svg" alt="Veya Creative" />
                    <div className="proposal-cover-title">
                        <p>{proposal.partnershipLabel}</p>
                        <h1>{proposal.title}</h1>
                    </div>
                </div>

                <div className="proposal-cover-intro">
                    <h2>{vision.overviewTitle}</h2>
                    {vision.overview.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>

                <div className="proposal-approach">
                    <h2>{vision.approachTitle}</h2>
                    <p>{vision.approachIntro}</p>
                    <div className="proposal-approach-list">
                        {vision.approachPoints.map((point) => (
                            <article key={point.title}>
                                <strong>{point.title}</strong>
                                <span>{point.text}</span>
                            </article>
                        ))}
                    </div>
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page">
                <PageHeader eyebrow={focus.eyebrow} page={focus.page} />
                <div className="proposal-section-heading">
                    <p>{focus.kicker}</p>
                    <h2>{focus.title}</h2>
                </div>

                <div className="proposal-focus-grid">
                    {focus.areas.map((area) => (
                        <article key={area.title} className="proposal-focus-card">
                            <span className="proposal-focus-number">{area.number}</span>
                            <h3>{area.title}</h3>
                            <div>
                                <strong>The Focus</strong>
                                <p>{area.focus}</p>
                            </div>
                            <div className="proposal-outcome-box">
                                <strong>Business Outcome</strong>
                                <p>{area.outcome}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page">
                <PageHeader eyebrow={deliverables.eyebrow} page={deliverables.page} />
                <div className="proposal-section-heading">
                    <p>{deliverables.kicker}</p>
                    <h2>{deliverables.title}</h2>
                </div>

                <div className="proposal-two-column">
                    <section className="proposal-deliverables-panel">
                        <h3>{deliverables.heading} <span>{deliverables.subheading}</span></h3>
                        <ul>
                            {deliverables.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="proposal-strategy-box">
                        <p>{deliverables.strategyLabel}</p>
                        <h3>{deliverables.strategyTitle}</h3>
                        <p>{deliverables.strategyIntro}</p>
                        {deliverables.strategyItems.map((item) => (
                            <div key={item.title}>
                                <strong>{item.title}</strong>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </section>
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page proposal-investment-page">
                <PageHeader eyebrow={investment.eyebrow} page={investment.page} />
                <div className="proposal-section-heading">
                    <p>{investment.kicker}</p>
                    <h2>{investment.title}</h2>
                    {investment.intro && <span>{investment.intro}</span>}
                </div>

                <div className="proposal-pricing-table">
                    {investment.options.map((option) => (
                        <article key={option.name} className={`proposal-pricing-card ${option.label ? 'proposal-pricing-card-featured' : ''}`}>
                            {option.label && <span className="proposal-recommended">{option.label}</span>}
                            <p>{option.option}</p>
                            <h3>{option.name}</h3>
                            <div className="proposal-pricing-price">{option.price}</div>
                            <span>{option.description}</span>
                            {option.details && (
                                <div className="proposal-pricing-details">
                                    {option.details.map((detail) => (
                                        <div key={detail.label}>
                                            <b>{detail.label}</b>
                                            <span>{detail.text}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page proposal-next-page">
                <PageHeader eyebrow={nextSteps.eyebrow} page={nextSteps.page} />
                <div className="proposal-section-heading">
                    <p>{nextSteps.kicker}</p>
                    <h2>{nextSteps.title}</h2>
                </div>

                <ul className="proposal-payment-list">
                    {nextSteps.paymentTerms.map((term) => (
                        <li key={term}>{term}</li>
                    ))}
                </ul>

                <div className="proposal-goal-statement">
                    <p>{nextSteps.goalLabel}</p>
                    <blockquote>{nextSteps.goal}</blockquote>
                </div>
                <PageFooter proposal={proposal} />
            </section>
        </main>
    );
}

function SafeHavenProposal({ proposal }) {
    const { overview, strategy, messaging, investment, nextSteps } = proposal.pages;

    return (
        <main className="proposal-template proposal-template-safe-haven" aria-label="Veya Creative Safe Haven proposal">
            <ProposalActions />

            <section className="proposal-page proposal-safe-cover">
                <PageHeader eyebrow={overview.eyebrow} page={overview.page} />
                <div className="proposal-safe-hero">
                    <div>
                        {proposal.clientLogo ? (
                            <img className="proposal-safe-client-logo" src={proposal.clientLogo} alt={`${proposal.client} logo`} />
                        ) : null}
                        <p>{overview.kicker}</p>
                        <h1>{proposal.title}</h1>
                    </div>
                </div>
                <div className="proposal-safe-overview">
                    <h2>{overview.title}</h2>
                    {overview.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page">
                <PageHeader eyebrow={messaging.eyebrow} page={messaging.page} />
                <div className="proposal-section-heading proposal-safe-heading">
                    <p>{messaging.kicker}</p>
                    <h2>{messaging.title}</h2>
                </div>
                <div className="proposal-safe-script-grid">
                    {messaging.frameworks.map((framework) => (
                        <article key={framework.title} className="proposal-safe-script-card">
                            <span>{framework.subtitle}</span>
                            <h3>{framework.title}</h3>
                            {framework.sections.map((section) => (
                                <div
                                    key={section.label}
                                    className={section.label === 'Sample Script' ? 'proposal-safe-script-sample' : undefined}
                                >
                                    <b>{section.label}</b>
                                    {section.text.split('\n\n').map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                </div>
                            ))}
                        </article>
                    ))}
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page">
                <PageHeader eyebrow={strategy.eyebrow} page={strategy.page} />
                <div className="proposal-section-heading proposal-safe-heading">
                    <p>{strategy.kicker}</p>
                    <h2>{strategy.title}</h2>
                    <span>{strategy.intro}</span>
                </div>
                <div className="proposal-safe-phase-grid">
                    {strategy.phases.map((phase) => (
                        <article key={phase.title} className="proposal-safe-phase-card">
                            <span>{phase.label}</span>
                            <h3>{phase.title}</h3>
                            <div>
                                <b>Target</b>
                                <p>{phase.target}</p>
                            </div>
                            <div>
                                <b>Goal</b>
                                <p>{phase.goal}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page proposal-safe-investment-page">
                <PageHeader eyebrow={investment.eyebrow} page={investment.page} />
                <div className="proposal-safe-investment-card">
                    <p>{investment.kicker}</p>
                    <h2>{investment.title}</h2>
                    <span>{investment.intro}</span>
                    <div className="proposal-safe-total">
                        <small>{investment.totalLabel}</small>
                        <strong>{investment.total}</strong>
                    </div>
                </div>
                <div className="proposal-safe-investment-lower">
                    <div className="proposal-safe-included">
                        <h3>{investment.includedTitle}</h3>
                        <div>
                            {investment.included.map((item) => (
                                <article key={item.title}>
                                    <b>{item.title}</b>
                                    <p>{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className="proposal-safe-payments">
                        <h3>{investment.paymentTitle}</h3>
                        {investment.paymentSchedule.map((item) => (
                            <article key={item.milestone}>
                                <b>{item.milestone}</b>
                                <p>{item.detail}</p>
                            </article>
                        ))}
                    </div>
                </div>
                <PageFooter proposal={proposal} />
            </section>

            <section className="proposal-page proposal-safe-next-page">
                <PageHeader eyebrow={nextSteps.eyebrow} page={nextSteps.page} />
                <div className="proposal-section-heading proposal-safe-heading">
                    <p>{nextSteps.kicker}</p>
                    <h2>{nextSteps.title}</h2>
                    <span>{nextSteps.intro}</span>
                </div>
                <div className="proposal-safe-timeline">
                    {nextSteps.steps.map((step) => (
                        <article key={step.number}>
                            <span>{step.number}</span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </article>
                    ))}
                </div>
                <PageFooter proposal={proposal} />
            </section>
        </main>
    );
}

export default function ProposalTemplate() {
    useEffect(() => {
        document.body.classList.add('proposal-print-view');
        return () => document.body.classList.remove('proposal-print-view');
    }, []);

    const search = new URLSearchParams(window.location.search);
    const requestedProposal = search.get('proposal') || safeHavenRealEstateProposal.slug;
    const selectedProposal = requestedProposal === customProposalSlug
        ? loadStoredCustomProposalData()
        : proposals[requestedProposal] || safeHavenRealEstateProposal;

    useEffect(() => {
        if (search.get('print') !== '1') {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            window.print();
        }, 600);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    if (selectedProposal.slug === safeHavenRealEstateProposal.slug) {
        return <SafeHavenProposal proposal={selectedProposal} />;
    }

    if (selectedProposal.slug === customProposalSlug) {
        return <GenericProposal proposal={selectedProposal} />;
    }

    return <SabifiProposal proposal={selectedProposal} />;
}
