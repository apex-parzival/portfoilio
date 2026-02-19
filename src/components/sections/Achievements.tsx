import { useState } from 'react';
import { motion } from 'framer-motion';

const achievements = [
    {
        title: 'Runner Up — ₹1,50,000',
        event: 'RBIH Ideathon @ IIITB',
        desc: 'Created a Web3 money lending system for microbusiness owners',
    },
    {
        title: 'Best Project — ₹5,000',
        event: 'Quant-A-Maze @ NMIT',
        desc: 'Built a Web3 & ML-based food conservation system',
    },
    {
        title: 'Runner Up — ₹1,500',
        event: 'Web Wizards @ DSU',
        desc: 'Built a Halloween-themed website in 3 hours',
    },
];

export const Achievements = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="achievements" className="py-32 px-8 md:px-12 lg:px-20">
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-cream/60 text-xs tracking-[0.4em] uppercase mb-16"
            >
                A C H I E V E M E N T S
            </motion.p>

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
                            <span className={`text-xs tracking-widest uppercase transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/20 group-hover:text-accent/60'
                                }`}>
                                {item.event}
                            </span>
                        </div>
                        <h3 className={`text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-cream group-hover:text-accent'
                            }`}>
                            {item.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/70' : 'text-foreground/30'
                            }`}>
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
