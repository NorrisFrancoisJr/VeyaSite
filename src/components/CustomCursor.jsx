import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Track raw mouse position
        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        // Render loop for smooth interpolation (linear interpolation)
        const render = () => {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;

            gsap.set(cursor, {
                x: cursorX,
                y: cursorY
            });

            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        // Setup Hover Effects via MutationObserver (since elements mount/unmount)
        const handleHoverIn = () => {
            gsap.to(cursor, { scale: 3.5, duration: 0.3, ease: 'power2.out', backgroundColor: 'transparent', border: '1px solid white' });
        };

        const handleHoverOut = () => {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out', backgroundColor: 'white', border: 'none' });
        };

        const attachListeners = () => {
            const interactables = document.querySelectorAll('a, button, input, textarea, .gallery-img, .premium-hover');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', handleHoverIn);
                el.addEventListener('mouseleave', handleHoverOut);
            });
        };

        attachListeners();

        // Re-attach listeners when DOM changes (e.g. route transitions)
        const observer = new MutationObserver(() => {
            attachListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            observer.disconnect();
            const interactables = document.querySelectorAll('a, button, input, textarea, .gallery-img, .premium-hover');
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverIn);
                el.removeEventListener('mouseleave', handleHoverOut);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
            style={{ transform: 'translate(-50%, -50%)' }}
        />
    );
}
