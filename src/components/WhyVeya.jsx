import React from 'react';

export default function WhyVeyaSection() {
    return (
        <section className="py-24 px-6 bg-darkOffWhite border-y border-deepGreen/5">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                <div className="lg:w-1/2 w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop" alt="Cinematic coastal view" className="w-full h-full object-cover img-zoom" />
                </div>
                <div className="lg:w-1/2">
                    <span className="font-mono text-xs uppercase tracking-widest text-deepGreen/50 mb-6 block">The VEYA Distinction</span>
                    <h2 className="text-3xl md:text-5xl font-serif italic mb-8 text-deepGreen leading-tight">Global quality.<br />Caribbean fluency.</h2>
                    <div className="flex flex-col gap-6 font-sans font-light text-deepGreen/80 text-lg leading-relaxed">
                        <p>
                            We operate at the intersection of high-end hospitality and authentic regional storytelling. We don't parachute in; we understand the nuances of Caribbean light, culture, and architecture.
                        </p>
                        <p>
                            By combining strategy, world-class film production, and elite digital design under one roof, we eliminate the friction of managing multiple agencies.
                        </p>
                        <ul className="mt-4 flex flex-col gap-3 font-mono text-xs uppercase tracking-widest text-deepGreen/60">
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-mutedGreen rounded-full"></div> End-to-end execution</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-mutedGreen rounded-full"></div> Deep hospitality expertise</li>
                            <li className="flex items-center gap-3"><div className="w-1 h-1 bg-mutedGreen rounded-full"></div> ROI-focused digital design</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
