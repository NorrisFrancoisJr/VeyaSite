import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const primaryLinks = [
    { to: '/',          label: 'Home'        },
    { to: '/work',      label: 'Work'        },
];

const serviceLinks = [
    { to: '/branding',    label: 'Branding'    },
    { to: '/web',         label: 'Web'         },
    { to: '/social',      label: 'Social'      },
    { to: '/content',     label: 'Content'     },
];

const allLinks = [...primaryLinks, ...serviceLinks];

export default function Navbar() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    React.useEffect(() => {
        if (!isMenuOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    const isActive = (to) => {
        if (to === '/') return location.pathname === '/';
        return location.pathname.startsWith(to);
    };

    const linkStyle = (to) => ({
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '14px',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: isActive(to) ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        whiteSpace: 'nowrap',
    });

    return (
        <>
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                background: 'transparent',
                borderBottom: 'none',
                mixBlendMode: isMenuOpen ? 'normal' : 'difference',
                transition: 'opacity 0.4s ease',
            }}
        >
            <div
                className="h-[72px] px-5 md:h-[78px] md:px-10"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '1720px',
                    margin: '0 auto',
                    gap: '1.25rem',
                }}
            >
                {/* Logo */}
                <Link to="/" style={{ flexShrink: 0, opacity: 1, transition: 'opacity 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <Logo className="h-10 w-auto" color="#FFFFFF" />
                </Link>

                {/* All nav links in one row */}
                <nav className="hidden lg:block">
                    <ul style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2.4rem',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                        {/* Separator between primary + services */}
                        {allLinks.map(({ to, label }, i) => (
                            <React.Fragment key={to}>
                                {i === primaryLinks.length && (
                                    <li style={{
                                        width: '1px',
                                        height: '18px',
                                        background: 'rgba(255,255,255,0.15)',
                                        flexShrink: 0,
                                        margin: '0 0.25rem',
                                    }} aria-hidden="true" />
                                )}
                                <li>
                                    <Link
                                        to={to}
                                        style={linkStyle(to)}
                                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,1)'}
                                        onMouseLeave={e => e.currentTarget.style.color = isActive(to) ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)'}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </nav>

                {/* CTA */}
                <a
                    href="#inquiry"
                    className="hidden lg:inline-flex"
                    style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '13px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.85)',
                        textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,0.22)',
                        padding: '10px 20px',
                        transition: 'border-color 0.2s ease, color 0.2s ease',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                    }}
                >
                    Start Project
                </a>

                <button
                    type="button"
                    className="lg:hidden"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '14px',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: 0,
                        padding: '11px 15px',
                        lineHeight: 1,
                    }}
                >
                    {isMenuOpen ? 'Close' : 'Menu'}
                </button>
            </div>
        </header>

        <div
            id="mobile-navigation"
            hidden={!isMenuOpen}
            className="lg:hidden fixed inset-0"
            style={{
                zIndex: 9998,
                minHeight: '100vh',
                background: '#111111',
                color: '#FDFEFA',
                padding: '8rem 1.5rem 2rem',
            }}
        >
            <nav aria-label="Mobile navigation">
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {allLinks.map(({ to, label }) => (
                        <li key={to} style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                            <Link
                                to={to}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.3rem 0',
                                    fontFamily: "'Bodoni Moda', serif",
                                    fontSize: 'clamp(2.2rem, 12vw, 4.25rem)',
                                    fontStyle: 'italic',
                                    lineHeight: 0.95,
                                    color: '#FDFEFA',
                                    textDecoration: 'none',
                                }}
                            >
                                <span>{label}</span>
                                {isActive(to) && (
                                    <span
                                        style={{
                                            fontFamily: "'Barlow Condensed', sans-serif",
                                            fontSize: '13px',
                                            letterSpacing: '0.24em',
                                            textTransform: 'uppercase',
                                            opacity: 0.45,
                                        }}
                                    >
                                        Current
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <a
                href="#inquiry"
                onClick={() => setIsMenuOpen(false)}
                style={{
                    display: 'inline-flex',
                    marginTop: '2rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '14px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#FDFEFA',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.28)',
                    padding: '14px 20px',
                }}
            >
                Start Project
            </a>
        </div>
        </>
    );
}
