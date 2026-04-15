import React from 'react';

export default function VeyaHeroClient({ title, details = [] }) {
    return (
        <section className="veya-hero-client align wp-block-veya-hero-client">
            <div className="veya-hero-client__container">
                <h1 className="veya-hero-client__name typo-headings-h1">{title}</h1>
                {details && details.length > 0 && (
                    <dl className="veya-hero-client__technical-data typo-body-m">
                        {details.map((detail, idx) => (
                            <div key={idx} className="veya-hero-client__technical-item">
                                <dt className="veya-hero-client__technical-item-label typo-cta-link-secondary">{detail.label}:</dt>
                                <dd className="veya-hero-client__technical-item-value typo-cta-link-secondary">{detail.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </section>
    );
}
