import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Staggered letter reveal
            tl.fromTo(".preloader-text span",
                { y: 120, opacity: 0, rotateX: -45 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
            )
                // Hold for impact, then stagger letters out
                .to(".preloader-text span",
                    { y: -100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power4.in", delay: 0.6 }
                )
                // Slide the entire curtain up revealing the hero beneath
                .to(comp.current, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut"
                }, "-=0.2");
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={comp} className="fixed inset-0 z-[100] bg-deepGreen flex items-center justify-center text-offWhite pointer-events-none">
            <h1 className="preloader-text overflow-hidden font-serif italic text-6xl md:text-9xl xl:text-[12rem] tracking-[0.2em] flex gap-2 md:gap-8 translate-x-[0.1em]">
                <span className="inline-block transform-origin-bottom">V</span>
                <span className="inline-block transform-origin-bottom">E</span>
                <span className="inline-block transform-origin-bottom">Y</span>
                <span className="inline-block transform-origin-bottom">A</span>
            </h1>
        </div>
    );
}
