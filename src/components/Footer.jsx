import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
    return (
        <footer className="site-footer is-style-dark bg-charcoal py-24 px-[var(--spacing--grid--margins)]">
            <div className="max-w-[var(--spacing--grid--width)] mx-auto">
                
                {/* Top: Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-24 border-b border-white/5 pb-24">
                    <nav className="flex flex-wrap gap-x-12 gap-y-6">
                        <Link to="/studio" className="typo-cta-link-secondary text-stone/60 hover:text-white transition-colors">Approach</Link>
                        <Link to="/services" className="typo-cta-link-secondary text-stone/60 hover:text-white transition-colors">Services</Link>
                        <Link to="/work" className="typo-cta-link-secondary text-stone/60 hover:text-white transition-colors">Work</Link>
                        <a href="#inquiry" className="typo-cta-link-secondary text-stone/60 hover:text-white transition-colors">Contact</a>
                    </nav>

                    <div className="flex gap-8">
                        <a href="#" className="font-sans text-[10px] uppercase tracking-widest text-stone/40 hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="font-sans text-[10px] uppercase tracking-widest text-stone/40 hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="font-sans text-[10px] uppercase tracking-widest text-stone/40 hover:text-white transition-colors">Behance</a>
                    </div>
                </div>

                {/* Bottom: Massive Logo & Info */}
                <div className="text-center relative py-12">
                    <div className="site-footer__logo-mask mb-8 flex justify-center items-center overflow-hidden">
                         <div className="flex justify-center items-center py-8">
                             <Logo className="h-24 md:h-48 w-auto opacity-10" color="#FFFFFF" />
                         </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 opacity-30 font-sans text-[9px] uppercase tracking-widest text-stone">
                        <span>&copy; 2026 VEYA Creative</span>
                        <div className="flex gap-6">
                            <span>Cinematic Visuals</span>
                            <span>Hospitality & Design</span>
                        </div>
                        <div className="flex gap-6 text-stone/50">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
