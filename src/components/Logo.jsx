import React from 'react';

export default function Logo({ className = "h-8", color = "currentColor" }) {
    return (
        <div 
            className={className}
            style={{
                backgroundColor: color,
                maskImage: 'url(/veya-logo.svg)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: 'url(/veya-logo.svg)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                transition: 'background-color 0.3s ease',
                aspectRatio: '3100 / 1100',
                display: 'inline-block',
                minWidth: '120px'
            }}
            aria-label="VEYA CREATIVE"
            role="img"
        />
    );
}
