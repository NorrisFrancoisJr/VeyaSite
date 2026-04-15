import React from 'react';

export default function VeyaSectionText({ topLabel, title, body, layout = 'centered' }) {
    // layout can be 'centered', 'split', 'start'
    
    return (
        <div className={`veya-section-text veya-section-text--layout--${layout} align wp-block-veya-section-text`}>
            <div className="veya-section-text__container">
                {topLabel && (
                    <span className="font-mono text-xs uppercase tracking-widest text-mutedGreen block mb-6 px-[var(--_lead-mi)]">
                        {topLabel}
                    </span>
                )}
                {title && (
                    <h2 className="veya-section-text__title typo-headings-h1">
                        {title}
                    </h2>
                )}
                
                {body && (
                    <div className="veya-section-text__content">
                        <div className="veya-section-text__lead typo-body-m">
                            {body}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
