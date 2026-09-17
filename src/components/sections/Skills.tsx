import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ViewMode } from '../../App';
import { SectionLabel } from '../ui/SectionLabel';

const skills = [
    {
        title: 'AI & ML',
        desc: 'LLM pipelines, agentic workflows, retrieval and embeddings, computer vision and NLP — trained, evaluated and actually deployed.',
        tech: ['PyTorch', 'Hugging Face', 'Gemini', 'AWS Bedrock', 'OpenCV', 'InsightFace', 'Embeddings', 'RAG'],
    },
    {
        title: 'BACKEND',
        desc: 'Async APIs, relational data modelling, row-level multi-tenancy, auth and token rotation, caching and rate limiting.',
        tech: ['FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'JWT', 'SSE'],
    },
    {
        title: 'FULL-STACK',
        desc: 'Component-driven product interfaces with real server state, not just screens — typed end to end.',
        tech: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'TanStack Query', 'Zustand', 'Prisma'],
    },
    {
        title: 'CLOUD & DEVOPS',
        desc: 'Containerised services, CI/CD that actually deploys, managed data stores and cost-aware infrastructure choices.',
        tech: ['AWS', 'Docker', 'GitHub Actions', 'Vercel', 'Amplify', 'Firebase', 'Supabase', 'Kubernetes'],
    },
    {
        title: 'WEB3',
        desc: 'Smart contract design, token incentive mechanics and safe integration between chain state and application state.',
        tech: ['Solidity', 'Hardhat', 'Web3.js', 'Ethers'],
    },
    {
        title: 'FOUNDATIONS',
        desc: 'System design, data structures and algorithms, testing discipline, and writing the docs that outlive the sprint.',
        tech: ['Python', 'C++', 'SQL', 'Git', 'System Design', 'Testing'],
    },
];

export const Skills = ({ viewMode }: { viewMode: ViewMode }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const reduceMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent) => {
        if (reduceMotion || !sectionRef.current) return;
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

    const renderList = (isReveal: boolean) => (
        <div className="py-32 px-8 md:px-12 lg:px-20">
            <SectionLabel className={`mb-16 ${isReveal ? 'text-[#0a0a0a]/80' : 'text-cream/80'}`}>
                {isReveal ? 'Expertise' : 'Skills'}
            </SectionLabel>

            <div>
                {skills.map((skill, i) => {
                    const active = !isReveal && hoveredIndex === i;
                    const dark = isReveal || active;

                    const Row = (
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-start gap-3 md:gap-10">
                            <h3
                                className={`text-[clamp(1.35rem,2.6vw,2.25rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] min-w-0 transition-colors duration-300 ${dark ? 'text-[#0a0a0a]' : 'text-cream'
                                    }`}
                            >
                                {skill.title}
                            </h3>

                            <div className="min-w-0 flex items-start gap-6 md:justify-end">
                                <div className="min-w-0 flex-1 md:text-right">
                                    <span
                                        className={`text-sm block transition-colors duration-300 ${dark ? 'text-[#0a0a0a]/80' : 'text-muted'
                                            }`}
                                    >
                                        {skill.desc}
                                    </span>
                                    <div className="flex flex-wrap md:justify-end gap-2 mt-3">
                                        {skill.tech.map((t) => (
                                            <span
                                                key={t}
                                                className={`px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors duration-300 ${dark
                                                    ? 'border-[#0a0a0a]/25 text-[#0a0a0a]/80'
                                                    : 'border-white/10 text-muted'
                                                    }`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span
                                    className={`text-sm font-mono shrink-0 transition-colors duration-300 ${dark ? 'text-[#0a0a0a]/60' : 'text-faint'
                                        }`}
                                >
                                    0{i + 1}
                                </span>
                            </div>
                        </div>
                    );

                    const rowClass = `border-t -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 py-6 md:py-8 transition-colors duration-300 ${isReveal ? 'border-[#0a0a0a]/20' : 'border-white/10'
                        } ${active ? 'bg-accent' : isReveal ? '' : 'hover:bg-white/[0.03]'}`;

                    if (isReveal) {
                        return (
                            <div key={skill.title} className={rowClass}>
                                {Row}
                            </div>
                        );
                    }

                    return (
                        <motion.div
                            key={skill.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className={rowClass}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            data-cursor-hide
                        >
                            {Row}
                        </motion.div>
                    );
                })}
                <div className={`border-t ${isReveal ? 'border-[#0a0a0a]/20' : 'border-white/10'}`} />
            </div>
        </div>
    );

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
            <div className="relative z-10">{renderList(false)}</div>

            {/* ─── Reveal Layer ─── */}
            <div
                className={`absolute inset-0 z-20 bg-accent pointer-events-none transition-opacity duration-300
                    ${viewMode === 'view_backend' ? '!hidden' : reduceMotion ? 'hidden' : 'hidden md:block'}
                    ${viewMode === 'view_ai_ml' ? '!block opacity-100' : ''}
                    ${hoveredIndex !== null && viewMode === 'both' ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    clipPath: viewMode === 'both' ? 'circle(120px at var(--mx) var(--my))' : 'none',
                }}
                aria-hidden={viewMode === 'both'}
            >
                {renderList(true)}
            </div>

            {/* Mobile fallback for AI & ML mode */}
            {viewMode === 'view_ai_ml' && (
                <div className="absolute inset-0 z-30 bg-accent md:hidden">
                    {renderList(true)}
                </div>
            )}
        </section>
    );
};
