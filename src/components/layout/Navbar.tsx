import { useCallback, useRef, useState } from "react";
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

    useFocusTrap(overlayRef, isOpen, closeMenu);

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
                className="fixed top-0 left-0 right-0 z-40 px-8 md:px-12 py-6 flex items-start justify-between"
                aria-label="Primary"
            >
                {/* Logo / Name */}
                <a href="#" onClick={handleTop} aria-label={`${profile.name} — back to top`}>
                    <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-foreground/20 flex items-center justify-center text-xs font-bold text-foreground">
                        {profile.initials}
                    </div>
                </a>

                {/*
                  * The stack is tall and fixed, so page content scrolls underneath it.
                  * A scrim keeps both the links and whatever is behind them legible.
                  */}
                <div
                    className="hidden md:flex flex-col items-end gap-1 rounded-2xl border border-white/5 bg-background/60 backdrop-blur-md px-4 py-3"
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
                                className={`relative group overflow-hidden text-sm tracking-wide transition-colors duration-300 flex items-center gap-2 ${isActive ? 'text-accent' : 'text-foreground/60 hover:text-accent'
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
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden text-sm tracking-widest uppercase text-foreground"
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
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
