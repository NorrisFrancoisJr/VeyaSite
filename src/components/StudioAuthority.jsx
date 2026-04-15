import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function StudioAuthority() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".authority-text", {
                scrollTrigger: {
                    trigger: ".authority-text",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.2
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} className="py-32 md:py-40 bg-offWhite relative border-t border-deepGreen/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                
                {/* Visual / Abstract Representation */}
                <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-deepGreen">
                    <img 
                        src="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=1600&auto=format&fit=crop" 
                        alt="Studio Leadership Perspective" 
                        className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-deepGreen/80 to-transparent pointer-events-none"></div>
                </div>

                {/* Authority Copy */}
                <div className="flex flex-col gap-8 text-deepGreen">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-50 authority-text">Studio Leadership</span>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic tracking-tight leading-tight">
                        <TextReveal>Strategic Partners.</TextReveal>
                        <TextReveal>Caribbean Fluency.</TextReveal>
                    </h2>

                    <div className="font-sans font-light text-deepGreen/80 text-lg md:text-xl leading-relaxed space-y-6 authority-text">
                        <p>
                            We are not just a visual production house; we are strategic partners for destinations and premium brands. Led by a deep understanding of Caribbean nuances, hospitality operations, and place-based storytelling.
                        </p>
                        <p>
                            Our regional experience allows us to navigate the complexities of tourism marketing while delivering world-class, globally competitive digital flagships that drive measurable value and absolute distinction.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-4 pt-8 border-t border-deepGreen/10 authority-text">
                        <div>
                            <span className="block font-serif italic text-3xl mb-1">10+</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Islands Navigated</span>
                        </div>
                        <div>
                            <span className="block font-serif italic text-3xl mb-1">5-Star</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Hospitality Focus</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
