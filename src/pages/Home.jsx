import React from 'react';
import Hero from '../components/Hero';
import VeyaMap from '../components/VeyaMap';
import SelectedWork from '../components/SelectedWork';
import Services from '../components/Services';
import VeyaTextLead from '../components/VeyaTextLead';
import InquirySection from '../components/Inquiry';

export default function Home() {
    return (
        <article className="post-43 page type-page status-publish hentry">
            <div className="entry-content">
                <Hero />
                <VeyaMap />
                <SelectedWork />
                <Services />
                <VeyaTextLead />
                <InquirySection />
            </div>
        </article>
    );
}
