import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../ui/SectionLabel';
import { orderedProjects, projectCategories, projects } from '../../data/projects';
import type { ProjectCategory } from '../../data/projects';

export const Projects = () => {
    const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const visible = useMemo(
        () =>
            filter === 'All'
                ? orderedProjects
                : orderedProjects.filter((p) => p.category.includes(filter)),
        [filter]
    );

    const clientCount = projects.filter((p) => p.context === 'Client').length;

    return (
        <section id="projects" className="py-32 px-8 md:px-12 lg:px-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <SectionLabel className="text-cream/80">Projects</SectionLabel>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-xs font-mono text-muted"
                >
                    {projects.length} selected · {clientCount} shipped for clients
                </motion.p>
            </div>

            {/* ─── Category filter ─── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap gap-2 mb-12"
                role="group"
                aria-label="Filter projects by category"
            >
                {projectCategories.map((cat) => {
                    const active = filter === cat;
                    const count =
                        cat === 'All'
                            ? projects.length
                            : projects.filter((p) => p.category.includes(cat)).length;

                    return (
                        <button
                            key={cat}
                            aria-pressed={active}
                            onClick={() => {
                                setFilter(cat);
                                setExpanded(null);
                            }}
                            className={`px-4 py-2 rounded-full border text-xs tracking-widest uppercase transition-colors duration-300 ${active
                                ? 'bg-accent border-accent text-[#0a0a0a] font-bold'
                                : 'border-white/15 text-muted hover:border-accent/50 hover:text-accent'
                                }`}
                            data-cursor-hide
                        >
                            {cat} <span className="font-mono opacity-50">{count}</span>
                        </button>
                    );
                })}
            </motion.div>

            {/* ─── Project rows ─── */}
            <div>
                <AnimatePresence initial={false}>
                    {visible.map((project, i) => {
                        const isHovered = hoveredIndex === i;
                        const isOpen = expanded === project.title;

                        return (
                            <motion.div
                                key={project.title}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{
                                    duration: 0.4,
                                    delay: Math.min(i * 0.04, 0.3),
                                    layout: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
                                }}
                                className={`border-t border-white/10 -mx-8 md:-mx-12 lg:-mx-20 px-8 md:px-12 lg:px-20 transition-colors duration-300 ${isHovered && !isOpen ? 'bg-accent' : 'hover:bg-white/[0.03]'
                                    }`}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/*
                                  * Hiding the cursor only makes sense while the row is a closed
                                  * bar that fills with accent on hover — that fill IS the hover
                                  * feedback. Once expanded the panel is ordinary content with a
                                  * link in it, and an invisible pointer over a button is a bug.
                                  */}
                                <button
                                    onClick={() => setExpanded(isOpen ? null : project.title)}
                                    aria-expanded={isOpen}
                                    className="w-full text-left py-6 md:py-8"
                                    data-cursor-hide={isOpen ? undefined : true}
                                >
                                    {/*
                                      * Explicit minmax(0,…) tracks: with `auto` minimums a long
                                      * unbroken line can push a column past its share and collide
                                      * with its neighbour.
                                      */}
                                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center gap-3 md:gap-10">
                                        <div className="min-w-0">
                                            <span
                                                className={`text-[10px] md:text-[11px] tracking-[0.25em] uppercase block mb-2 transition-colors duration-300 ${isHovered && !isOpen ? 'text-[#0a0a0a]/60' : 'text-accent'
                                                    }`}
                                            >
                                                {project.reveal}
                                            </span>
                                            <h3
                                                className={`text-[clamp(1.35rem,2.6vw,2.25rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] transition-colors duration-300 ${isHovered && !isOpen ? 'text-[#0a0a0a]' : 'text-cream'
                                                    }`}
                                            >
                                                {project.title}
                                            </h3>
                                        </div>

                                        <div className="min-w-0 flex items-start gap-6 md:justify-end">
                                            <div className="min-w-0 flex-1 md:text-right">
                                                <span
                                                    className={`text-sm block transition-colors duration-300 ${isHovered && !isOpen ? 'text-[#0a0a0a]/80' : 'text-muted'
                                                        }`}
                                                >
                                                    {project.desc}
                                                </span>
                                                <span
                                                    className={`text-xs font-mono mt-1 block transition-colors duration-300 ${isHovered && !isOpen ? 'text-[#0a0a0a]/60' : 'text-faint'
                                                        }`}
                                                >
                                                    {project.org} · {project.year}
                                                </span>
                                            </div>
                                            <span
                                                className={`text-sm font-mono shrink-0 transition-all duration-300 ${isHovered && !isOpen ? 'text-[#0a0a0a]/60' : 'text-faint'
                                                    } ${isOpen ? 'rotate-45' : ''}`}
                                                aria-hidden="true"
                                            >
                                                +
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-16">
                                                <ul className="space-y-3">
                                                    {project.highlights.map((h) => (
                                                        <li
                                                            key={h}
                                                            className="text-sm md:text-base text-foreground/60 leading-relaxed pl-5 relative"
                                                        >
                                                            <span className="absolute left-0 top-[0.6em] w-2 h-px bg-accent" />
                                                            {h}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-3">
                                                            Stack
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tech.map((t) => (
                                                                <span
                                                                    key={t}
                                                                    className="px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-muted"
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-2">
                                                            Type
                                                        </p>
                                                        <p className="text-sm text-accent">
                                                            {project.context === 'Client'
                                                                ? 'Client engagement'
                                                                : 'Academic / personal'}
                                                            {' · '}
                                                            {project.category.join(', ')}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        to={'/projects/' + project.slug}
                                                        className="inline-block px-5 py-2.5 rounded-full border border-accent/50 text-accent text-xs font-bold tracking-widest uppercase hover:bg-accent hover:text-[#0a0a0a] transition-colors duration-300"
                                                    >
                                                        Full case study &rarr;
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div className="border-t border-white/10" />
            </div>

            <p className="mt-8 text-xs text-faint">
                Client repositories are private — happy to walk through architecture and code on a call.
            </p>
        </section>
    );
};
