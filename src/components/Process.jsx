import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
    const comp = useRef(null);
    const trackRef = useRef(null);
    const [progress, setProgress] = useState(0);

    const steps = [
        { num: "01", title: "Discover & Audit", desc: "We immerse ourselves in your property, analyzing current market perception, audience architecture, and competitive landscape to find your unique white space." },
        { num: "02", title: "Strategic Definition", desc: "We establish the brand's architectural truth—defining the visual language, verbal identity, and core narrative that will command a premium." },
        { num: "03", title: "Cinematic Creation", desc: "Our production and design teams execute the vision, capturing world-class imagery and engineering high-conviction digital experiences." },
        { num: "04", title: "Launch & Evolve", desc: "We deploy the brand ecosystem with precision and establish a framework for ongoing editorial content and conversion optimization." }
    ];

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const track = trackRef.current;
            const sections = gsap.utils.toArray('.process-card');

            // 1. Horizontal Scroll Tween
            const scrollTween = gsap.to(track, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: comp.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (sections.length - 1),
                    end: () => "+=" + track.offsetWidth,
                    onUpdate: (self) => setProgress(self.progress)
                }
            });

            // 2. Container Animation for each card entering
            sections.forEach((section) => {
                const content = section.querySelector('.card-content');

                gsap.from(content, {
                    y: 60,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: scrollTween,
                        start: "left center",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="methodology" className="relative h-screen bg-offWhite text-deepGreen overflow-hidden pt-24 md:pt-32">

            {/* Header & Progress Indicator (Fixed while pinned) */}
            <div className="absolute top-24 md:top-32 left-0 w-full px-6 z-20 pointer-events-none">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-deepGreen/50 mb-4 block">Methodology</span>
                        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tight">How we engineer premium perception.</h2>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full md:w-64 flex flex-col gap-3">
                        <div className="flex justify-between font-mono text-[10px] tracking-widest text-deepGreen/50">
                            <span>01</span>
                            <span>04</span>
                        </div>
                        <div className="w-full h-[1px] bg-deepGreen/10 relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-mutedGreen transition-all duration-100 ease-out"
                                style={{ width: `${progress * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Track */}
            <div className="h-full flex items-center w-[400vw] lg:w-[300vw]" ref={trackRef}>
                {steps.map((step, i) => (
                    <div key={i} className="process-card w-screen lg:w-[75vw] h-full flex items-center px-6 shrink-0 relative">
                        <div className="card-content max-w-2xl mx-auto md:ml-[10%] pt-32 md:pt-0">
                            <div className="font-mono text-xs text-deepGreen/30 mb-8 md:mb-12 border border-deepGreen/10 px-4 py-2 w-fit rounded-full bg-white/5 backdrop-blur-sm">
                                Phase {step.num}
                            </div>
                            <h3 className="font-serif italic text-5xl md:text-7xl lg:text-[6rem] mb-6 md:mb-10 text-deepGreen tracking-tight leading-[0.9]">
                                {step.title}
                            </h3>
                            <p className="font-sans font-light text-deepGreen/70 text-lg md:text-2xl leading-relaxed max-w-xl">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}
