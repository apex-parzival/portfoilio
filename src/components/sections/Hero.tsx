import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ViewMode } from '../../App';

const heroWords = [
    { primary: 'BACKEND', reveal: 'AI & ML', accent: true },
    { primary: 'ENGINEER', reveal: 'ENGINEER', accent: false },
];

const taglines = {
    primary: 'Building the systems that quietly hold everything up.',
    reveal: 'Building models that survive contact with real data.',
};

export const Hero = ({ viewMode }: { viewMode: ViewMode }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent) => {
        if (reduceMotion || !sectionRef.current || viewMode !== 'both') return;
        const rect = sectionRef.current.getBoundingClientRect();
        sectionRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        sectionRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const handleMouseLeave = () => {
        if (!sectionRef.current) return;
        sectionRef.current.style.setProperty('--mx', '-200px');
        sectionRef.current.style.setProperty('--my', '-200px');
    };

    const renderContent = (isReveal: boolean) => (
        <div className="min-h-screen flex flex-col items-center justify-center px-8 md:px-12 lg:px-20 pt-24 pb-20 text-center">
            <motion.p
                {...(!isReveal ? {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.8, delay: 0.3 },
                } : {})}
                className={`text-xs md:text-sm tracking-[0.4em] uppercase mb-8 ${isReveal ? 'text-[#0a0a0a]/80' : 'text-cream'
                    }`}
            >
                MOHAMMED YASEEN SUTAR
            </motion.p>

            {heroWords.map((word, i) => (
                <div key={word.primary + i} className="overflow-hidden">
                    {isReveal ? (
                        <h1 className={`text-[clamp(2.5rem,9vw,7rem)] font-black leading-[0.90] tracking-[-0.04em] text-[#0a0a0a]`}>
                            {word.reveal}
                        </h1>
                    ) : (
                        <motion.h1
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 1,
                                ease: [0.76, 0, 0.24, 1],
                                delay: 0.4 + i * 0.08,
                            }}
                            className={`text-[clamp(2.5rem,9vw,7rem)] font-black leading-[0.90] tracking-[-0.04em] ${word.accent ? 'text-accent' : 'text-cream'
                                }`}
                        >
                            {word.primary}
                        </motion.h1>
                    )}
                </div>
            ))}

            <motion.p
                {...(!isReveal ? {
                    initial: { opacity: 0, y: 16 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.8, delay: 0.9 },
                } : {})}
                className={`mt-8 max-w-xl text-sm md:text-base leading-relaxed ${isReveal ? 'text-[#0a0a0a]/80' : 'text-muted'
                    }`}
            >
                {isReveal ? taglines.reveal : taglines.primary}
            </motion.p>

            <motion.span
                {...(!isReveal ? {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 0.8, delay: 1.2 },
                } : {})}
                className={`mt-14 text-[10px] tracking-[0.3em] uppercase ${isReveal ? 'text-[#0a0a0a]/60' : 'text-faint'
                    }`}
            >
                Scroll ↓
            </motion.span>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden"
            style={{ '--mx': '-200px', '--my': '-200px' } as React.CSSProperties}
        >
            {/* ─── Front Layer (Layer 1: Backend) ─── */}
            {/* Show if mode is NOT ai_ml-only (i.e. show for Backend and Both) */}
            <div className={`relative z-10 ${viewMode === 'view_ai_ml' ? 'opacity-0' : 'opacity-100'}`}>
                {renderContent(false)}
            </div>

            {/* ─── Reveal Layer (Layer 2: AI & ML) ─── */}
            <div
                className={`absolute inset-0 z-20 bg-accent pointer-events-none 
                    ${viewMode === 'view_backend' ? '!hidden' : 'hidden md:block'} 
                    ${viewMode === 'view_ai_ml' ? '!block opacity-100 !clip-path-none pointer-events-auto' : ''}`}
                style={{
                    clipPath: viewMode === 'both' ? 'circle(120px at var(--mx) var(--my))' : 'none'
                }}
                aria-hidden={viewMode === 'both'}
            >
                {renderContent(true)}
            </div>

            {/* Mobile Fallback for AI & ML Mode */}
            {viewMode === 'view_ai_ml' && (
                <div className="absolute inset-0 z-30 bg-accent md:hidden flex flex-col items-center justify-center px-8 text-center">
                    {renderContent(true)}
                </div>
            )}
        </section>
    );
};
