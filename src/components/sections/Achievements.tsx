import { useState } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { achievements } from '../../data/achievements';
import { motion } from 'framer-motion';

export const Achievements = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="achievements" className="py-32 px-8 md:px-12 lg:px-20">
            <SectionLabel className="text-cream/80 mb-16">Achievements</SectionLabel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`group border rounded-2xl p-8 transition-all duration-500 ${hoveredIndex === i
                            ? 'bg-accent border-accent text-[#0a0a0a]'
                            : 'border-white/10 hover:border-accent/40 hover:bg-accent/5'
                            }`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        data-cursor-hide
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className={`text-3xl font-black transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-accent'
                                }`}>
                                0{i + 1}
                            </span>
                            <span className={`text-xs tracking-widest uppercase transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/80' : 'text-faint group-hover:text-accent'
                                }`}>
                                {item.event}
                            </span>
                        </div>
                        <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-cream group-hover:text-accent'
                            }`}>
                            {item.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/80' : 'text-muted'
                            }`}>
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
