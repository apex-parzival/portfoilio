import { useRef } from 'react';
import { motion } from 'framer-motion';

const clients = [
    { name: 'FORD', reveal: 'NEXT-GEN HMI', desc: 'Next-Generation HMI Experience Design' },
    { name: 'UFC', reveal: 'DIGITAL FIGHT', desc: 'Digital Platform Redesign for Combat Sports' },
    { name: 'LINCOLN', reveal: 'LUXURY BRAND', desc: 'Luxury Automotive Brand Identity' },
    { name: 'ROYAL CARIBBEAN', reveal: 'CRUISE DESIGN', desc: 'Premium Cruise Experience Design' },
    { name: 'SLEEPIQ', reveal: 'SMART SLEEP', desc: 'Smart Sleep Interface & Personalization' },
    { name: 'NFL', reveal: 'GAME DAY', desc: 'Game Day Digital Experience Platform' },
];

export const Clients = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        sectionRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        sectionRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const handleMouseLeave = () => {
        if (!sectionRef.current) return;
        sectionRef.current.style.setProperty('--mx', '-200px');
        sectionRef.current.style.setProperty('--my', '-200px');
    };

    const renderClientRows = (isReveal: boolean) => (
        <div>
            {clients.map((client, i) => (
                <motion.div
                    key={client.name}
                    {...(!isReveal ? {
                        initial: { opacity: 0, y: 40 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true },
                        transition: { duration: 0.6, delay: i * 0.08 },
                    } : {})}
                    className={`border-t py-6 md:py-8 ${isReveal ? 'border-[#0a0a0a]/20' : 'border-white/10'}`}
                    data-cursor-engulf
                >
                    <div className="flex items-center justify-between gap-8">
                        <h3
                            className={`text-[8vw] md:text-[5vw] lg:text-[4vw] font-black uppercase leading-none tracking-[-0.03em] ${isReveal ? 'text-[#0a0a0a]' : 'text-cream'
                                }`}
                        >
                            {isReveal ? client.reveal : client.name}
                        </h3>

                        <div className="hidden md:flex items-center gap-6">
                            <span className={`text-sm text-right max-w-[220px] ${isReveal ? 'text-[#0a0a0a]/60' : 'text-foreground/30'
                                }`}>
                                {client.desc}
                            </span>
                            <span className={`text-sm font-mono ${isReveal ? 'text-[#0a0a0a]/40' : 'text-foreground/15'
                                }`}>
                                0{i + 1}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
            <div className={`border-t ${isReveal ? 'border-[#0a0a0a]/20' : 'border-white/10'}`}></div>
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
            {/* ─── Front Layer ─── */}
            <div className="py-32 px-8 md:px-12 lg:px-20 relative z-10">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-16"
                >
                    C L I E N T S
                </motion.p>
                {renderClientRows(false)}
            </div>

            {/* ─── Reveal Layer ─── */}
            <div
                className="absolute inset-0 z-20 bg-accent pointer-events-none hidden md:block"
                style={{ clipPath: 'circle(120px at var(--mx) var(--my))' }}
            >
                <div className="py-32 px-8 md:px-12 lg:px-20">
                    <p className="text-[#0a0a0a]/60 text-xs tracking-[0.4em] uppercase mb-16">
                        P R O J E C T S
                    </p>
                    {renderClientRows(true)}
                </div>
            </div>
        </section>
    );
};
