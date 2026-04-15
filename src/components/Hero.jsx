import React, { useState, useEffect, useCallback, useRef } from 'react';

const headlines = [
    { text: 'We design and build ', em: 'narratives', after: ' that position destinations.' },
    { text: 'Art, ', em: 'technology', after: ', and strategy — applied to hospitality.' },
    { text: 'We shape how places are seen, ', em: 'felt', after: ', and chosen.' },
    { text: 'Cinematic stories ', em: 'engineered', after: ' to perform.' },
    { text: 'Built to stand out. Designed to ', em: 'convert', after: '.' },
];

const CYCLE_INTERVAL = 5000;
const FADE_DURATION = 800;

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef(null);

    const cycleHeadline = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % headlines.length);
            setIsVisible(true);
        }, FADE_DURATION);
    }, []);

    useEffect(() => {
        const interval = setInterval(cycleHeadline, CYCLE_INTERVAL);
        return () => clearInterval(interval);
    }, [cycleHeadline]);

    const current = headlines[currentIndex];

    return (
        <section className="sticky top-0 w-full h-screen overflow-hidden bg-black z-0" id="block_veya_hero">
            
            {/* Full Bleed Video Container */}
            <div className="absolute inset-0 w-full h-full bg-black">
                {/* Poster Still - Shows immediately */}
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
                    style={{ 
                        backgroundImage: 'url(/turtle-beach-villa/optimized/DJI_20251126070059_0026_D.jpg)',
                        opacity: videoLoaded ? 0 : 0.6,
                        filter: 'brightness(0.8) contrast(1.1)'
                    }}
                />
                
                <video 
                    ref={videoRef}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    onPlay={() => setVideoLoaded(true)}
                    className="w-full h-full object-cover brightness-75 contrast-125 transition-opacity duration-1000"
                    style={{ opacity: videoLoaded ? 1 : 0 }}
                >
                    <source src="/turtle-beach-villa/optimized/turtle-hero.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Top Gradient (Stone Fade) */}
            <div className="absolute top-0 left-0 w-full h-1/4 z-10 pointer-events-none bg-gradient-to-b from-[#D1D0CB] via-[#D1D0CB]/20 to-transparent"></div>

            {/* Bottom Gradient (Stone Fade) */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 z-10 pointer-events-none bg-gradient-to-t from-[#D1D0CB] via-[#D1D0CB]/40 to-transparent"></div>

            {/* Hero Content Overlay */}
            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-full max-w-4xl">
                    <h1 
                        className="typo-headings-h2 text-white w-full max-w-3xl mx-auto leading-[1] tracking-tight !text-[1.875rem] sm:!text-5xl md:!text-7xl"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                            transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${FADE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                        }}
                    >
                        <span className="block sm:inline">{current.text}</span>
                        <em className="block font-serif italic font-normal sm:inline">{current.em}</em>
                        <span className="block sm:inline">{current.after}</span>
                    </h1>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-16 left-[var(--spacing--grid--margins)] right-16 z-20 flex items-center gap-6 md:right-auto">
                    <span className="w-3 h-3 shrink-0 rounded-full bg-[#D1D0CB] animate-pulse"></span>
                    <span className="min-w-0 truncate font-sans text-[11px] uppercase tracking-[0.3em] text-[#D1D0CB]">Featured Project / Turtle Beach Villa</span>
                </div>

                {/* Scroll Hint (World Class UX) */}
                <div className="absolute bottom-8 right-[var(--spacing--grid--margins)] z-20 flex flex-col items-center gap-4 opacity-40">
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white [writing-mode:vertical-lr]">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/40 animate-scroll-line" />
                    </div>
                </div>
            </div>

        </section>
    );
}
