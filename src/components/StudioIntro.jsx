import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StudioIntro() {
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".intro-text-line", {
                scrollTrigger: {
                    trigger: comp.current,
                    start: "top 80%",
                },
                y: 20,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={comp} className="relative z-10 w-full overflow-hidden bg-offWhite py-[140px]">
            <div className="mx-auto w-[1440px] max-w-full px-6 md:px-12 text-left">
                <div className="font-serif text-deepGreen text-[3rem] md:text-[5rem] lg:text-[6rem] leading-[1] tracking-tight max-w-[1200px]">
                    <h2 className="intro-text-line m-0">We are a <span className="opacity-40">Caribbean-rooted</span></h2>
                    <h2 className="intro-text-line m-0">creative studio.</h2>
                    <h2 className="intro-text-line mt-6 m-0 text-[1.5rem] md:text-[2.5rem] font-sans font-medium max-w-[900px]">
                        We partner with ambitious leaders to bring <span className="italic font-serif">world-class</span> digital experiences to life through cinematic storytelling and technology.
                    </h2>
                </div>
            </div>
        </section>
    );
}
