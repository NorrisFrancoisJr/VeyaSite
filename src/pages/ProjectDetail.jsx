import React, { useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { projects } from '../data/projects';

import VeyaHeroClient from '../components/ProjectBlocks/VeyaHeroClient';
import VeyaSliderMedia from '../components/ProjectBlocks/VeyaSliderMedia';
import VeyaSectionText from '../components/ProjectBlocks/VeyaSectionText';
import VeyaGalleryMedia from '../components/ProjectBlocks/VeyaGalleryMedia';

export default function ProjectDetail() {
    const { id } = useParams();
    // find project by id from shared pool, fallback to turtle-beach-villa
    const data = projects.find(p => p.id === id) || projects.find(p => p.id === "turtle-beach-villa");
    const comp = useRef(null);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const renderBlock = (block, idx) => {
        switch (block.type) {
            case "VeyaSliderMedia":
                return <VeyaSliderMedia key={idx} images={block.media} pattern={block.pattern} />;
            case "VeyaSectionText":
                return <VeyaSectionText key={idx} topLabel={block.topLabel} title={block.title} body={block.body} layout={block.layout} />;
            case "VeyaGalleryMedia":
                return <VeyaGalleryMedia key={idx} images={block.images || []} videos={block.videos || []} pattern={block.pattern} />;
            default:
                return null;
        }
    };

    return (
        <main ref={comp} className="site-main bg-offWhite">
            
            {/* Return Navigation */}
            <div className="pt-32 px-[var(--spacing--grid--margins)] max-w-[var(--spacing--grid--width)] mx-auto">
                 <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-deepGreen hover:text-mutedGreen transition-colors mb-6 group">
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Selected Work
                 </Link>
            </div>

            {/* Modular Layout Engine */}
            <article className="veya_client type-veya_client status-publish hentry">
                <div className="entry-content">
                    
                    {/* Standardized Veya Hero Meta Block */}
                    <VeyaHeroClient title={data.name} details={data.clientDetails || [{label: 'Services', value: data.category}]} />

                    {/* Iterate payload blocks array if exists, else fallback block for legacy mocked data */}
                    {data.blocks && data.blocks.length > 0 ? (
                        data.blocks.map((block, idx) => renderBlock(block, idx))
                    ) : (
                        /* Fallback rendering for the legacy project objects which lack modular arrays */
                        <>
                            <VeyaSliderMedia images={[data.image]} pattern="1-1" />
                            <VeyaSectionText title="Cinematic Narrative" body="A detailed case study for this project is currently in production. Check back later for a full structural teardown." layout="centered" topLabel="Concept in Progress" />
                        </>
                    )}

                </div>
            </article>

            {/* Footer handled globally by Layout */}
        </main>
    );
}
