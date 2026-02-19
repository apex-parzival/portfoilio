import { useState } from 'react';
import { motion } from 'framer-motion';

const education = [
    {
        year: '2022 — 2026',
        degree: 'B.Tech in Computer Science Engineering-Artificial Intelligence and Machine Learning',
        institution: 'Dayanand Sagar University',
        details: 'Specialization in AI & Machine Learning',
        cgpa: '8.16',
    },
    {
        year: '2020 — 2022',
        degree: 'Higher Secondary Education',
        institution: 'ICS Mahesh PU College',
        details: 'Science Stream — PCM with Computer Science',
        percentage: '81.5%',
    },
    {
        year: '2018 — 2020',
        degree: 'Secondary Education',
        institution: 'JSS Shri Manjunatheswara Central School',
        details: 'CBSE Board',
        percentage: '82.7%',
    },
];

export const Education = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="education" className="py-32 px-8 md:px-12 lg:px-20">
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-16"
            >
                E D U C A T I O N
            </motion.p>

            <div>
                {education.map((edu, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`border-t border-white/10 py-8 md:py-10 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 transition-colors duration-300 ${hoveredIndex === i
                            ? 'bg-accent'
                            : 'hover:bg-white/[0.03]'
                            }`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        data-cursor-engulf
                    >
                        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] gap-4 md:gap-6 items-baseline">
                            <span className={`text-sm md:text-base font-mono tracking-tight transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-accent'
                                }`}>
                                {edu.year}
                            </span>
                            <div>
                                <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-cream'
                                    }`}>
                                    {edu.degree}
                                </h3>
                                <p className={`text-sm mt-1 transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/40'
                                    }`}>
                                    {edu.institution}
                                </p>
                            </div>
                            <div className="md:text-right">
                                <p className={`text-lg font-bold mb-1 transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-accent'
                                    }`}>
                                    {edu.cgpa ? `CGPA: ${edu.cgpa}` : `Score: ${edu.percentage}`}
                                </p>
                                <p className={`text-sm transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/30'
                                    }`}>
                                    {edu.details}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
                <div className="border-t border-white/10"></div>
            </div>
        </section>
    );
};
