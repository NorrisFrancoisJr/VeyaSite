import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import SelectedWork from '../components/SelectedWork';

export default function Work() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".anim-elem", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={comp} className="pt-32 md:pt-48">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="anim-elem flex flex-wrap gap-4 mb-16 border-b border-deepGreen/10 pb-6">
                    <button className="font-mono text-[10px] uppercase tracking-widest bg-deepGreen text-offWhite px-4 py-2 rounded-full">All Projects</button>
                    <button className="font-mono text-[10px] uppercase tracking-widest border border-deepGreen/20 text-deepGreen hover:border-mutedGreen transition-colors px-4 py-2 rounded-full">Hospitality</button>
                    <button className="font-mono text-[10px] uppercase tracking-widest border border-deepGreen/20 text-deepGreen hover:border-mutedGreen transition-colors px-4 py-2 rounded-full">Destination</button>
                    <button className="font-mono text-[10px] uppercase tracking-widest border border-deepGreen/20 text-deepGreen hover:border-mutedGreen transition-colors px-4 py-2 rounded-full">Digital</button>
                </div>
            </div>

            {/* Re-using the core component, removing the padding top so it flows nicely from the filters */}
            <div className="-mt-32">
                <SelectedWork />
            </div>
        </main>
    );
}
