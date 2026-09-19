import { motion } from 'framer-motion';
import type { CaseStudy } from '../../data/caseStudies';
import { FlowDiagram } from './FlowDiagram';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
};

const Heading = ({ children }: { children: string }) => (
    <h2 className="text-[10px] tracking-[0.35em] uppercase text-accent mb-5">{children}</h2>
);

const Prose = ({ children }: { children: string }) => (
    <p className="text-base md:text-[17px] leading-[1.75] text-foreground/85 max-w-3xl">{children}</p>
);

export const CaseStudyBody = ({ study }: { study: CaseStudy }) => (
    <div className="mt-20 border-t border-white/10 pt-16">
        <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-16">
            <Heading>The problem</Heading>
            <Prose>{study.problem}</Prose>
        </motion.section>

        <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-6">
            <Heading>The approach</Heading>
            <Prose>{study.approach}</Prose>
        </motion.section>

        <FlowDiagram diagram={study.diagram} />

        {study.metrics && study.metrics.length > 0 && (
            <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-16">
                <Heading>By the numbers</Heading>
                <dl className="flex flex-wrap gap-3">
                    {study.metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="flex-1 min-w-[150px] rounded-2xl border border-white/10 p-5 md:p-6"
                        >
                            <dt className="sr-only">{metric.label}</dt>
                            <dd>
                                <span className="block text-[clamp(1.5rem,3vw,2.25rem)] font-black tracking-[-0.03em] text-accent leading-none">
                                    {metric.value}
                                </span>
                                <span className="block text-[11px] md:text-xs text-muted mt-2.5 leading-snug">
                                    {metric.label}
                                </span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </motion.section>
        )}

        {study.decisions && study.decisions.length > 0 && (
            <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-16">
                <Heading>Decisions worth explaining</Heading>
                <div className="space-y-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                    {study.decisions.map((decision, i) => (
                        <div
                            key={decision.title}
                            className="bg-background p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-8"
                        >
                            <span className="text-sm font-mono text-faint md:pt-1">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-cream mb-3 leading-snug">
                                    {decision.title}
                                </h3>
                                <p className="text-sm md:text-base leading-relaxed text-muted max-w-2xl">
                                    {decision.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>
        )}

        {study.outcome && (
            <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
                <Heading>Where it landed</Heading>
                <p className="text-[clamp(1.05rem,1.8vw,1.5rem)] leading-[1.6] text-cream max-w-3xl font-medium">
                    {study.outcome}
                </p>
            </motion.section>
        )}
    </div>
);
