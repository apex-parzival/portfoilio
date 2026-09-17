import { useState } from 'react';
import { motion } from 'framer-motion';

interface Role {
    year: string;
    role: string;
    company: string;
    summary: string;
    stack: string[];
}

const experiences: Role[] = [
    {
        year: 'Feb 2026 — Present',
        role: 'AI/ML Engineer Intern',
        company: 'Mirai Labs',
        summary:
            'Shipping AI and full-stack systems for manufacturing, healthcare, government and logistics clients — agentic pipelines, LLM document extraction, computer vision and the production backends around them.',
        stack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Gemini', 'AWS Bedrock', 'Docker'],
    },
    {
        year: 'Feb 2026 — May 2026',
        role: 'Backend Intern',
        company: 'Erthaloka',
        summary:
            'Built and maintained backend services and REST APIs, focusing on clean data models and dependable integrations.',
        stack: ['Node.js', 'Express', 'MongoDB', 'REST'],
    },
    {
        year: 'Feb 2026 — Mar 2026',
        role: 'Backend Intern',
        company: 'Prodigy InfoTech',
        summary:
            'Delivered backend modules covering authentication, CRUD APIs and database design across assigned projects.',
        stack: ['Node.js', 'Express', 'SQL', 'JWT'],
    },
];

export const Experience = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="experience" className="py-32 px-8 md:px-12 lg:px-20">
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
                {experiences.map((exp, i) => {
                    const active = hoveredIndex === i;

                    return (
                        <motion.div
                            key={exp.company}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className={`border-t border-white/10 py-8 md:py-10 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 transition-colors duration-300 ${active ? 'bg-accent' : 'hover:bg-white/[0.03]'
                                }`}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            data-cursor-hide
                        >
                            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-10 items-start">
                                <span
                                    className={`text-sm md:text-base font-mono tracking-tight pt-1 transition-colors duration-300 ${active ? 'text-[#0a0a0a]' : 'text-accent'
                                        }`}
                                >
                                    {exp.year}
                                </span>

                                <div>
                                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-8">
                                        <h3
                                            className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight transition-colors duration-300 ${active ? 'text-[#0a0a0a]' : 'text-cream'
                                                }`}
                                        >
                                            {exp.role}
                                        </h3>
                                        <p
                                            className={`text-sm md:text-base shrink-0 transition-colors duration-300 ${active ? 'text-[#0a0a0a]/70' : 'text-foreground/40'
                                                }`}
                                        >
                                            {exp.company}
                                        </p>
                                    </div>

                                    <p
                                        className={`text-sm md:text-base leading-relaxed mt-3 max-w-3xl transition-colors duration-300 ${active ? 'text-[#0a0a0a]/70' : 'text-foreground/40'
                                            }`}
                                    >
                                        {exp.summary}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {exp.stack.map((t) => (
                                            <span
                                                key={t}
                                                className={`px-3 py-1 rounded-full border text-[11px] font-mono transition-colors duration-300 ${active
                                                    ? 'border-[#0a0a0a]/25 text-[#0a0a0a]/60'
                                                    : 'border-white/10 text-foreground/35'
                                                    }`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div className="border-t border-white/10" />
            </div>
        </section>
    );
};
