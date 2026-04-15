import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8, // Balanced for cinematic yet responsive feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease out
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.8, // Slightly softer mouse wheel response
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on('scroll', ScrollTrigger.update);

        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.off('scroll', ScrollTrigger.update);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
