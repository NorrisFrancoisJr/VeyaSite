import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const visibleProjects = projects.slice(0, 5);

const projectSummaries = [
    'Cinematic coastal positioning for a private Caribbean villa.',
    'Resort desire translated across web, film, and photography.',
    'Eco-luxury made intimate, editorial, and easy to choose.',
    'Destination storytelling shaped to move attention into travel.',
    'A warmer hospitality identity with sharper commercial memory.',
];

function tagsFromProject(project) {
    const rawTags = project.category
        ? project.category.split(',').map((tag) => tag.trim())
        : project.tags || [];

    return rawTags.slice(0, 3);
}

export default function SelectedWork() {
    const sectionRef = useRef(null);
    const pinRef = useRef(null);
    const cardRefs = useRef([]);
    const desktopProgressRefs = useRef([]);
    const mobileProgressRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = cardRefs.current;
            const progressBars = [desktopProgressRefs.current, mobileProgressRefs.current];

            gsap.set(cards, { yPercent: 110 });
            gsap.set(cards[0], { yPercent: 0 });
            gsap.set(progressBars.flat(), { scaleX: 0, transformOrigin: 'left center' });
            gsap.set([desktopProgressRefs.current[0], mobileProgressRefs.current[0]], { scaleX: 1 });

            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * visibleProjects.length}`,
                    pin: pinRef.current,
                    pinSpacing: true,
                    scrub: 0.85,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            visibleProjects.forEach((project, index) => {
                if (index === 0) return;

                timeline
                    .to(cards[index], {
                        yPercent: 0,
                        duration: 1,
                    })
                    .to([desktopProgressRefs.current[index], mobileProgressRefs.current[index]], {
                        scaleX: 1,
                        duration: 0.2,
                    }, '<0.78')
                    .to(cards[index - 1], {
                        scale: 0.965,
                        opacity: 0.54,
                        duration: 1,
                    }, '<');
            });
        }, sectionRef);

        ScrollTrigger.refresh();

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="block_selected_work"
            className="relative z-20 bg-[#D1D0CB] text-[#2E2E2E]"
            aria-label="Selected work"
        >
            <div
                ref={pinRef}
                className="relative h-screen overflow-hidden px-5 py-12 md:px-10 md:py-14"
            >
                <div className="mx-auto flex h-full max-w-[1720px] flex-col">
                    <div className="mb-7 border-b border-[#2E2E2E]/10 pb-5 md:mb-8">
                        <div className="flex items-end justify-between gap-8">
                            <div>
                                <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.36em] text-[#2E2E2E]/48">
                                    Selected Work
                                </span>
                                <h2 className="max-w-[14ch] font-serif text-4xl font-normal italic leading-[0.92] tracking-tight md:text-6xl lg:text-[6.6rem]">
                                    Stories with a sense of place.
                                </h2>
                            </div>

                            <div className="hidden min-w-[260px] md:block">
                                <div className="mb-4 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.3em] text-[#2E2E2E]/44">
                                    <span>Case Studies</span>
                                    <Link to="/work" className="text-[#2E2E2E]/50 no-underline hover:text-[#2E2E2E]">
                                        View All
                                    </Link>
                                </div>
                                <div className="flex gap-2">
                                    {visibleProjects.map((project, index) => (
                                        <span
                                            key={project.id}
                                            className="h-px flex-1 overflow-hidden bg-[#2E2E2E]/16"
                                        >
                                            <span
                                                ref={(node) => {
                                                    desktopProgressRefs.current[index] = node;
                                                }}
                                                className="block h-full w-full bg-[#2E2E2E]"
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-0 flex-1">
                        {visibleProjects.map((project, index) => (
                            <article
                                key={project.id}
                                ref={(node) => {
                                    cardRefs.current[index] = node;
                                }}
                                className="absolute inset-x-0 top-0 will-change-transform"
                                style={{ zIndex: index + 1 }}
                            >
                                <Link
                                    to={`/work/${project.id}`}
                                    className="group block text-[#2E2E2E] no-underline"
                                >
                                    <div className="overflow-hidden rounded-[18px] bg-[#B9B7AE] md:rounded-[24px]">
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="h-[46vh] min-h-[330px] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] md:h-[50vh] lg:h-[56vh]"
                                            loading="eager"
                                        />
                                    </div>

                                    <div className="grid gap-5 bg-[#D1D0CB] px-2 pb-2 pt-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:px-3">
                                        <div>
                                            <h3 className="font-serif text-4xl font-normal italic leading-tight tracking-tight md:text-5xl">
                                                {project.name}
                                            </h3>
                                            <p className="mt-3 max-w-3xl font-sans text-xl font-light leading-relaxed text-[#2E2E2E]/64 md:text-2xl">
                                                {projectSummaries[index] || 'Place-led digital storytelling designed to position, attract, and convert.'}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 md:justify-end md:pt-5">
                                            {tagsFromProject(project).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-[#2E2E2E]/14 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[#2E2E2E]/50"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>

                    <div className="mt-6 flex gap-2 md:hidden">
                        {visibleProjects.map((project, index) => (
                            <span
                                key={project.id}
                                className="h-px flex-1 overflow-hidden bg-[#2E2E2E]/16"
                            >
                                <span
                                    ref={(node) => {
                                        mobileProgressRefs.current[index] = node;
                                    }}
                                    className="block h-full w-full bg-[#2E2E2E]"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
