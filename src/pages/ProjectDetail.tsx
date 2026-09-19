import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { getProjectBySlug, getProjectNeighbours } from '../data/projects';
import { getCaseStudy } from '../data/caseStudies';
import { CaseStudyBody } from '../components/case-study/CaseStudyBody';
import { profile, siteUrl } from '../data/profile';
import { CustomCursor } from '../components/ui/CustomCursor';
import { ScrollProgress } from '../components/ui/ScrollProgress';

/**
 * Keeps the tab title, meta description and canonical in step with the route.
 * The app is client-rendered, so these have to be set at runtime — crawlers
 * that execute JS pick them up, and humans get a sane tab title either way.
 */
const useDocumentMeta = (title: string, description: string, path: string) => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = title;

        const setAttr = (selector: string, attr: string, value: string) => {
            const el = document.querySelector<HTMLElement>(selector);
            const previous = el?.getAttribute(attr) ?? null;
            el?.setAttribute(attr, value);
            return () => {
                if (el && previous !== null) el.setAttribute(attr, previous);
            };
        };

        const restore = [
            setAttr('meta[name="description"]', 'content', description),
            setAttr('meta[property="og:title"]', 'content', title),
            setAttr('meta[property="og:description"]', 'content', description),
            setAttr('meta[property="og:url"]', 'content', siteUrl + path),
            setAttr('link[rel="canonical"]', 'href', siteUrl + path),
        ];

        return () => {
            document.title = previousTitle;
            restore.forEach((fn) => fn());
        };
    }, [title, description, path]);
};

const NotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <p className="text-accent text-xs tracking-[0.4em] uppercase mb-6">404</p>
        <h1 className="text-[clamp(1.8rem,5vw,3rem)] font-black uppercase tracking-[-0.03em] text-cream mb-6">
            No such project
        </h1>
        <Link
            to="/"
            className="px-6 py-3 rounded-full bg-accent text-[#0a0a0a] text-sm font-bold tracking-widest uppercase"
        >
            Back to portfolio
        </Link>
    </div>
);

export const ProjectDetail = () => {
    const { slug = '' } = useParams();
    const project = getProjectBySlug(slug);
    const caseStudy = getCaseStudy(slug);
    const { prev, next } = getProjectNeighbours(slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    useDocumentMeta(
        project ? project.title + ' — ' + profile.name : 'Not found — ' + profile.name,
        project?.desc ?? 'Project not found.',
        '/projects/' + slug
    );

    if (!project) {
        return (
            <div className="bg-background text-foreground min-h-screen">
                <CustomCursor />
                <NotFound />
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen">
            <CustomCursor />
            <ScrollProgress />

            <header className="px-8 md:px-12 lg:px-20 pt-10">
                <Link
                    to="/#projects"
                    className="text-xs tracking-[0.25em] uppercase text-muted hover:text-accent transition-colors duration-300"
                    data-cursor-hide
                >
                    &larr; All projects
                </Link>
            </header>

            <main className="px-8 md:px-12 lg:px-20 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl"
                >
                    <p className="text-accent text-[11px] md:text-xs tracking-[0.25em] uppercase mb-4">
                        {project.reveal}
                    </p>
                    <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-cream mb-6">
                        {project.title}
                    </h1>
                    <p className="text-base md:text-xl text-foreground/80 leading-relaxed max-w-3xl mb-8">
                        {project.desc}
                    </p>

                    <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
                        <div>
                            <dt className="text-[10px] tracking-[0.3em] uppercase text-faint mb-1">Built for</dt>
                            <dd className="text-sm text-muted">{project.org}</dd>
                        </div>
                        <div>
                            <dt className="text-[10px] tracking-[0.3em] uppercase text-faint mb-1">Year</dt>
                            <dd className="text-sm text-muted">{project.year}</dd>
                        </div>
                        <div>
                            <dt className="text-[10px] tracking-[0.3em] uppercase text-faint mb-1">Type</dt>
                            <dd className="text-sm text-muted">
                                {project.context === 'Client' ? 'Client engagement' : 'Academic / personal'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[10px] tracking-[0.3em] uppercase text-faint mb-1">Discipline</dt>
                            <dd className="text-sm text-muted">{project.category.join(', ')}</dd>
                        </div>
                    </dl>
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-16"
                >
                    <div>
                        <h2 className="text-xs tracking-[0.4em] uppercase text-cream/80 mb-8">
                            At a glance
                        </h2>
                        <ul className="space-y-5">
                            {project.highlights.map((h) => (
                                <li
                                    key={h}
                                    className="text-sm md:text-base text-foreground/80 leading-relaxed pl-6 relative"
                                >
                                    <span className="absolute left-0 top-[0.7em] w-3 h-px bg-accent" />
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xs tracking-[0.4em] uppercase text-cream/80 mb-8">Stack</h2>
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
                </motion.section>

                {caseStudy && <CaseStudyBody study={caseStudy} />}

                <nav
                    className="mt-24 border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-6 sm:justify-between"
                    aria-label="Project navigation"
                >
                    {prev ? (
                        <Link to={'/projects/' + prev.slug} className="group" data-cursor-hide>
                            <span className="block text-[10px] tracking-[0.3em] uppercase text-faint mb-2">
                                Previous
                            </span>
                            <span className="text-lg md:text-xl font-bold uppercase text-cream group-hover:text-accent transition-colors duration-300">
                                {prev.title}
                            </span>
                        </Link>
                    ) : (
                        <span />
                    )}

                    {next && (
                        <Link
                            to={'/projects/' + next.slug}
                            className="group sm:text-right"
                            data-cursor-hide
                        >
                            <span className="block text-[10px] tracking-[0.3em] uppercase text-faint mb-2">
                                Next
                            </span>
                            <span className="text-lg md:text-xl font-bold uppercase text-cream group-hover:text-accent transition-colors duration-300">
                                {next.title}
                            </span>
                        </Link>
                    )}
                </nav>
            </main>

            <Analytics />
        </div>
    );
};

export default ProjectDetail;
