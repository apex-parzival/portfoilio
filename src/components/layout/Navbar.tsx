import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Education', href: '#education' },
        { name: 'About Me', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Experience', href: '#experience' },
        { name: 'Achievements', href: '#achievements' },
        { name: 'Contact Me', href: '#contact' },
    ];

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="fixed top-0 left-0 right-0 z-40 px-8 md:px-12 py-6 flex items-start justify-between"
            >
                {/* Logo / Name */}
                <a href="#" className="text-foreground font-bold text-sm tracking-wider">
                    <div className="w-10 h-10 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center text-xs">
                        MS
                    </div>
                </a>

                {/* Right nav links - stacked vertically like minhpham */}
                <div className="hidden md:flex flex-col items-end gap-1" data-cursor-hide>
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScroll(e, link.href)}
                            className="relative group overflow-hidden text-sm tracking-wide text-foreground/60 hover:text-accent transition-colors duration-300"
                        >
                            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                                {link.name.toUpperCase()}
                            </span>
                            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 text-accent">
                                {link.name.toUpperCase()}
                            </span>
                        </a>
                    ))}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden text-sm tracking-widest uppercase text-foreground"
                >
                    Menu
                </button>
            </motion.nav>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
                        animate={{ clipPath: 'circle(150% at calc(100% - 2rem) 2rem)' }}
                        exit={{ clipPath: 'circle(0% at calc(100% - 2rem) 2rem)' }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 bg-accent z-50 flex flex-col items-center justify-center gap-6"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-8 text-background text-sm tracking-widest uppercase"
                        >
                            Close
                        </button>
                        {links.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                onClick={(e: any) => handleScroll(e, link.href)}
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
