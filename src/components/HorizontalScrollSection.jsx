import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollSection() {
    const containerRef = useRef(null);

    const steps = [
        {
            num: "01",
            title: "Audit Perception",
            desc: "We immerse ourselves in the landscape of your brand to analyze the cultural context of your destination.",
            img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop"
        },
        {
            num: "02",
            title: "Define Positioning",
            desc: "We architect the core positioning that commands premium market value and differentiation.",
            img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
        },
        {
            num: "03",
            title: "Visual Worldbuilding",
            desc: "Translating strategy into a cohesive aesthetic that spans typography, color theory, and spatial design.",
            img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop"
        },
        {
            num: "04",
            title: "Cinematic Production",
            desc: "Every frame is engineered for emotional impact and premium aspiration.",
            img: "https://images.unsplash.com/photo-1518131672697-613becd4fab5?q=80&w=2000&auto=format&fit=crop"
        },
        {
            num: "05",
            title: "Digital Flagship",
            desc: "Fusing motion, storytelling, and conversion architecture into a world-class platform.",
            img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
        }
    ];

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.method-card');
            
            // Background color change for the layout
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#FAF8F3", color: "#1E1F1C", duration: 1.2, ease: "power2.out" }),
                onEnterBack: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#FAF8F3", color: "#1E1F1C", duration: 1.2, ease: "power2.out" }),
                onLeave: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#000", color: "#FFF", duration: 1.2, ease: "power2.out" }),
                onLeaveBack: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#000", color: "#FFF", duration: 1.2, ease: "power2.out" }),
            });

            // Animate cards on scroll
            cards.forEach((card) => {
                gsap.fromTo(card, 
                    { y: 60, opacity: 0 },
                    {
                        y: 0, 
                        opacity: 1, 
                        duration: 1, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%", // slightly before the card hits the viewport
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // The Distinction entrance
            gsap.from(".whyveya-elem", {
                y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power2.out",
                scrollTrigger: {
                    trigger: ".panel-whyveya",
                    start: "top 70%",
                }
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full pb-32 pt-24 mt-24">
            
            <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-32">
                
                {/* Left Column - Sticky */}
                <div className="w-full lg:w-5/12">
                    <div className="sticky top-40">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#1E1F1C]/50 mb-6 block">Our Innovation Mark</span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight mb-6 leading-[1.05]">
                            The VEYA <br/> 
                            <span className="font-serif italic text-mutedGreen">Method.</span>
                        </h2>
                        <p className="text-lg md:text-xl font-light text-[#1E1F1C]/70 leading-relaxed max-w-sm">
                            Our proprietary approach to architecting cinematic, new-luxury digital experiences. It’s how we transform destinations and properties into global icons.
                        </p>
                    </div>
                </div>

                {/* Right Column - Scrolling Cards */}
                <div className="w-full lg:w-7/12 flex flex-col pt-12 lg:pt-32">
                    {steps.map((step, i) => (
                        <div key={i} className="method-card pb-16 lg:pb-24 border-b border-[#1E1F1C]/10 last:border-b-0 mb-16 lg:mb-24 last:mb-0">
                            <div className="font-mono text-xs text-mutedGreen border border-mutedGreen/40 px-3 py-1 w-fit rounded-full mb-8">
                                Phase {step.num}
                            </div>
                            <h3 className="text-3xl lg:text-5xl font-sans tracking-tight mb-4">
                                {step.title}
                            </h3>
                            <p className="text-lg lg:text-xl font-light text-[#1E1F1C]/70 leading-relaxed mb-10 max-w-lg">
                                {step.desc}
                            </p>
                            
                            <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-[#1E1F1C]/5 rounded-[2rem] overflow-hidden">
                                <img src={step.img} alt={step.title} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 hover:scale-105" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Panel 6: The VEYA Distinction */}
            {/* Keeping the Distinction as a standalone visual anchor at the end of the section */}
            <div className="container mx-auto px-6 lg:px-12 mt-32">
                <div className="panel-whyveya w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24 bg-deepGreen text-offWhite rounded-[3rem] p-12 lg:p-24 shadow-2xl">
                    <div className="whyveya-elem lg:w-1/2 w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 order-2 lg:order-1 relative">
                        <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop" alt="Cinematic coastal view" className="w-full h-full object-cover img-zoom opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-1000" />
                        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>
                    </div>
                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <span className="whyveya-elem font-mono text-xs uppercase tracking-widest text-mutedGreen mb-6 block">The VEYA Distinction</span>
                        <h2 className="whyveya-elem text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight mb-8 leading-[1.1]">
                            Global quality.<br/>
                            <span className="font-serif italic text-mutedGreen">Caribbean fluency.</span>
                        </h2>
                        <div className="whyveya-elem flex flex-col gap-6 font-sans font-light text-offWhite/80 text-lg md:text-xl leading-relaxed">
                            <p>We operate at the intersection of high-end hospitality and authentic regional storytelling. We don't parachute in; we understand the nuances of Caribbean light, culture, and architecture.</p>
                            <p>By combining strategy, world-class film production, and elite digital design under one roof, we eliminate the friction of managing multiple agencies.</p>
                            <ul className="mt-8 flex flex-col gap-4 font-mono text-xs uppercase tracking-widest text-offWhite/60">
                                <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-mutedGreen rounded-full"></div> End-to-end execution</li>
                                <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-mutedGreen rounded-full"></div> Deep hospitality expertise</li>
                                <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 bg-mutedGreen rounded-full"></div> ROI-focused digital design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
