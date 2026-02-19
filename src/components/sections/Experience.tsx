import { useState } from 'react';
import { motion } from 'framer-motion';

const experiences = [
    { year: 'Feb 2026 — May 2026', role: 'Backend Intern', company: 'Erthaloka' },
    { year: 'Feb 2026 — Mar 2026', role: 'Backend Intern', company: 'Prodigy InfoTech' },
    { year: 'Sept 2025 — Feb 2026', role: 'Backend Intern', company: 'Juniper Networks' },
];

export const Experience = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="py-32 px-8 md:px-12 lg:px-20">
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-16"
            >
                E X P E R I E N C E
            </motion.p>

            <div>
                {experiences.map((exp, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className={`border-t border-white/10 py-8 md:py-10 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 transition-colors duration-300 ${hoveredIndex === i
                            ? 'bg-accent'
                            : 'hover:bg-white/[0.03]'
                            }`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        data-cursor-hide
                    >
                        <div className="grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr_1fr] gap-6 items-baseline">
                            <span className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-cream'
                                }`}>
                                {exp.year}
                            </span>
                            <div>
                                <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-foreground'
                                    }`}>
                                    {exp.role}
                                </h3>
                                <p className={`text-sm mt-1 md:hidden transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/40'
                                    }`}>{exp.company}</p>
                            </div>
                            <p className={`text-sm hidden md:block transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/40'
                                }`}>{exp.company}</p>
                        </div>
                    </motion.div>
                ))}
                <div className="border-t border-white/10"></div>
            </div>
        </section>
    );
};
