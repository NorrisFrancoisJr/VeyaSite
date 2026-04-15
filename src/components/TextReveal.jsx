import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({
    children,
    as: Component = 'div',
    className,
    delay = 0,
    stagger = 0.05,
    duration = 1.2,
    ease = "power3.out",
    triggerStart = "top 85%",
}) {
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;

        // Split the text into lines and words
        const text = new SplitType(textRef.current, { types: 'lines, words' });

        // Add overflow hidden to lines to create clipping effect
        // Added paddingBottom and negative marginBottom to prevent long descenders on italics from getting cut off
        text.lines.forEach(line => {
            gsap.set(line, { overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em' });
        });

        // Initial state for words
        gsap.set(text.words, { yPercent: 120 });

        // Setup the animation
        const anim = gsap.to(text.words, {
            scrollTrigger: {
                trigger: textRef.current,
                start: triggerStart,
                toggleActions: "play none none none"
            },
            yPercent: 0,
            duration: duration,
            stagger: stagger,
            ease: ease,
            delay: delay
        });

        return () => {
            anim.kill();
            text.revert();
        };
    }, [delay, stagger, duration, ease, triggerStart]);

    return (
        <Component ref={textRef} className={clsx("opacity-100", className)}>
            {children}
        </Component>
    );
}
