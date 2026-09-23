import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, profile, sectionIds } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import { scrollToId, scrollToTop } from "../../lib/scroll";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const active = useActiveSection(sectionIds);
    const overlayRef = useRef<HTMLDivElement>(null);
    const closeMenu = useCallback(() => setIsOpen(false), []);
    const [navVisible, setNavVisible] = useState(true);

    useFocusTrap(overlayRef, isOpen, closeMenu);

    /*
     * The link stack is ~200px tall and fixed, so it permanently covers the
     * right-hand column of whatever is scrolling underneath — project
     * descriptions were disappearing behind it. Hide it while scrolling down,
     * bring it back on scroll up (and near the top), which is where someone
     * reaches for navigation anyway.
     */
    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            const y = window.scrollY;
            const delta = y - lastY;

            // Ignore sub-pixel jitter and rubber-banding.
            if (Math.abs(delta) > 6) {
                setNavVisible(delta < 0 || y < 120);
                lastY = y;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsOpen(false);
        scrollToId(id);
    };

    const handleTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        scrollToTop();
    };

    return (
        <>
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                /*
                 * pointer-events-none is load-bearing: this bar spans the full
                 * width and is as tall as the link stack, so with default
                 * pointer events it intercepts clicks and hovers across the
                 * whole top band of the page. Only the controls opt back in.
                 */
                className="fixed top-0 left-0 right-0 z-40 px-8 md:px-12 py-6 flex items-start justify-between pointer-events-none"
                aria-label="Primary"
            >
                {/* Logo / Name */}
                <a
                    href="#"
                    onClick={handleTop}
                    className="pointer-events-auto"
                    aria-label={`${profile.name} — back to top`}
                >
                    <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-foreground/20 flex items-center justify-center text-xs font-bold text-foreground">
                        {profile.initials}
                    </div>
                </a>

                {/*
                  * The stack is tall and fixed, so page content scrolls underneath it.
                  * A scrim keeps both the links and whatever is behind them legible.
                  */}
                <div
                    className={`hidden md:flex flex-col items-end gap-1 rounded-2xl border border-white/5 bg-background/85 backdrop-blur-md px-4 py-3 transition-all duration-300 pointer-events-none ${navVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-3'
                        }`}
                    aria-hidden={!navVisible}
                    data-cursor-hide
                >
                    {navLinks.map((link) => {
                        const isActive = active === link.id;
                        return (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => handleScroll(e, link.id)}
                                aria-current={isActive ? 'true' : undefined}
                                className={`relative group overflow-hidden text-sm tracking-wide transition-colors duration-300 flex items-center gap-2 ${navVisible ? 'pointer-events-auto' : 'pointer-events-none'
                                    } ${isActive ? 'text-accent' : 'text-foreground/60 hover:text-accent'
                                    }`}
                            >
                                <span
                                    className={`h-px bg-accent transition-all duration-500 ${isActive ? 'w-4 opacity-100' : 'w-0 opacity-0'
                                        }`}
                                    aria-hidden="true"
                                />
                                <span className="relative block overflow-hidden">
                                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                                        {link.name.toUpperCase()}
                                    </span>
                                    <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 text-accent">
                                        {link.name.toUpperCase()}
                                    </span>
                                </span>
                            </a>
                        );
                    })}

                    {/*
                      * A route rather than a section, so it sits below a rule and
                      * cannot live in navLinks — the scroll-spy and the nav-anchor
                      * test both assume every entry resolves to a section id.
                      */}
                    <span className="w-full h-px bg-white/10 my-2" aria-hidden="true" />
                    <Link
                        to="/book"
                        className={`text-sm tracking-wide text-cream/70 hover:text-accent transition-colors duration-300 flex items-center gap-2 ${navVisible ? 'pointer-events-auto' : 'pointer-events-none'
                            }`}
                    >
                        THE BOOK
                        <span aria-hidden="true">&#8599;</span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden pointer-events-auto text-sm tracking-widest uppercase text-foreground"
                    aria-expanded={isOpen}
                    aria-label="Open navigation menu"
                >
                    Menu
                </button>
            </motion.nav>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={overlayRef}
                        initial={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
                        animate={{ clipPath: 'circle(150% at calc(100% - 2rem) 2rem)' }}
                        exit={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 bg-accent z-50 flex flex-col items-center justify-center gap-6"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-8 text-background text-sm tracking-widest uppercase"
                        >
                            Close
                        </button>
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => handleScroll(e, link.id)}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                className="text-4xl font-bold uppercase tracking-tighter text-background hover:opacity-60 transition-opacity"
                            >
                                {link.name}
                            </motion.a>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + navLinks.length * 0.1, duration: 0.5 }}
                        >
                            <Link
                                to="/book"
                                onClick={closeMenu}
                                className="text-2xl font-bold uppercase tracking-tighter text-background/70 hover:text-background transition-colors"
                            >
                                The Book &#8599;
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
