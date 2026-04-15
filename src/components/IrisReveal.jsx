import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionBridge
 * ─────────────
 * A quiet transition between the beige Philosophy section and the dark
 * Projects section. Two things happen as you scroll through:
 *   1. Background smoothly blends from beige → charcoal → #111
 *   2. A thin horizontal rule + label drift upward at a slower parallax rate
 */
export default function SectionBridge() {
    const wrapRef  = useRef(null);
    const ruleRef  = useRef(null);
    const labelRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // Parallax drift — rule moves up slower than the page scroll
            gsap.fromTo(
                [ruleRef.current, labelRef.current],
                { y: 40 },
                {
                    y: -40,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                }
            );

        }, wrapRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={wrapRef}
            aria-hidden="true"
            style={{
                height: '30vh',
                background: 'linear-gradient(to bottom, #D1D0CB 0%, #3a3832 40%, #111111 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <span
                ref={labelRef}
                style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(253,254,250,0.25)',
                }}
            >
                Selected Work
            </span>
            <div
                ref={ruleRef}
                style={{
                    width: '1px',
                    height: '48px',
                    background: 'linear-gradient(to bottom, transparent, rgba(253,254,250,0.2), transparent)',
                }}
            />
        </div>
    );
}
