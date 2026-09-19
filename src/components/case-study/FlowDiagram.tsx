import { motion } from 'framer-motion';
import type { Diagram, FlowNode, NodeKind } from '../../data/caseStudies';

/**
 * Each kind is a different *role* in the system, not decoration — so the
 * legend is worth reading before the diagram.
 */
const KIND_STYLE: Record<NodeKind, string> = {
    input: 'border-cream/40 text-cream',
    process: 'border-white/15 text-foreground/90',
    ai: 'border-accent/60 text-accent bg-accent/[0.06]',
    store: 'border-white/20 border-dashed text-foreground/80',
    external: 'border-white/25 border-dotted text-foreground/80',
    output: 'border-accent bg-accent text-[#0a0a0a] font-semibold',
};

const KIND_LABEL: Record<NodeKind, string> = {
    input: 'Input',
    process: 'Deterministic',
    ai: 'Model in the loop',
    store: 'Storage',
    external: 'Third party',
    output: 'Output',
};

const NodeCard = ({ node }: { node: FlowNode }) => (
    <div className={`rounded-xl border px-3.5 py-3 ${KIND_STYLE[node.kind]}`}>
        <span className="block text-[13px] leading-snug font-medium">{node.label}</span>
        {node.sub && (
            <span
                className={`block text-[11px] font-mono mt-1 leading-snug ${node.kind === 'output' ? 'text-[#0a0a0a]/70' : 'text-muted'
                    }`}
            >
                {node.sub}
            </span>
        )}
    </div>
);

/**
 * Connector between stages. Horizontal on desktop, vertical once the columns
 * stack. The travelling dot is the only animated part, so switching it off
 * under reduced motion costs nothing but the flourish.
 */
const Connector = () => (
    <div className="flex md:flex-col items-center justify-center shrink-0 self-center" aria-hidden="true">
        <div className="relative w-px h-8 md:w-10 md:h-px bg-white/15 overflow-hidden">
            <span className="absolute inset-0 flow-pulse motion-reduce:animate-none bg-accent" />
        </div>
    </div>
);

export const FlowDiagram = ({ diagram }: { diagram: Diagram }) => {
    // Only advertise the kinds this particular diagram actually uses.
    const usedKinds = Array.from(
        new Set(diagram.columns.flatMap((c) => c.nodes.map((n) => n.kind)))
    );

    return (
        <figure className="my-14">
            <figcaption className="mb-6">
                <h3 className="text-base md:text-lg font-bold text-cream mb-2">{diagram.title}</h3>
                {diagram.caption && (
                    <p className="text-sm text-muted max-w-2xl leading-relaxed">{diagram.caption}</p>
                )}
            </figcaption>

            {/* Wide diagrams scroll inside their own container — the page never does. */}
            <div className="-mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 overflow-x-auto pb-4">
                <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0 md:min-w-max">
                    {diagram.columns.map((column, i) => (
                        <div key={column.title} className="contents md:flex md:items-stretch">
                            {i > 0 && <Connector />}

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.45, delay: Math.min(i * 0.09, 0.6) }}
                                className="md:w-[190px] shrink-0 flex flex-col"
                            >
                                <span className="text-[10px] tracking-[0.25em] uppercase text-faint mb-3">
                                    {column.title}
                                </span>
                                <div className="flex flex-col gap-2.5">
                                    {column.nodes.map((node) => (
                                        <NodeCard key={node.label} node={node} />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-[11px] text-muted">
                {usedKinds.map((kind) => (
                    <li key={kind} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded border shrink-0 ${KIND_STYLE[kind]}`} />
                        {KIND_LABEL[kind]}
                    </li>
                ))}
            </ul>
        </figure>
    );
};
