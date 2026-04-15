import React from 'react';

export default function TrustBar() {
    return (
        <section className="py-12 px-6 bg-darkOffWhite border-b border-deepGreen/5 flex justify-center">
            <div className="max-w-7xl w-full flex flex-col items-center gap-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-deepGreen/40">Trusted by visionary brands</span>
                <div className="w-full flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-16 opacity-60 grayscale">
                    <div className="font-sans font-bold text-xl tracking-tighter">DISCOVER DOMINICA</div>
                    <div className="font-serif italic text-2xl font-semibold">GIZ</div>
                    <div className="font-sans font-black text-2xl tracking-widest">OECS</div>
                    <div className="font-mono text-xs uppercase tracking-widest font-bold">Dominica Festivals</div>
                </div>
            </div>
        </section>
    );
}
