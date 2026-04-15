import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541845157-a4d20bc51cb0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40eb0d8d73?q=80&w=1200&auto=format&fit=crop"
];

// 12 unique, editorial positions to create a chaotic but curated overlapping grid
const positions = [
    "top-[0%] left-[5%] w-[45%] md:w-[22%] aspect-[3/4] z-10 shadow-lg",
    "top-[6%] left-[25%] w-[55%] md:w-[32%] aspect-[4/5] z-30 shadow-2xl",
    "top-[2%] right-[5%] w-[40%] md:w-[20%] aspect-square z-10 shadow-lg",

    "top-[22%] left-[2%] w-[35%] md:w-[18%] aspect-[4/5] z-20 shadow-xl",
    "top-[26%] left-[30%] w-[60%] md:w-[45%] aspect-[16/9] z-40 shadow-2xl", // Huge centerpiece
    "top-[20%] right-[8%] w-[45%] md:w-[24%] aspect-[3/4] z-20 shadow-xl",

    "top-[48%] left-[8%] w-[50%] md:w-[28%] aspect-[4/3] z-30 shadow-2xl",
    "top-[54%] left-[45%] w-[35%] md:w-[22%] aspect-[3/4] z-10 shadow-lg",
    "top-[45%] right-[2%] w-[55%] md:w-[30%] aspect-square z-30 shadow-xl",

    "top-[72%] left-[4%] w-[40%] md:w-[24%] aspect-[3/4] z-20 shadow-xl",
    "top-[76%] left-[32%] w-[50%] md:w-[35%] aspect-[16/9] z-40 shadow-2xl",
    "top-[68%] right-[8%] w-[35%] md:w-[19%] aspect-[4/5] z-10 shadow-lg"
];

export default function ImageGalleryBreak() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Background Color Shift Trigger
            ScrollTrigger.create({
                trigger: comp.current,
                start: "top 50%",
                end: "bottom 30%",
                onEnter: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#0A1410", color: "#FAF8F3", duration: 1.2, ease: "power2.out" }),
                onLeave: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#FAF8F3", color: "#1E1F1C", duration: 1.2, ease: "power2.out" }),
                onEnterBack: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#0A1410", color: "#FAF8F3", duration: 1.2, ease: "power2.out" }),
                onLeaveBack: () => gsap.to(document.getElementById("main-layout"), { backgroundColor: "#FAF8F3", color: "#1E1F1C", duration: 1.2, ease: "power2.out" })
            });

            // We give each image wrapper a different parallax speed based on its index
            gsap.utils.toArray('.gallery-img').forEach((img, i) => {
                const speed = 1 + (i % 4) * 0.4; // Speeds: 1, 1.4, 1.8, 2.2
                const yOffset = 180 * speed;

                gsap.fromTo(img,
                    {
                        y: yOffset,
                        opacity: 0,
                    },
                    {
                        scrollTrigger: {
                            trigger: comp.current,
                            start: "top 90%", // start animating when section enters
                            end: "bottom top", // end animating when section leaves
                            scrub: 1
                        },
                        y: -yOffset * 0.4, // Parallax move past center
                        opacity: 1,
                        ease: "none"
                    }
                );
            });

        }, comp);
        return () => ctx.revert();
    }, []);

    // Increased height to allow the overlapping images to breathe and parallax past each other
    return (
        <section ref={comp} className="relative w-full h-[180vh] md:h-[240vh] bg-transparent overflow-hidden -mt-10 md:-mt-20 border-b border-deepGreen/10">
            <div className="max-w-[1600px] mx-auto w-full h-full relative">
                {images.map((src, idx) => {
                    return (
                        <div key={idx} className={`gallery-img absolute ${positions[idx]} rounded-xl md:rounded-2xl overflow-hidden bg-deepGreen/5`}>
                            <img
                                src={src}
                                alt={`Cinematic gallery ${idx + 1}`}
                                className="w-full h-full object-cover scale-[1.1] hover:scale-100 transition-transform duration-[1.5s]"
                                loading="lazy"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
