import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionLabel } from '../ui/SectionLabel';
import type { ViewMode } from '../../App';

// Layer 1: Backend Engineer (Cream text)
const textLayer1 = (
    <>
        I’m <span className="text-accent font-bold not-italic">Mohammed Yaseen Sutar</span>, a backend engineer who designs the systems everything else gets built on. Async APIs, data models that hold up under real load, and the unglamorous parts done properly — auth and token rotation, multi-tenant isolation, rate limiting, migrations that don’t lose rows.
        <br /><br />
        Most of what I shipped this year went to real clients: a gateway translating legacy hospital messaging into a national health platform’s format, a multi-tenant attendance backend enforcing row-level security over children’s biometric data, a reverse-auction engine where concurrent bids had to settle deterministically. I’d rather the infrastructure be boring and the product be interesting.
    </>
);

// Layer 2: AI/ML Engineer (Black text on Orange bg)
const textLayer2 = (
    <>
        I’m <span className="font-bold not-italic">Mohammed Yaseen Sutar</span>, an AI/ML engineer who builds intelligent systems that survive contact with real data. My work runs from computer vision and NLP through to LLM and agentic pipelines — retrieval, embeddings, evaluation, and the deployment story a notebook never has to answer for.
        <br /><br />
        I’ve built a multi-agent sourcing pipeline that researches and contacts suppliers on its own, an embedding-plus-LLM-judge engine that catches bill-of-materials errors before they reach the factory floor, and a face-recognition attendance system tuned so a close second match downgrades instead of silently auto-accepting. The interesting work is always in the failure cases.
    </>
);

export const About = ({ viewMode }: { viewMode: ViewMode }) => {
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

    const renderContent = (isReveal: boolean) => {
        return (
            <div className="py-24 md:py-32 px-8 md:px-12 lg:px-20 relative min-h-screen flex flex-col justify-center">
                <div className="relative z-10">
                    <SectionLabel className={`mb-12 ${isReveal ? 'text-[#0a0a0a]/80' : 'text-accent'}`}>
                        About me
                    </SectionLabel>

                    <div className="max-w-4xl">
                        <p className={`text-[clamp(1rem,1.35vw,1.4rem)] font-medium leading-[1.7] tracking-tight ${isReveal ? 'text-[#0a0a0a]' : 'text-cream'
                            }`}>
                            {isReveal ? textLayer2 : textLayer1}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section
            ref={sectionRef}
            id="about"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden"
            style={{ '--mx': '-200px', '--my': '-200px' } as React.CSSProperties}
        >
            {/* ─── Front Layer (Layer 1: Backend) ─── */}
            <div className={`relative z-10 ${viewMode === 'view_ai_ml' ? 'opacity-0' : 'opacity-100'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {renderContent(false)}
                </motion.div>
            </div>

            {/* ─── Reveal Layer (Layer 2: AI & ML) ─── */}
            <div
                className={`absolute inset-0 z-20 bg-accent pointer-events-none 
                    ${viewMode === 'view_backend' ? '!hidden' : 'hidden md:block'} 
                    ${viewMode === 'view_ai_ml' ? '!block opacity-100 !clip-path-none pointer-events-auto' : ''}`}
                style={{
                    clipPath: viewMode === 'both' ? 'circle(200px at var(--mx) var(--my))' : 'none'
                }}
                aria-hidden={viewMode === 'both'}
            >
                {renderContent(true)}
            </div>

            {/* Mobile Fallback for AI & ML Mode */}
            {viewMode === 'view_ai_ml' && (
                <div className="absolute inset-0 z-30 bg-accent md:hidden flex flex-col justify-center">
                    {renderContent(true)}
                </div>
            )}
        </section>
    );
};
