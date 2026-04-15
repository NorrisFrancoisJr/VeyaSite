import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const projectLines = [
    'A private coastal residence shaped into a cinematic destination story.',
    'Resort energy translated into a sharper digital first impression.',
    'Eco-luxury made legible through atmosphere, pacing, and restraint.',
    'A destination campaign built for attention before itinerary.',
    'Hospitality identity with enough texture to feel already lived in.',
    'Social rhythm and brand memory tuned for repeat desire.',
    'Direct-booking clarity wrapped in a place-led digital experience.',
];

export default function SelectedWork() {
    const sectionRef = useRef(null);
    const reelRef = useRef(null);
    const backgroundRefs = useRef([]);
    const panelRefs = useRef([]);
    const indexRefs = useRef([]);
    const progressRefs = useRef([]);
    const mobileProgressRefs = useRef([]);
    const chapterRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const backgrounds = backgroundRefs.current;
            const panels = panelRefs.current;
            const indexItems = indexRefs.current;
            const progressItems = progressRefs.current;
            const mobileProgressItems = mobileProgressRefs.current;
            const chapters = chapterRefs.current;

            gsap.set(backgrounds, {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 100%)',
                scale: 1.08,
            });
            gsap.set(backgrounds[0], {
                clipPath: 'inset(0% 0% 0% 0%)',
                scale: 1,
            });

            gsap.set(panels, {
                autoAlpha: 0,
                y: 36,
                pointerEvents: 'none',
            });
            gsap.set(panels[0], {
                autoAlpha: 1,
                y: 0,
                pointerEvents: 'auto',
            });

            gsap.set(indexItems, { color: 'rgba(255,255,255,0.28)' });
            gsap.set(indexItems[0], { color: 'rgba(255,255,255,1)' });
            gsap.set([...progressItems, ...mobileProgressItems], { scaleX: 0, transformOrigin: 'left center' });
            gsap.set([...progressItems[0] ? [progressItems[0]] : [], ...mobileProgressItems[0] ? [mobileProgressItems[0]] : []], { scaleX: 0.12 });

            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (projects.length + 0.75)}`,
                    pin: reelRef.current,
                    pinSpacing: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            projects.forEach((project, index) => {
                timeline.to([progressItems[index], mobileProgressItems[index]], {
                    scaleX: 1,
                    duration: 0.85,
                });

                if (index === projects.length - 1) return;

                timeline
                    .to(backgrounds[index + 1], {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        scale: 1,
                        duration: 0.95,
                    }, '>')
                    .to(backgrounds[index], {
                        scale: 1.04,
                        duration: 0.95,
                    }, '<')
                    .to(panels[index], {
                        autoAlpha: 0,
                        y: -26,
                        pointerEvents: 'none',
                        duration: 0.32,
                    }, '<0.16')
                    .fromTo(panels[index + 1], {
                        autoAlpha: 0,
                        y: 34,
                        pointerEvents: 'none',
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        pointerEvents: 'auto',
                        duration: 0.46,
                    }, '<0.16')
                    .to(indexItems[index], {
                        color: 'rgba(255,255,255,0.28)',
                        duration: 0.28,
                    }, '<')
                    .to(indexItems[index + 1], {
                        color: 'rgba(255,255,255,1)',
                        duration: 0.28,
                    }, '<')
                    .to(chapters[index], {
                        autoAlpha: 0,
                        y: -10,
                        duration: 0.24,
                    }, '<')
                    .fromTo(chapters[index + 1], {
                        autoAlpha: 0,
                        y: 10,
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.24,
                    }, '<0.12');
            });
        }, sectionRef);

        ScrollTrigger.refresh();

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="block_selected_work"
            className="relative z-20 bg-[#090909] text-white"
            aria-label="Selected work"
        >
            <div
                ref={reelRef}
                className="relative h-screen overflow-hidden bg-[#090909]"
            >
                <div className="absolute inset-0">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            ref={(node) => {
                                backgroundRefs.current[index] = node;
                            }}
                            className="absolute inset-0"
                        >
                            <img
                                src={project.image}
                                alt=""
                                className="h-full w-full object-cover"
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.84),rgba(0,0,0,0.32)_45%,rgba(0,0,0,0.7))]" />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between px-6 py-24 md:px-10 lg:px-16">
                    <div className="flex items-start justify-between gap-8">
                        <div>
                            <span className="mb-5 block font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">
                                Selected Work
                            </span>
                            <h2 className="max-w-[11ch] font-serif text-6xl font-normal italic leading-[0.85] tracking-tight text-white md:text-8xl lg:text-[8.8rem]">
                                Proof, not portfolio.
                            </h2>
                        </div>

                        <div className="hidden min-w-[220px] flex-col items-end gap-4 md:flex">
                            <div className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/45">
                                Scroll to advance
                            </div>
                            <div className="relative h-24 w-px overflow-hidden bg-white/18">
                                {projects.map((project, index) => (
                                    <span
                                        key={project.id}
                                        ref={(node) => {
                                            chapterRefs.current[index] = node;
                                        }}
                                        className="absolute inset-x-[-42px] top-1/2 -translate-y-1/2 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-white/38"
                                        style={{ opacity: index === 0 ? 1 : 0 }}
                                    >
                                        {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                                    </span>
                                ))}
                                <span className="absolute left-0 top-0 h-full w-px bg-white/12" />
                            </div>
                        </div>
                    </div>

                    <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="relative min-h-[310px] md:min-h-[390px] lg:min-h-[480px]">
                            {projects.map((project, index) => (
                                <Link
                                    key={project.id}
                                    ref={(node) => {
                                        panelRefs.current[index] = node;
                                    }}
                                    to={`/work/${project.id}`}
                                    className="group absolute bottom-0 left-0 block max-w-5xl text-white no-underline"
                                    style={{ visibility: index === 0 ? 'visible' : 'hidden' }}
                                >
                                    <div className="mb-5 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-white/45">
                                        <span>{String(index + 1).padStart(2, '0')}</span>
                                        <span className="h-px w-12 bg-white/25" />
                                        <span>{project.category}</span>
                                    </div>

                                    <h3 className="font-serif text-5xl font-normal italic leading-[0.9] tracking-tight md:text-7xl lg:text-[8rem]">
                                        {project.name}
                                    </h3>

                                    <p className="mt-6 max-w-xl font-sans text-xl font-light leading-relaxed text-white/72 md:text-2xl">
                                        {projectLines[index] || 'A place-led digital story built to move people from attention to action.'}
                                    </p>

                                    <span className="mt-8 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-white/50 transition-colors group-hover:text-white">
                                        Enter Case
                                        <span className="h-px w-12 bg-current transition-all duration-500 group-hover:w-20" />
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="hidden lg:block">
                            <div className="mb-5 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.45em] text-white/35">
                                <span>Reel Progress</span>
                                <Link to="/work" className="text-white/45 no-underline transition-colors hover:text-white">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-2">
                                {projects.map((project, index) => (
                                    <div
                                        key={project.id}
                                        className="flex w-full items-center justify-between border-t border-white/10 py-2 text-left"
                                    >
                                        <span className="min-w-0 flex-1 pr-5">
                                            <span
                                                ref={(node) => {
                                                    indexRefs.current[index] = node;
                                                }}
                                                className="block truncate font-mono text-[10px] uppercase tracking-[0.35em]"
                                            >
                                                {project.name}
                                            </span>
                                            <span className="mt-3 block h-px w-full overflow-hidden bg-white/10">
                                                <span
                                                    ref={(node) => {
                                                        progressRefs.current[index] = node;
                                                    }}
                                                    className="block h-full w-full bg-white"
                                                />
                                            </span>
                                        </span>
                                        <span className="shrink-0 font-mono text-[10px] text-white/28">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute bottom-7 left-6 right-6 z-10 md:left-10 md:right-10 lg:hidden">
                    <div className="mb-4 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.35em] text-white/42">
                        <span>Scroll to advance</span>
                        <span>{String(projects.length).padStart(2, '0')} cases</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {projects.map((project, index) => (
                            <span
                                key={project.id}
                                className="h-px flex-1 overflow-hidden bg-white/18"
                            >
                                <span
                                    ref={(node) => {
                                        mobileProgressRefs.current[index] = node;
                                    }}
                                    className="block h-full w-full bg-white"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
