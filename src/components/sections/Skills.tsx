import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const skills = [
    { title: 'AI & ML', desc: 'End-to-end intelligence from CV/NLP model training to manufacturing reliable, production-ready pipelines.' },
    { title: 'BACKEND', desc: 'High-performance systems via Node.js & Express, featuring secure auth, caching, and robust API design.' },
    { title: 'FULL-STACK', desc: 'Modern, component-driven interfaces built with Next.js, TypeScript, and responsive Tailwind styling.' },
    { title: 'WEB3', desc: 'Decentralized architecture with Solidity smart contracts, token design, and secure Web3 integrations.' },
    { title: 'TOOLS', desc: 'Streamlined workflows using Python, Docker, Git, and CI/CD for efficient development and testing.' },
];

export const Skills = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        setHoveredIndex(null);
    };

    return (
        <section
            ref={sectionRef}
            id="skills"
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
                    S K I L L S
                </motion.p>

                <div>
                    {skills.map((skill, i) => (
                        <motion.div
                            key={skill.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className={`border-t border-white/10 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 py-6 md:py-8 transition-colors duration-300 ${hoveredIndex === i ? 'bg-accent' : 'hover:bg-white/[0.03]'
                                }`}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            data-cursor-hide
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                                <h3
                                    className={`text-[clamp(1.8rem,5vw,4rem)] font-black uppercase leading-none tracking-[-0.03em] transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-cream'
                                        }`}
                                >
                                    {skill.title}
                                </h3>

                                <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                    <span className={`text-sm md:text-right max-w-full md:max-w-[320px] transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/30'
                                        }`}>
                                        {skill.desc}
                                    </span>
                                    <span className={`text-sm font-mono transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/40' : 'text-foreground/15'
                                        }`}>
                                        0{i + 1}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div className="border-t border-white/10"></div>
                </div>
            </div>

            {/* ─── Reveal Layer ─── */}
            <div
                className={`absolute inset-0 z-20 bg-accent pointer-events-none hidden md:block transition-opacity duration-300 ${hoveredIndex !== null ? 'opacity-0' : 'opacity-100'}`}
                style={{ clipPath: 'circle(120px at var(--mx) var(--my))' }}
            >
                <div className="py-32 px-8 md:px-12 lg:px-20">
                    <p className="text-[#0a0a0a]/60 text-xs tracking-[0.4em] uppercase mb-16">
                        E X P E R T I S E
                    </p>
                    <div>
                        {skills.map((skill, i) => (
                            <div
                                key={skill.title}
                                className="border-t border-[#0a0a0a]/20 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 py-6 md:py-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                                    <h3 className="text-[clamp(1.8rem,5vw,4rem)] font-black uppercase leading-none tracking-[-0.03em] text-[#0a0a0a]">
                                        {skill.title}
                                    </h3>
                                    <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                        <span className="text-sm md:text-right max-w-full md:max-w-[320px] text-[#0a0a0a]/60">
                                            {skill.desc}
                                        </span>
                                        <span className="text-sm font-mono text-[#0a0a0a]/40">
                                            0{i + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-[#0a0a0a]/20"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};
