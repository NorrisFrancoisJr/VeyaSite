import React from 'react';

export default function VeyaSliderMedia({ images = [], pattern = '1-1' }) {
    if (!images || images.length === 0) return null;
    
    // Pattern 1-1 is full bleed, 3-3 is padded constrained
    return (
        <section className={`veya-slider-media veya-slider-media--pattern--${pattern} align wp-block-veya-slider-media`}>
            <div className="veya-slider-media__swiper swiper">
                <div className="veya-slider-media__swiper-wrapper swiper-wrapper">
                    {images.map((img, idx) => (
                        <div key={idx} className="veya-slider-media__slide swiper-slide" style={{ width: '100%' }}>
                            <picture className="veya-media__picture">
                                <img 
                                    src={img} 
                                    className="veya-media__image object-cover w-full h-full" 
                                    alt={`Slide ${idx + 1}`} 
                                    loading="lazy" 
                                />
                            </picture>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
