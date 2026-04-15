import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function StudioPOV() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const povSplit = new SplitType('.pov-text', { types: 'lines' });

            gsap.set(povSplit.lines, {
                y: 30,
                opacity: 0,
                rotateX: -15,
                transformOrigin: "top left"
            });

            gsap.to(povSplit.lines, {
                scrollTrigger: {
                    trigger: ".pov-text",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.4,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.2
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} className="py-32 md:py-48 px-6 bg-transparent relative flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-16">
                
                {/* Large Typographic Manifesto Statement */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-sans tracking-tight text-deepGreen leading-[1.1]">
                    <TextReveal as="span" className="block">Luxury is not a price point.</TextReveal>
                    <TextReveal as="span" className="block mt-2">It is a <span className="font-serif italic text-mutedGreen">point of view.</span></TextReveal>
                </h2>

                {/* Short Explanatory Paragraph */}
                <p className="pov-text font-sans font-light text-deepGreen/80 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
                    We believe that premium brands aren't built on features, but on feeling. We focus entirely on perception, atmosphere, and cinematic narrative to craft digital flagships that command absolute authority in the hospitality and destination space.
                </p>

            </div>
        </section>
    );
}
