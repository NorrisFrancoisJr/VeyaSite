import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ServicesSection() {
    const [activeTab, setActiveTab] = useState('branding');

    const capabilities = [
        {
            id: "branding",
            title: "Branding",
            desc: "We define what a brand stands for and how it shows up. Positioning, identity, and direction built to resonate with the right audience and hold long-term value.",
            link: "/branding",
            img: "https://spherical.co/wp-content/uploads/2025/12/9c7bc369bdff262fe27dc089e018d22fe4a8a4a6-scaled.jpg"
        },
        {
            id: "web",
            title: "Web",
            desc: "High-performance websites for hospitality. Designed to immerse, built to convert, and structured to support direct bookings across properties.",
            link: "/web",
            img: "https://spherical.co/wp-content/uploads/2025/12/81b8f82c89ea953bbb7d88a83cb8f9b242ccc310.webp"
        },
        {
            id: "social",
            title: "Social",
            desc: "Social built with intent. Story-driven content and platform-native execution designed to shape perception and drive meaningful action.",
            link: "/social",
            img: "https://spherical.co/wp-content/uploads/2025/12/Rectangle-8657-3.webp"
        },
        {
            id: "content",
            title: "Content",
            desc: "Cinematic photography and film crafted to capture the spirit of a place and translate it across every channel with clarity and impact.",
            link: "/content",
            img: "https://spherical.co/wp-content/uploads/2025/12/b775078476c0db1a5ac631450519aadf50acffcd.webp"
        },
    ];

    return (
        <section id="services">
            {/* Introductory Header matching Veya's Layout */}
            <div style={{ paddingTop: "var(--wp--preset--spacing--75)" }} className="veya-section-text veya-section-text--layout--start align is-style-dark wp-block-veya-section-text">
                <div className="veya-section-text__container">
                    <h2 className="veya-section-text__title typo-headings-h1 text-white">
                        One system. Built to position, attract, and convert.
                    </h2>
                </div>
            </div>

            {/* The Tabbed Capabilities Block */}
            <div className="veya-tabbed-content is-style-dark align is-style-dark wp-block-veya-tabbed-content">
                <div className="veya-tabbed-content__container text-white">
                    {/* Preserving the custom web-component tag incase CSS descendant selectors depend on it */}
                    <ob-tabbed-content>
                        
                        {/* Tab List */}
                        <ul className="veya-tabbed-content__nav typo-cta-link-secondary">
                            {capabilities.map(cap => (
                                <li 
                                    key={cap.id} 
                                    data-tabbed-content-tab={true} 
                                    data-tabbed-content-active={activeTab === cap.id ? true : undefined}
                                >
                                    <button
                                        type="button"
                                        data-animated="true"
                                        onClick={() => setActiveTab(cap.id)}
                                    >
                                        <span data-animated-text={cap.title}>
                                            {cap.title}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Panels */}
                        <div className="veya-tabbed-content__panels">
                            {capabilities.map(cap => (
                                <div 
                                    key={`panel-${cap.id}`}
                                    data-tabbed-content-pane={true}
                                    data-tabbed-content-active={activeTab === cap.id ? true : undefined}
                                    hidden={activeTab !== cap.id}
                                    className="veya-tabbed-content__panel"
                                    id={`${cap.id}-block`}
                                >
                                    <h3 className="veya-tabbed-content__panel-title typo-headings-h2">
                                        {cap.title}
                                    </h3>

                                    <div className="veya-tabbed-content__panel-content typo-body-m">
                                        <p>
                                            <Link style={{ color: "#fdfefa", textDecoration: "underline" }} to={cap.link}>
                                                {cap.title}
                                            </Link>
                                            {cap.desc.substring(cap.title.length)}
                                        </p>
                                    </div>

                                    <div className="veya-tabbed-content__panel-cta">
                                        <Link
                                            to={cap.link}
                                            className="veya-tabbed-content__panel-cta-link typo-cta-link-primary"
                                            data-animated="true"
                                        >
                                            <span data-animated-text="More+">More+</span>
                                        </Link>
                                    </div>

                                    <Link
                                        to={cap.link}
                                        className="veya-tabbed-content__panel-media cursor-pointer"
                                        aria-label={`View ${cap.title} services`}
                                    >
                                        <picture className="veya-media__picture">
                                            <img 
                                                decoding="async" 
                                                src={cap.img} 
                                                className="veya-media__image object-cover w-full h-full" 
                                                alt={cap.title} 
                                                loading="lazy" 
                                            />
                                        </picture>
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </ob-tabbed-content>
                </div>
            </div>
        </section>
    );
}
