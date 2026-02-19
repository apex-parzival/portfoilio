import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { ViewMode } from '../../App';

// Layer 1: Backend Engineer (Cream text)
const textLayer1 = (
    <>
        I’m <span className="text-accent font-bold not-italic">Mohammed Yaseen Sutar</span>, a backend engineer who enjoys designing clean, scalable systems that power modern applications. I build robust RESTful APIs, design reliable data models, and focus on performance, security, and maintainability.
        <br /><br />
        My approach to backend development is product-driven. I think in terms of system architecture, clear contracts between services, and building foundations that teams can scale on. From authentication flows to database design and API integrations, I enjoy creating the infrastructure that quietly makes everything else work.
    </>
);

// Layer 2: AI/ML Engineer (Black text on Orange bg)
const textLayer2 = (
    <>
        I’m <span className="font-bold not-italic">Mohammed Yaseen Sutar</span>, an AI/ML engineer focused on building intelligent systems that work beyond notebooks and demos. My work spans computer vision and NLP, where I design end-to-end pipelines from data collection and preprocessing to model training, evaluation, and deployment.
        <br /><br />
        I enjoy working with real-world, imperfect data and turning it into models that deliver measurable impact. Whether it’s predicting genetic mutations from clinical text or estimating elephant weight from images, I care about building ML systems that are reliable, scalable, and ready for production.
    </>
);

export const About = ({ viewMode }: { viewMode: ViewMode }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current || viewMode !== 'both') return;
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
                    <p className={`text-xs tracking-[0.4em] uppercase mb-12 ${isReveal ? 'text-[#0a0a0a]/60' : 'text-accent'
                        }`}>
                        A B O U T &nbsp; M E
                    </p>

                    <div className="max-w-6xl">
                        <p className={`text-[clamp(1.25rem,2.5vw,2.5rem)] font-medium leading-[1.6] tracking-tight ${isReveal ? 'text-[#0a0a0a]' : 'text-cream'
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
