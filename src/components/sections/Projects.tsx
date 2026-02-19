import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const projects = [
    {
        title: 'BINKS',
        reveal: 'SMART WASTE MANAGEMENT',
        desc: 'AI + Blockchain system for waste classification and token-based user incentives',
        tech: 'Python, React, Solidity, Hardhat, MongoDB'
    },
    {
        title: 'ABHIMANYU',
        reveal: 'ELEPHANT WEIGHT ESTIMATION',
        desc: 'Computer vision system to estimate elephant weight from images for wildlife conservation',
        tech: 'Python, CNNs, OpenCV, PyTorch/TensorFlow'
    },
    {
        title: 'PERSONALIZED MEDICINE',
        reveal: 'GENETIC MUTATION PREDICTION',
        desc: 'NLP-driven deep learning model to predict genetic mutations from clinical text',
        tech: 'Python, BioBERT, Hugging Face, PyTorch'
    },
    {
        title: 'BOLTBOX',
        reveal: 'AI DEV TOOLKIT',
        desc: 'Full-stack platform to bootstrap projects with templates and AI stack suggestions',
        tech: 'Next.js, TypeScript, Tailwind CSS, MongoDB'
    },
    {
        title: 'VIRTUAL DIARY',
        reveal: 'SOCIAL MEMORY PLATFORM',
        desc: 'Collaborative web app for storing memories with friends, groups, and media',
        tech: 'React, Node.js, Express, MongoDB'
    },
    {
        title: 'FEED FORWARD',
        reveal: 'CRYPTO FOR FOOD REDISTRIBUTION',
        desc: 'Blockchain-based incentive system for efficient leftover food redistribution',
        tech: 'Solidity, Hardhat, Web3, React'
    },
    {
        title: 'IOT INTEGRATION',
        reveal: '3D CIRCUIT SYSTEM',
        desc: 'ESP32-based hardware system integrating multiple sensors with real-time display',
        tech: 'ESP32, Embedded C, Load Cell, Ultrasonic, IR, Camera'
    }
];

export const Projects = () => {
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
            id="projects"
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
                    P R O J E C T S
                </motion.p>

                <div>
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className={`border-t border-white/10 py-6 md:py-8 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 transition-colors duration-300 ${hoveredIndex === i ? 'bg-accent' : 'hover:bg-white/[0.03]'
                                }`}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            data-cursor-hide
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                                <h3 className={`text-[clamp(1.8rem,5vw,4rem)] font-black uppercase leading-none tracking-[-0.03em] transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]' : 'text-cream'
                                    }`}>
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                    <div className="md:text-right flex-1 md:flex-none">
                                        <span className={`text-sm block transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/60' : 'text-foreground/30'
                                            }`}>
                                            {project.desc}
                                        </span>
                                        <span className={`text-xs font-mono mt-1 block transition-colors duration-300 ${hoveredIndex === i ? 'text-[#0a0a0a]/40' : 'text-accent/60'
                                            }`}>
                                            {project.tech}
                                        </span>
                                    </div>
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
                        W O R K
                    </p>
                    <div>
                        {projects.map((project, i) => (
                            <div
                                key={project.title}
                                className="border-t border-[#0a0a0a]/20 py-6 md:py-8 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                                    <h3 className="text-[clamp(1.8rem,5vw,4rem)] font-black uppercase leading-none tracking-[-0.03em] text-[#0a0a0a]">
                                        {project.reveal}
                                    </h3>
                                    <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                        <div className="md:text-right flex-1 md:flex-none">
                                            <span className="text-sm block text-[#0a0a0a]/60">
                                                {project.desc}
                                            </span>
                                            <span className="text-xs font-mono mt-1 block text-[#0a0a0a]/40">
                                                {project.tech}
                                            </span>
                                        </div>
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
