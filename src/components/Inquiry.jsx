import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function InquirySection() {
    return (
        <section id="inquiry" className="py-40 px-6 bg-offWhite relative z-10 text-center">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-mutedGreen border border-mutedGreen/20 px-4 py-1.5 rounded-full mb-8 bg-mutedGreen/5">Selective Partnerships</span>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif italic tracking-tight text-deepGreen mb-6">Let&rsquo;s build something that stands out &mdash; and performs.</h2>
                <div className="font-sans font-light text-lg md:text-xl text-deepGreen/70 mb-12 max-w-2xl flex flex-col gap-4">
                    <p>We partner with a limited number of brands each year to shape how they are seen and how they compete.</p>
                    <p>Tell us about your project.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <a href="mailto:studio@veya.com" className="premium-hover group relative overflow-hidden bg-deepGreen text-offWhite px-10 py-5 rounded-full font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                        <span className="relative z-10">Start a Conversation</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href="mailto:studio@veya.com" className="font-mono text-xs uppercase tracking-widest text-deepGreen/60 hover:text-mutedGreen transition-colors border-b border-transparent hover:border-mutedGreen/30 pb-1">
                        Or Email Studio
                    </a>
                </div>
            </div>
        </section>
    );
}
