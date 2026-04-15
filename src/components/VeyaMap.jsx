import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VeyaMap() {
    const [hovered, setHovered] = useState(null);
    const comp = useRef(null);
    const innerRef = useRef(null);

    const circles = [
        { 
            id: 'art', 
            label: 'Art', 
            definition: 'Perception',
            blurb: 'We shape how a place is seen and felt — using image, light, and narrative to elevate it beyond what exists into something people aspire to experience.',
            cx: 500, 
            cy: 320, 
            color: 'var(--lux-umber)' 
        },
        { 
            id: 'business', 
            label: 'Tech', 
            definition: 'Execution',
            blurb: 'We build the systems that carry that perception to market — fast, precise, and designed to convert attention into demand.',
            cx: 656, 
            cy: 590, 
            color: 'var(--lux-charcoal)' 
        },
        { 
            id: 'science', 
            label: 'Strategy', 
            definition: 'Positioning',
            blurb: 'We define where a brand sits and how it stands out — ensuring it competes at the right level of the global market.',
            cx: 344, 
            cy: 590, 
            color: 'var(--lux-forest)' 
        }
    ];
    
    const ringsCount = 40;
    const rings = Array.from({ length: ringsCount });
    const R_INCREMENT = 320 / ringsCount;

    const handleInteractiveKeyDown = (event, id) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setHovered(id);
        }
    };

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // "Breathing" and "Focusing" animation for the rings on scroll
            gsap.fromTo(".veya-rings-group circle", 
                { scale: 0.8, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1,
                    stagger: {
                        each: 0.015,
                        from: "center"
                    },
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: comp.current,
                        start: "top 80%",
                        end: "top 20%",
                        scrub: 1
                    }
                }
            );

            // Subtle scale or breathing effect instead of rotation
            gsap.fromTo(".veya-svg-instrument", 
                { scale: 0.95 },
                { 
                    scale: 1,
                    ease: "sine.inOut",
                    scrollTrigger: {
                        trigger: comp.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

            // Headline reveal
            gsap.fromTo(".philosophy-headline", 
                { y: 60, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1.5, 
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: comp.current,
                        start: "top 60%"
                    }
                }
            );

            // Parallax: inner content drifts up slowly as SelectedWork slides over
            gsap.to(innerRef.current, {
                y: -80,
                ease: 'none',
                scrollTrigger: {
                    trigger: comp.current,
                    start: 'bottom bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    const activeInfo = circles.find(c => c.id === hovered) || (hovered === 'mix' ? { label: 'VEYA', definition: 'The System', blurb: 'Art, technology, and strategy working as one — to position every project at the highest level of the global market.' } : null);

    return (
        <section 
            ref={comp}
            className="veya-map sticky top-0 z-10" 
            style={{ backgroundColor: 'var(--ref--colors--lux-beige)' }}
            id="block_veya_philosophy"
        >
            {/* overflow scoped to inner so sticky isn't broken */}
            <div ref={innerRef} className="py-32 md:py-64" style={{ overflow: 'hidden' }}>
            <div className="w-full max-w-[1720px] mx-auto px-10 md:px-20 grid lg:grid-cols-12 gap-16 items-start">
                
                {/* Asymmetrical Typography Column */}
                <div className="lg:col-span-5 z-20 sticky top-32">
                    <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-charcoal/40 mb-10 block">Editorial Philosophy</span>
                    
                    <h2 className="philosophy-headline text-charcoal text-7xl md:text-8xl lg:text-[8rem] leading-[0.85] font-light tracking-tighter mb-16">
                        The Three <br />
                        <em className="font-serif italic font-normal ml-12 lg:ml-24">Pillars</em>
                    </h2>

                    <div className="relative h-48">
                        {activeInfo ? (
                            <div className="absolute inset-0 transition-opacity duration-500 opacity-100">
                                <h4 className="font-serif italic text-3xl text-charcoal mb-4">
                                    {activeInfo.label}: <span className="not-italic font-sans text-sm uppercase tracking-widest opacity-60 ml-4">{activeInfo.definition}</span>
                                </h4>
                                <p className="font-sans font-light text-xl text-charcoal/70 max-w-sm leading-relaxed">
                                    {activeInfo.blurb}
                                </p>
                            </div>
                        ) : (
                            <div className="absolute inset-0 transition-opacity duration-500 opacity-100">
                                <p className="font-sans font-light text-2xl text-charcoal/40 max-w-md leading-relaxed italic">
                                    Select each pillar to understand how we position our clients globally.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Precision Visual Column (Interactive SVG) */}
                <div className="lg:col-span-7 w-full flex justify-end items-center relative select-none lg:pr-20">
                    <svg 
                        viewBox="0 0 1000 1000" 
                        className="veya-svg-instrument w-full h-auto max-w-[1000px] overflow-visible" 
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <clipPath id="clip-art">
                                <circle cx={500} cy={320} r={320} />
                            </clipPath>
                            <clipPath id="clip-art-business" clipPath="url(#clip-art)">
                                <circle cx={656} cy={590} r={320} />
                            </clipPath>
                        </defs>

                        {/* Intersection Multiply Blends */}
                        <g className="mix-blend-multiply opacity-90">
                            {circles.map(c => (
                                <circle
                                    key={`bg-${c.id}`}
                                    cx={c.cx}
                                    cy={c.cy}
                                    r={320}
                                    fill={c.color}
                                    className={`transition-all duration-1000 ease-out cursor-pointer ${hovered === c.id ? 'opacity-100' : 'opacity-20'}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${c.label}: ${c.definition}. ${c.blurb}`}
                                    onMouseEnter={() => setHovered(c.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    onFocus={() => setHovered(c.id)}
                                    onBlur={() => setHovered(null)}
                                    onClick={() => setHovered(c.id)}
                                    onKeyDown={(event) => handleInteractiveKeyDown(event, c.id)}
                                />
                            ))}
                        </g>

                        {/* The "Compass Gold" Center Reward */}
                        <g 
                            className={`transition-all duration-700 ease-out cursor-pointer ${hovered === 'mix' ? 'opacity-100' : 'opacity-40'}`}
                            role="button"
                            tabIndex={0}
                            aria-label="VEYA: The System. Art, technology, and strategy working as one."
                            onMouseEnter={() => setHovered('mix')}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered('mix')}
                            onBlur={() => setHovered(null)}
                            onClick={() => setHovered('mix')}
                            onKeyDown={(event) => handleInteractiveKeyDown(event, 'mix')}
                        >
                            <circle
                                cx={344} 
                                cy={590} 
                                r={320}
                                fill="var(--lux-gold)"
                                clipPath="url(#clip-art-business)"
                                className={`transition-transform duration-700 ease-out ${hovered === 'mix' ? 'scale-[1.05]' : ''}`}
                                style={{ transformOrigin: '480px 480px' }}
                            />
                            
                            {/* Hidden Logo Reveal */}
                            <image 
                                href="/veya-logo.svg" 
                                x="400" 
                                y="400" 
                                width="200" 
                                height="200"
                                className={`transition-all duration-1000 ease-out pointer-events-none ${hovered === 'mix' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                                style={{ 
                                    transformOrigin: '500px 500px',
                                    filter: 'brightness(0) invert(1)' // Make it white over the gold
                                }}
                            />
                        </g>

                        {/* Precision Concentric Rings */}
                        {circles.map(c => (
                            <g key={`rings-${c.id}`} className="veya-rings-group pointer-events-none">
                                {rings.map((_, i) => (
                                    <circle 
                                        key={i}
                                        cx={c.cx}
                                        cy={c.cy}
                                        r={(i + 1) * R_INCREMENT}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                        className={`transition-colors duration-700 ease-out ${
                                            hovered === c.id 
                                                ? 'text-charcoal/60' 
                                                : 'text-charcoal/10'
                                        }`}
                                    />
                                ))}
                            </g>
                        ))}

                        {/* Minimalist Floating Labels */}
                        {circles.map(c => (
                            <text
                                key={`text-${c.id}`}
                                x={c.cx}
                                y={c.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`font-serif italic text-4xl md:text-[48px] pointer-events-none transition-all duration-700 ease-out ${
                                    hovered === c.id ? 'fill-charcoal opacity-100 tracking-widest' : 'fill-charcoal/20 opacity-40'
                                }`}
                            >
                                {c.label}
                            </text>
                        ))}
                    </svg>
                </div>

            </div>
            </div>{/* end innerRef */}
        </section>
    );
}
