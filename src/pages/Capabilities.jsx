import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ServicesSection from '../components/Services';

export default function Capabilities() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".anim-elem", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={comp} className="pt-32 md:pt-48 pb-0">
            <div className="max-w-7xl mx-auto px-6 mb-24">
                <span className="anim-elem font-mono text-xs uppercase tracking-widest text-deepGreen/50 mb-8 block">Capabilities</span>
                <h1 className="anim-elem text-6xl md:text-8xl font-sans font-medium mb-12 text-deepGreen tracking-tight">End-to-end<br /><span className="font-serif italic text-mutedGreen">execution.</span></h1>
                <p className="anim-elem font-sans font-light text-xl md:text-2xl text-deepGreen/80 leading-relaxed max-w-2xl">
                    By unifying strategy, production, and digital engineering, we eliminate the friction of managing multiple specialized agencies.
                </p>
            </div>

            {/* Re-use the Services component for the detailed breakdown */}
            <div className="anim-elem">
                <ServicesSection />
            </div>
        </main>
    );
}
