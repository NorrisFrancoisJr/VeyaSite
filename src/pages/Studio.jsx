import gsap from 'gsap';
import { useRef, useLayoutEffect } from 'react';
import InquirySection from '../components/Inquiry';

export default function Studio() {
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
        <main ref={comp} className="pt-32 md:pt-48 pb-32 px-6">
            <div className="max-w-4xl mx-auto">
                <span className="anim-elem font-mono text-xs uppercase tracking-widest text-deepGreen/50 mb-8 block">The Studio</span>
                <h1 className="anim-elem text-6xl md:text-8xl font-serif italic mb-12 text-deepGreen leading-tight">Quiet luxury.<br />Loud resonance.</h1>
                <div className="anim-elem font-sans font-light text-xl md:text-2xl text-deepGreen/80 leading-relaxed mb-16 max-w-2xl">
                    <p className="mb-8">We are a specialized creative studio operating solely at the intersection of premium hospitality and authentic regional storytelling.</p>
                    <p>Founded on the belief that destination brands require more than templated digital solutions, we combine strategy, world-class film production, and elite design under one roof.</p>
                </div>

                <div className="anim-elem w-full aspect-[21/9] rounded-[2rem] overflow-hidden bg-darkOffWhite mb-24">
                    {/* Placeholder for a studio/culture image */}
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Architectural study" />
                </div>

                <div className="anim-elem border-t border-deepGreen/10 pt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h3 className="text-2xl font-serif italic mb-4">Our Guiding Principle</h3>
                        <p className="font-sans font-light text-deepGreen/70 leading-relaxed">
                            We do not parachute in. We understand the nuances of Caribbean light, culture, and architecture. This fluency allows us to position properties not just as places to stay, but as cultural and ecological anchor points.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif italic mb-4">Leadership</h3>
                        <p className="font-sans font-light text-deepGreen/70 leading-relaxed">
                            Led by creatives who have navigated global luxury markets and returned to the Caribbean to elevate the region's digital narrative.
                        </p>
                    </div>
                </div>
            </div>
            <InquirySection />
        </main>
    );
}
