import { useRef } from 'react';
import { motion } from 'framer-motion';

const socials = [
    {
        name: 'Instagram',
        alt: '@yaseensutar_',
        url: 'https://www.instagram.com/yaseensutar_?igsh=MXhjeWUzY2FnZ29sMg==',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        alt: 'Mohammed Yaseen Sutar',
        url: 'https://www.linkedin.com/in/mohammedyaseen-sutar-6b0a9b195/',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: 'GitHub',
        alt: '@apex-parzival',
        url: 'https://github.com/apex-parzival',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        name: 'LeetCode',
        alt: '@MohammedyaseenSutar',
        url: 'https://leetcode.com/u/MohammedyaseenSutar/',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
        ),
    },
    {
        name: 'Email',
        alt: 'sutaryaseen1@gmail.com',
        url: 'mailto:sutaryaseen1@gmail.com',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        name: 'Phone',
        alt: '+91 7022012697',
        url: 'tel:+917022012697',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.12 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
        ),
    },
];

// Magnetic round button
const MagneticRoundButton = ({ social }: { social: typeof socials[0] }) => {
    const buttonRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
        if (!buttonRef.current) return;
        buttonRef.current.style.transform = 'translate(0, 0)';
    };

    return (
        <motion.div
            className="flex items-center gap-4 group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
        >
            {/* Dual-layer text on the left */}
            <div className="relative h-[20px] overflow-hidden w-28 text-right">
                <span className="block text-sm font-medium text-cream tracking-wide transition-all duration-300 ease-in-out group-hover:-translate-y-[22px] group-hover:opacity-0">
                    {social.name}
                </span>
                <span className="absolute top-0 right-0 text-sm font-mono text-accent translate-y-[22px] opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                    {social.alt}
                </span>
            </div>

            {/* Round bordered button */}
            <a
                ref={buttonRef}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-foreground/50 hover:bg-accent hover:border-accent hover:text-white hover:shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all duration-300"
                style={{ transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.3s, border-color 0.3s, background-color 0.3s, box-shadow 0.3s' }}
                title={social.name}
                data-cursor-hide
            >
                {social.icon}
            </a>
        </motion.div>
    );
};

export const Contact = () => {
    return (
        <section id="contact" className="py-20 px-8 md:px-12 lg:px-20 min-h-[60vh] flex flex-col justify-center">
            <div className="flex-1 flex flex-col justify-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-8"
                >
                    C O N T A C T
                </motion.p>

                {/* Smaller heading */}
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ y: '100%' }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-cream"
                    >
                        Let's work
                    </motion.h2>
                </div>
                <div className="overflow-hidden mb-12">
                    <motion.h2
                        initial={{ y: '100%' }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
                        className="text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-foreground/20"
                    >
                        together.
                    </motion.h2>
                </div>

                {/* Grid of social buttons including Email/Phone */}
                <div className="border-t border-white/10 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10 w-full max-w-7xl">
                        {socials.map((social, i) => (
                            <motion.div
                                key={social.name}
                                transition={{ delay: 0.2 + i * 0.1 }}
                            >
                                <MagneticRoundButton social={social} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-16 text-xs text-foreground/20 tracking-widest uppercase">
                <span>© {new Date().getFullYear()}</span>
                <a href="#" className="hover:text-accent transition-colors duration-300">
                    Back to Top
                </a>
            </div>
        </section>
    );
};
