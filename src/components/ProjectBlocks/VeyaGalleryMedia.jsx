import React from 'react';

export default function VeyaGalleryMedia({ images = [], videos = [], pattern = '1-2' }) {
    // Patterns control CSS grid layout inside index.css
    // pattern--1-1 (1 col)
    // pattern--1-2 (2 cols: 1 primary left, 2 stacked right)
    // pattern--2-1 (2 cols: 2 stacked left, 1 primary right)
    // pattern--2-2 (2 cols evenly)
    // pattern--3-3 (3 cols evenly)

    const mediaList = [...videos.map(v => ({ type: 'video', src: v })), ...images.map(img => ({ type: 'image', src: img }))];

    if (mediaList.length === 0) return null;

    return (
        <section className={`veya-gallery-media veya-gallery-media--pattern--${pattern} align wp-block-veya-gallery-media`}>
            <div className="veya-gallery-media__container">
                {mediaList.map((media, idx) => (
                    <picture key={idx} className="veya-media__picture">
                        {media.type === 'video' ? (
                            <video src={media.src} autoPlay loop muted playsInline className="veya-media__image object-cover w-full h-full" />
                        ) : (
                            <img src={media.src} className="veya-media__image object-cover w-full h-full" alt={`Gallery media ${idx + 1}`} loading="lazy" />
                        )}
                    </picture>
                ))}
            </div>
        </section>
    );
}
