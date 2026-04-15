import React, { useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import InquirySection from '../components/Inquiry';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const serviceContent = {
    branding: {
        number: '01',
        headline: 'Branding with Veya.',
        statement: "A brand that commands attention isn't built by accident. We position you at exactly the right level of the market — and make sure every touchpoint holds that standard.",
        deliverables: ['Brand positioning', 'Visual identity', 'Logo & mark', 'Colour & type', 'Tone of voice', 'Brand guidelines', 'Creative direction'],
        hero: '/turtle-beach-villa/optimized/DSC08929.jpg',
        secondary: '/turtle-beach-villa/optimized/DSC08384.jpg',
        pullQuote: 'Every brand decision is a positioning decision.',
    },
    web: {
        number: '02',
        headline: 'Web with Veya.',
        statement: "Your website is the first and most permanent impression. We design and build experiences that immerse, convert, and scale with your property.",
        deliverables: ['UX architecture', 'Bespoke design', 'Development', 'Booking integration', 'Responsive build', 'SEO foundation', 'CMS'],
        hero: '/turtle-beach-villa/optimized/DJI_20251126070059_0026_D.jpg',
        secondary: '/turtle-beach-villa/optimized/DSC08631.jpg',
        pullQuote: 'Built to convert. Designed to last.',
    },
    social: {
        number: '03',
        headline: 'Social with Veya.',
        statement: "We build a presence that's impossible to scroll past. Cinematic content, platform-native execution, and a strategy designed to turn followers into guests.",
        deliverables: ['Platform strategy', 'Monthly content', 'Caption & copy', 'Creative direction', 'Community management', 'Analytics'],
        hero: '/turtle-beach-villa/optimized/DSC08384.jpg',
        secondary: '/turtle-beach-villa/optimized/DSC08929.jpg',
        pullQuote: 'Presence is strategy.',
    },
    content: {
        number: '04',
        headline: 'Content with Veya.',
        statement: "We capture what makes a place impossible to forget — then make sure that feeling travels everywhere you need it to.",
        deliverables: ['Creative direction', 'Photography', 'Cinematic video', 'Drone capture', 'Post-production', 'Full delivery package'],
        hero: '/turtle-beach-villa/optimized/DSC08924.jpg',
        secondary: '/turtle-beach-villa/optimized/DSC08607.jpg',
        pullQuote: 'The feeling of a place, made permanent.',
    },
};


export default function ServiceCategory() {
    const { slug } = useParams();
    const content = serviceContent[slug] || null;
    const heroRef = useRef(null);
    const headlineRef = useRef(null);

    const filteredProjects = projects.filter(p =>
        p.tags?.some(tag => tag.toLowerCase() === slug?.toLowerCase()) ||
        p.category?.toLowerCase().includes(slug?.toLowerCase())
    );

    useLayoutEffect(() => {
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            // Hero image parallax
            gsap.to('.service-hero-img', {
                yPercent: 18,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Headline reveal
            gsap.from(headlineRef.current, {
                y: 60,
                opacity: 0,
                duration: 1.6,
                ease: 'expo.out',
                delay: 0.3,
            });

            // Positioning block stagger
            gsap.from('.service-stagger', {
                y: 40,
                opacity: 0,
                stagger: 0.12,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.service-positioning',
                    start: 'top 70%',
                },
            });
        });

        return () => ctx.revert();
    }, [slug]);

    if (!content) {
        return (
            <main style={{ paddingTop: '10rem', padding: '10rem 2.5rem', minHeight: '100vh', background: '#FDFEFA' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '4rem', color: '#1a1a1a' }}>
                    Service not found.
                </h1>
                <Link to="/" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', marginTop: '2rem', display: 'block' }}>
                    ← Back to Home
                </Link>
            </main>
        );
    }

    return (
        <main style={{ background: '#FDFEFA' }}>

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}
            >
                <img
                    className="service-hero-img"
                    src={content.hero}
                    alt={content.headline}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '120%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        opacity: 0.72,
                        top: '-10%',
                    }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)',
                }} />

                {/* Overline */}
                <div style={{
                    position: 'absolute',
                    top: '7rem',
                    left: '2.5rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                }}>
                    Services / {content.number}
                </div>

                {/* Headline */}
                <div
                    ref={headlineRef}
                    style={{
                        position: 'absolute',
                        bottom: '4.5rem',
                        left: '2.5rem',
                        right: '2.5rem',
                    }}
                >
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(3.2rem, 7.5vw, 9rem)',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: '#FDFEFA',
                        lineHeight: 1.0,
                        letterSpacing: '-0.02em',
                        margin: 0,
                    }}>
                        {content.headline}
                    </h1>
                </div>
            </section>

            {/* ── POSITIONING BLOCK ── */}
            <section
                className="service-positioning"
                style={{ padding: '8rem 2.5rem', background: '#FDFEFA' }}
            >
                <div style={{
                    maxWidth: '1720px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6rem',
                    alignItems: 'start',
                }}>
                    {/* Statement */}
                    <div className="service-stagger">
                        <p style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.5rem, 2.2vw, 2.4rem)',
                            fontWeight: 400,
                            lineHeight: 1.4,
                            color: '#1a1a1a',
                            margin: 0,
                        }}>
                            {content.statement}
                        </p>
                    </div>

                    {/* Deliverables */}
                    <div className="service-stagger">
                        <p style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: '9px',
                            letterSpacing: '0.5em',
                            textTransform: 'uppercase',
                            color: 'rgba(0,0,0,0.3)',
                            marginBottom: '1.5rem',
                            marginTop: 0,
                        }}>
                            What's Included
                        </p>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {content.deliverables.map((item, i) => (
                                <li
                                    key={i}
                                    style={{
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        fontSize: '13px',
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: '#1a1a1a',
                                        padding: '1rem 0',
                                        borderTop: i === 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span>{item}</span>
                                    <span style={{ color: 'rgba(0,0,0,0.18)', fontSize: '1rem' }}>—</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── SECONDARY VISUAL + PULL QUOTE ── */}
            <section style={{ position: 'relative', background: '#0a0a0a', overflow: 'hidden' }}>
                <div style={{ height: '72vh', position: 'relative' }}>
                    <img
                        src={content.secondary}
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: 0.6,
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem',
                        background: 'rgba(0,0,0,0.2)',
                    }}>
                        <blockquote style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            color: '#FDFEFA',
                            textAlign: 'center',
                            maxWidth: '900px',
                            lineHeight: 1.15,
                            margin: 0,
                            letterSpacing: '-0.01em',
                        }}>
                            &ldquo;{content.pullQuote}&rdquo;
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* ── RELATED WORK ── */}
            {filteredProjects.length > 0 && (
                <section style={{ background: '#111111', padding: '6rem 2.5rem' }}>
                    <div style={{ maxWidth: '1720px', margin: '0 auto' }}>
                        <p style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: '9px',
                            letterSpacing: '0.5em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.25)',
                            marginBottom: '3rem',
                            marginTop: 0,
                        }}>
                            Related Work
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                            gap: '2px',
                        }}>
                            {filteredProjects.map(project => (
                                <Link
                                    to={`/work/${project.id}`}
                                    key={project.id}
                                    style={{
                                        display: 'block',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        aspectRatio: '4/3',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        transition: 'background 0.3s ease',
                                    }}>
                                        <h3 style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.4rem',
                                            fontStyle: 'italic',
                                            fontWeight: 400,
                                            color: '#FDFEFA',
                                            margin: 0,
                                        }}>
                                            {project.name}
                                        </h3>
                                        <p style={{
                                            fontFamily: "'Barlow Condensed', sans-serif",
                                            fontSize: '9px',
                                            letterSpacing: '0.4em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(255,255,255,0.4)',
                                            marginTop: '0.4rem',
                                            marginBottom: 0,
                                        }}>
                                            {project.category}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── INQUIRY ── */}
            <InquirySection />
        </main>
    );
}
