import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophySection() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Parallax for Layout Images
            gsap.fromTo('.phil-img-1',
                { y: -50 },
                {
                    y: 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: comp.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

            gsap.fromTo('.phil-img-2',
                { y: 50 },
                {
                    y: -100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: comp.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );

        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} id="philosophy" className="pt-32 pb-16 md:pt-52 md:pb-24 px-6 bg-transparent text-deepGreen relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Text Column */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 relative z-20">
                        <span className="text-editorial-sub text-deepGreen/50 mb-12 block">The Philosophy</span>
                        <TextReveal as="h2" className="text-editorial-h2 mb-8">
                            We refuse to build <span className="italic text-mutedGreen">generic templates</span> that dilute the soul of a property.
                        </TextReveal>
                        <p className="font-sans font-light text-xl text-deepGreen/70 max-w-lg">
                            We focus on absolute clarity, cinematic storytelling, and commanding brand perception.
                        </p>
                    </div>

                    {/* Image Column - Asymmetrical Grid */}
                    <div className="w-full lg:w-1/2 relative h-[600px] lg:h-[800px] order-1 lg:order-2">
                        {/* Image 1: Top Right, Taller */}
                        <div className="phil-img-1 absolute top-0 right-0 w-[80%] h-[70%] z-10 overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop" alt="Caribbean coastline" className="w-full h-full object-cover scale-[1.15]" />
                        </div>
                        {/* Image 2: Bottom Left, Wider, Overlapping */}
                        <div className="phil-img-2 absolute bottom-10 left-[-10%] md:left-10 w-[60%] h-[50%] z-20 overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop" alt="Eco resort detail" className="w-full h-full object-cover scale-[1.15]" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
