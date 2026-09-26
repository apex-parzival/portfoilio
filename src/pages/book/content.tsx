import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderedProjects, projects } from '../../data/projects';
import { getCaseStudy } from '../../data/caseStudies';
import { voices } from '../../data/about';
import { education } from '../../data/education';
import { skills } from '../../data/skills';
import { experiences } from '../../data/experience';
import { achievements } from '../../data/achievements';
import { profile } from '../../data/profile';
import { useBook, useFacePlayed } from './context';
import { CHAPTERS, FACES, faceMeta, type FaceId } from './timeline';
import {
    ChapterOpener,
    CountUp,
    Device,
    Fleuron,
    InkFigure,
    LeaderRow,
    Marginalia,
    Medal,
    PaperPage,
    Rule,
    WaxSeal,
} from './primitives';

const EASE = [0.22, 1, 0.36, 1] as const;

const WORDS = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
    'nineteen', 'twenty',
];
const inWords = (n: number) =>
    n <= 20 ? WORDS[n] : n < 30 ? `twenty-${WORDS[n - 20]}` : String(n);

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const featured = orderedProjects.filter((p) => p.featured);
const remaining = orderedProjects.filter((p) => !p.featured);
const clientCount = projects.filter((p) => p.context === 'Client').length;

/** Emphasise the author's name wherever it appears in running text. */
const withName = (text: string) => {
    const [before, ...rest] = text.split(profile.name);
    if (rest.length === 0) return text;
    return (
        <>
            {before}
            <span className="bk-caps text-[0.82em] tracking-[0.08em]">{profile.name}</span>
            {rest.join(profile.name)}
        </>
    );
};

/** Inside of the front board: gilt-lattice endpaper with a bookplate. */
export const EndpaperFace = () => {
    const played = useFacePlayed('endpaper');
    return (
        <div className="absolute inset-0 bk-endpaper bk-verso rounded-[7px_3px_3px_7px] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[236px] bk-paper bk-serif rounded-[2px] px-7 py-7 text-center shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                    <div className="absolute inset-[7px] border border-[color:var(--bk-ink)] opacity-40 pointer-events-none" />
                    <div className="absolute inset-[10px] border border-[color:var(--bk-rubric)] opacity-40 pointer-events-none" />
                    <div className="bk-caps text-[11px] tracking-[0.4em] text-[color:var(--bk-rubric)]">Ex Libris</div>
                    <Device className="w-[74px] mx-auto my-3" />
                    <div className="text-[12px] italic text-[color:var(--bk-ink-soft)]">this copy belongs to</div>
                    <div className="relative h-[42px] mt-1">
                        <motion.div
                            className="bk-script absolute inset-x-0 top-0 text-[30px] text-[color:var(--bk-rubric)]"
                            initial={false}
                            animate={{ clipPath: played ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                            transition={{ duration: played ? 1.4 : 0, delay: played ? 0.6 : 0, ease: 'easeInOut' }}
                        >
                            you, the reader
                        </motion.div>
                        <div className="absolute bottom-[2px] inset-x-4 h-px bg-[color:var(--bk-ink)] opacity-40" />
                    </div>
                    <div className="mt-3 text-[10.5px] italic text-[color:var(--bk-ink-soft)]">
                        Please return it by scrolling back up.
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Front matter ────────────────────────────────────────────────────────────

export const TitlePage = () => (
    <PaperPage face="title" head={false} className="flex flex-col items-center text-center">
        <div className="mt-10 bk-caps text-[31px] tracking-[0.22em] pl-[0.22em] font-medium leading-tight">
            Selected
            <br />
            Work
        </div>
        <Rule className="w-40 mt-5" />
        <p className="mt-5 text-[14.5px] italic leading-snug text-[color:var(--bk-ink-soft)] max-w-[270px]">
            being a portfolio of systems, models, and the decisions behind them
        </p>
        <div className="mt-auto" />
        <p className="text-[13px] italic text-[color:var(--bk-ink-soft)]">by</p>
        <p className="mt-1 bk-caps text-[15.5px] tracking-[0.2em] pl-[0.2em]">{profile.name}</p>
        <p className="mt-1 text-[13px] italic text-[color:var(--bk-rubric)]">Backend &amp; AI/ML Engineer</p>
        <Device className="w-[92px] mt-7" />
        <p className="mt-6 mb-2 bk-caps text-[9.5px] text-[color:var(--bk-ink-faint)]">First Edition · MMXXVI</p>
    </PaperPage>
);

export const CopyrightPage = () => {
    const played = useFacePlayed('copyright');
    return (
        <PaperPage face="copyright" head={false} className="flex flex-col">
            <blockquote className="mt-16 px-4 text-center">
                <p className="text-[19px] italic leading-[1.4]">
                    “I’d rather the infrastructure be boring and the product be interesting.”
                </p>
                <footer className="mt-3 bk-caps text-[9.5px] text-[color:var(--bk-ink-faint)]">
                    — The author, in chapter one
                </footer>
            </blockquote>

            <div className="mt-auto text-[11px] leading-[1.55] text-[color:var(--bk-ink-soft)] space-y-2.5 relative">
                <p>
                    Copyright © 2026 {profile.name}.
                    <br />
                    All rights reserved; most wrongs corrected.
                </p>
                <p>
                    Client names are withheld under agreement. Every figure quoted in these pages is a measured
                    one — where no measurement existed, none is given.
                </p>
                <div className="relative">
                    <p className="pr-[92px]">
                        Typeset in EB Garamond. Bound in CSS: a stack of planes in a single preserve-3d context,
                        turned by your scroll. Only the two who turn its pages are WebGL.
                    </p>
                    <Marginalia played={played} className="right-0 bottom-0 w-[84px] text-right" rotate={-7}>
                        yes, really.
                    </Marginalia>
                </div>
                <p className="bk-caps text-[9px]">First edition · MMXXVI</p>
            </div>
        </PaperPage>
    );
};

export const ContentsPage = () => {
    const { goToFace } = useBook();
    const entries = CHAPTERS.filter((c) => c.numeral || c.key === 'colophon');
    return (
        <PaperPage face="contents" head={false}>
            <h2 className="mt-4 text-center text-[32px] italic font-medium">Contents</h2>
            <Fleuron className="mx-auto mt-2 w-16 text-[color:var(--bk-rubric)]" />
            <nav className="mt-7" aria-label="Chapters">
                <ol className="space-y-[9px]">
                    {entries.map((c) => (
                        <li key={c.key}>
                            <button
                                type="button"
                                onClick={() => goToFace(c.face)}
                                className="group w-full text-left"
                            >
                                <LeaderRow
                                    className="text-[15px]"
                                    label={
                                        <span className="flex items-baseline gap-3">
                                            <span className="w-7 text-right text-[color:var(--bk-rubric)] font-medium">
                                                {c.numeral}
                                            </span>
                                            <span className="group-hover:text-[color:var(--bk-rubric)] transition-colors">
                                                {c.title}
                                            </span>
                                        </span>
                                    }
                                    value={<span className="italic">{faceMeta(c.face).folio}</span>}
                                />
                            </button>
                        </li>
                    ))}
                </ol>
            </nav>
            <p className="absolute bottom-0 inset-x-0 text-center text-[11.5px] italic text-[color:var(--bk-ink-soft)]">
                Turn with the arrow keys, the dog-eared corners,
                <br />a drag across the page — or simply scroll.
            </p>
        </PaperPage>
    );
};

// ─── I. Two Voices ───────────────────────────────────────────────────────────

export const VoiceBackendPage = () => (
    <PaperPage face="voice-backend" head={false}>
        <ChapterOpener numeral="I" title="Two Voices" subtitle="in which one engineer is described twice" />
        <p className="bk-caps text-[10px] text-[color:var(--bk-rubric)] mb-2">{voices.backend.label}</p>
        <div className="text-[14px] leading-[1.47] space-y-2.5 text-justify hyphens-auto">
            {voices.backend.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'bk-dropcap' : 'indent-5'}>
                    {withName(p)}
                </p>
            ))}
        </div>
    </PaperPage>
);

export const VoiceAiPage = () => {
    const played = useFacePlayed('voice-ai');
    return (
        <PaperPage face="voice-ai">
            <p className="bk-caps text-[10px] text-[color:var(--bk-rubric)] mt-3">{voices.ai.label}</p>
            <p className="text-[12px] italic text-[color:var(--bk-ink-soft)] mb-4">
                a facing-page translation, by the same hand
            </p>
            <div className="text-[14px] leading-[1.47] italic space-y-2.5 text-justify hyphens-auto">
                {voices.ai.paragraphs.map((p, i) => (
                    <p key={i} className={i === 0 ? 'bk-dropcap' : 'indent-5'}>
                        {withName(p)}
                    </p>
                ))}
            </div>
            <Fleuron className="mx-auto mt-6 w-14 text-[color:var(--bk-rubric)]" />
            <Marginalia played={played} className="left-0 bottom-2" rotate={-3}>
                ← read both. same person.
            </Marginalia>
        </PaperPage>
    );
};

// ─── II. Schooling ───────────────────────────────────────────────────────────

export const EducationPage = () => (
    <PaperPage face="education" head={false}>
        <ChapterOpener numeral="II" title="Schooling" subtitle="the formal part of the education" />
        <ol className="space-y-4">
            {education.map((e) => (
                <li key={e.institution} className="grid grid-cols-[62px_1fr] gap-3">
                    <span className="text-[12.5px] italic text-[color:var(--bk-ink-soft)] pt-[2px] bk-lnum">
                        {e.year.replace(/\s*—\s*/, '–')}
                    </span>
                    <div>
                        <p className="text-[14.5px] leading-snug font-medium">{e.degree}</p>
                        <p className="text-[13px] italic text-[color:var(--bk-ink-soft)]">{e.institution}</p>
                        <LeaderRow
                            className="mt-1 text-[12px]"
                            label={<span className="text-[color:var(--bk-ink-soft)]">{e.details}</span>}
                            value={
                                <span className="bk-caps text-[10px] text-[color:var(--bk-rubric)] bk-lnum">
                                    {e.cgpa ? `CGPA ${e.cgpa}` : e.percentage}
                                </span>
                            }
                        />
                    </div>
                </li>
            ))}
        </ol>
        <Fleuron className="mx-auto mt-6 w-14 text-[color:var(--bk-rubric)]" />
    </PaperPage>
);

// ─── III. The Toolkit ────────────────────────────────────────────────────────

export const SkillsPage = () => (
    <PaperPage face="skills" head={false}>
        <ChapterOpener compact numeral="III" title="The Toolkit" subtitle="a glossary of the author’s instruments" />
        <dl className="space-y-[7px]">
            {skills.map((s) => (
                <div key={s.title}>
                    <dt className="sr-only">{s.title}</dt>
                    <dd className="text-[12px] leading-[1.38]">
                        <span className="bk-caps text-[10.5px] font-semibold text-[color:var(--bk-rubric)] mr-1.5">
                            {s.title}
                        </span>
                        {s.desc}
                        <span className="block text-[11px] italic text-[color:var(--bk-ink-soft)] mt-[1px]">
                            Instruments: {s.tech.slice(0, 5).join(', ')}.
                        </span>
                    </dd>
                </div>
            ))}
        </dl>
    </PaperPage>
);

// ─── IV. The Work ────────────────────────────────────────────────────────────

export const WorkOpenerPage = () => {
    const { goToFace } = useBook();
    return (
        <PaperPage face="work" head={false}>
            <ChapterOpener numeral="IV" title="The Work" subtitle="with six plates and an appendix" />
            <p className="bk-dropcap text-[13.5px] leading-[1.47] text-justify hyphens-auto">
                {inWords(projects.length).replace(/^./, (c) => c.toUpperCase())} projects follow —{' '}
                {inWords(clientCount)} shipped for clients, the rest built for study and for sport. {featured.length === 6 ? 'Six' : inWords(featured.length)} are
                printed here as plates, each with its figure; the other {inWords(remaining.length)} are catalogued in
                the appendix. Every one of them has a full case study online.
            </p>
            <p className="bk-caps text-[10px] text-[color:var(--bk-rubric)] mt-5 mb-2">List of Plates</p>
            <ol className="space-y-[6px]">
                {featured.map((p, i) => (
                    <li key={p.slug}>
                        <button type="button" onClick={() => goToFace(`plate-${i}` as FaceId)} className="group w-full text-left">
                            <LeaderRow
                                className="text-[13px]"
                                label={
                                    <span>
                                        <span className="inline-block w-8 text-[color:var(--bk-rubric)]">{ROMAN[i]}</span>
                                        <span className="bk-caps text-[11.5px] tracking-[0.08em] group-hover:text-[color:var(--bk-rubric)] transition-colors">
                                            {p.title}
                                        </span>
                                    </span>
                                }
                                value={<span className="italic">{faceMeta(`plate-${i}` as FaceId).folio}</span>}
                            />
                        </button>
                    </li>
                ))}
            </ol>
        </PaperPage>
    );
};

const PLATE_NOTES: Record<number, { text: string; className: string; rotate: number }> = {
    0: { text: 'deterministic first, model second', className: 'right-0 -bottom-1 w-[150px] text-right', rotate: -5 },
    2: { text: 'consent checked at every capture', className: 'right-0 -bottom-1 w-[150px] text-right', rotate: -4 },
    4: { text: 'sealed round first — no anchoring', className: 'right-0 -bottom-1 w-[150px] text-right', rotate: -5 },
};

export const PlatePage = ({ index }: { index: number }) => {
    const face = `plate-${index}` as FaceId;
    const played = useFacePlayed(face);
    const project = featured[index];
    const study = getCaseStudy(project.slug);
    const note = PLATE_NOTES[index];

    return (
        <PaperPage face={face} className="flex flex-col">
            <p className="mt-2 text-[10.5px] text-[color:var(--bk-ink-soft)]">
                <span className="bk-caps text-[color:var(--bk-rubric)]">Plate {ROMAN[index]}</span>
                <span className="italic"> · {project.org} · {project.year}</span>
            </p>
            <h3 className="mt-1.5 bk-caps text-[22px] leading-[1.08] tracking-[0.05em] font-medium">{project.title}</h3>
            <p className="mt-1 text-[14px] italic text-[color:var(--bk-rubric)]">{project.reveal.toLowerCase()}</p>
            <p className="mt-2.5 text-[13px] leading-[1.45] text-[color:var(--bk-ink-soft)]">{project.desc}.</p>

            {study && (
                <div className="mt-4">
                    <InkFigure diagram={study.diagram} number={index + 1} played={played} />
                </div>
            )}

            {study?.metrics && study.metrics.length > 0 && (
                <dl className="mt-4 grid grid-cols-3 border-y border-[color:var(--bk-ink)]/25 py-2.5">
                    {study.metrics.slice(0, 3).map((m, i) => (
                        <div key={m.label} className={`px-2 ${i > 0 ? 'border-l border-[color:var(--bk-ink)]/20' : ''}`}>
                            <dt className="sr-only">{m.label}</dt>
                            <dd>
                                <span className="block text-[21px] leading-none font-medium text-[color:var(--bk-rubric)] bk-lnum">
                                    <CountUp value={m.value} played={played} />
                                </span>
                                <span className="block mt-1 text-[9.5px] leading-[1.25] text-[color:var(--bk-ink-soft)]">
                                    {m.label}
                                </span>
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            <motion.div
                className="mt-4 grid grid-cols-[14px_1fr] gap-x-1.5 text-[12px] leading-[1.42]"
                initial={false}
                animate={played ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: played ? 0.8 : 0, delay: played ? 1.5 : 0 }}
            >
                <span className="text-[color:var(--bk-rubric)] text-[14px] leading-none pt-[1px]" aria-hidden="true">
                    ¶
                </span>
                <p className="text-justify hyphens-auto">{project.highlights[0]}.</p>
            </motion.div>
            <p className="mt-2 text-[11px] italic text-[color:var(--bk-ink-soft)]">
                Materials: {project.tech.slice(0, 6).join(', ')}.
            </p>

            <Link to={`/projects/${project.slug}`} className="bk-link mt-auto text-[13px] italic self-start">
                Read the full case study →
            </Link>

            {note && (
                <Marginalia played={played} className={note.className} rotate={note.rotate}>
                    {note.text}
                </Marginalia>
            )}
        </PaperPage>
    );
};

export const AppendixPage = () => (
    <PaperPage face="appendix">
        <h3 className="mt-1 text-[20px] leading-none italic font-medium">Appendix</h3>
        <p className="mt-1 text-[11.5px] italic text-[color:var(--bk-ink-soft)]">
            the remaining {inWords(remaining.length)}, each with a case study online
        </p>
        <Rule className="mt-2 mb-2.5" />
        <ol className="space-y-[3px]">
            {remaining.map((p) => (
                <li key={p.slug}>
                    <Link to={`/projects/${p.slug}`} className="group block">
                        <span className="flex items-baseline justify-between gap-3">
                            <span className="bk-caps text-[10px] leading-[1.3] font-medium tracking-[0.1em] group-hover:text-[color:var(--bk-rubric)] transition-colors truncate">
                                {p.title}
                            </span>
                            <span className="text-[10px] italic text-[color:var(--bk-ink-faint)] shrink-0 bk-lnum">
                                {p.context === 'Client' ? 'client' : 'study'} · {p.year}
                            </span>
                        </span>
                        <span className="block text-[10.5px] italic leading-[1.2] text-[color:var(--bk-ink-soft)] truncate">
                            {p.reveal.toLowerCase()}
                        </span>
                    </Link>
                </li>
            ))}
        </ol>
    </PaperPage>
);

// ─── V. Apprenticeships ──────────────────────────────────────────────────────

export const ExperiencePage = () => (
    <PaperPage face="experience" head={false}>
        <ChapterOpener compact numeral="V" title="Apprenticeships" subtitle="where the work was learned" />
        <ol className="space-y-3.5">
            {experiences.map((e) => (
                <li key={e.company}>
                    <p className="text-[14.5px] font-medium leading-snug">{e.role}</p>
                    <p className="text-[12.5px] italic">
                        <span className="text-[color:var(--bk-rubric)]">{e.company}</span>
                        <span className="text-[color:var(--bk-ink-soft)] bk-lnum"> · {e.year.replace(/\s*—\s*/, ' – ')}</span>
                    </p>
                    <p className="mt-1 text-[12.5px] leading-[1.42] text-justify hyphens-auto">{e.summary}</p>
                    <p className="mt-0.5 text-[11px] italic text-[color:var(--bk-ink-soft)]">
                        Tools: {e.stack.join(', ')}.
                    </p>
                </li>
            ))}
        </ol>
    </PaperPage>
);

// ─── VI. Distinctions ────────────────────────────────────────────────────────

export const AchievementsPage = () => {
    const played = useFacePlayed('achievements');
    return (
        <PaperPage face="achievements" head={false}>
            <ChapterOpener numeral="VI" title="Distinctions" subtitle="prizes, and what they were for" />
            <ol className="space-y-4">
                {achievements.map((a, i) => {
                    const [rank, prize] = a.title.split(/\s*—\s*/);
                    const numeral = /best/i.test(rank) ? 'I' : 'II';
                    return (
                        <motion.li
                            key={a.event}
                            className="grid grid-cols-[52px_1fr] gap-4 items-start"
                            initial={false}
                            animate={played ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: played ? 0.6 : 0, delay: played ? 0.4 + i * 0.18 : 0, ease: EASE }}
                        >
                            <Medal numeral={numeral} className="w-[52px]" />
                            <div className="pt-1">
                                <p className="text-[15px] font-medium leading-tight">
                                    {rank}
                                    {prize && (
                                        <span className="text-[color:var(--bk-rubric)] bk-lnum"> · {prize}</span>
                                    )}
                                </p>
                                <p className="text-[12.5px] italic text-[color:var(--bk-ink-soft)]">{a.event}</p>
                                <p className="mt-1 text-[12.5px] leading-snug">{a.desc}.</p>
                            </div>
                        </motion.li>
                    );
                })}
            </ol>
        </PaperPage>
    );
};

// ─── VII. Correspondence ─────────────────────────────────────────────────────

export const CorrespondencePage = () => {
    const played = useFacePlayed('correspondence');
    const elsewhere = [
        { label: 'LinkedIn', href: profile.linkedin },
        { label: 'GitHub', href: profile.github },
        { label: 'LeetCode', href: profile.leetcode },
        { label: 'Instagram', href: profile.instagram },
    ];
    return (
        <PaperPage face="correspondence" head={false}>
            <ChapterOpener numeral="VII" title="Correspondence" />
            <p className="text-[14px] italic">Dear reader,</p>
            <p className="mt-1.5 text-[13.5px] leading-[1.47] indent-5 text-justify hyphens-auto">
                if something in these pages sounds like a problem you have — a pipeline that ought to run
                itself, a system that should stop surprising you, a model that has to survive real data —
                write to me. I answer letters.
            </p>
            <dl className="mt-3 space-y-1 text-[12.5px]">
                <div className="flex gap-2">
                    <dt className="italic text-[color:var(--bk-ink-soft)] w-[74px] shrink-0">By post</dt>
                    <dd>
                        <a className="bk-link" href={`mailto:${profile.email}`}>
                            {profile.email}
                        </a>
                    </dd>
                </div>
                <div className="flex gap-2">
                    <dt className="italic text-[color:var(--bk-ink-soft)] w-[74px] shrink-0">By wire</dt>
                    <dd>
                        <a className="bk-link bk-lnum" href={`tel:${profile.phone}`}>
                            {profile.phoneDisplay}
                        </a>
                    </dd>
                </div>
                <div className="flex gap-2">
                    <dt className="italic text-[color:var(--bk-ink-soft)] w-[74px] shrink-0">Elsewhere</dt>
                    <dd className="space-x-2">
                        {elsewhere.map((e, i) => (
                            <span key={e.label}>
                                <a className="bk-link" href={e.href} target="_blank" rel="noopener noreferrer">
                                    {e.label}
                                </a>
                                {i < elsewhere.length - 1 && <span className="text-[color:var(--bk-ink-faint)]"> ·</span>}
                            </span>
                        ))}
                    </dd>
                </div>
            </dl>
            <p className="mt-4 text-[13.5px] italic">Yours,</p>
            <div className="relative h-[56px] w-[180px]">
                <motion.div
                    className="bk-script absolute left-2 top-0 text-[40px] leading-none text-[color:var(--bk-rubric)]"
                    initial={false}
                    animate={{ clipPath: played ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                    transition={{ duration: played ? 1.5 : 0, delay: played ? 0.7 : 0, ease: 'easeInOut' }}
                >
                    Yaseen
                </motion.div>
                <svg viewBox="0 0 180 20" className="absolute left-0 bottom-0 w-[180px]" aria-hidden="true">
                    <motion.path
                        d="M6 12 C 40 20, 80 2, 120 10 S 168 14, 176 4"
                        fill="none"
                        stroke="var(--bk-rubric)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        initial={false}
                        animate={{ pathLength: played ? 1 : 0 }}
                        transition={{ duration: played ? 0.9 : 0, delay: played ? 2.0 : 0, ease: 'easeOut' }}
                    />
                </svg>
            </div>
        </PaperPage>
    );
};

// ─── Colophon ────────────────────────────────────────────────────────────────

const BOUND_ON = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const ColophonPage = () => {
    const { restart, seen } = useBook();
    const played = useFacePlayed('colophon');
    // The cover and endpaper are not pages; everything with a folio is. Read
    // as the last page renders, which is the only moment it is asked for.
    const folios = FACES.filter((f) => f.folio).map((f) => f.id);
    const read = seen.count(folios);
    const total = folios.length;
    return (
        <PaperPage face="colophon" head={false} dogEar={false} className="flex flex-col items-center text-center">
            <p className="mt-6 text-[42px] italic font-medium leading-none">Finis</p>
            <Fleuron className="mt-3 w-16 text-[color:var(--bk-rubric)]" />

            <a
                href={`mailto:${profile.email}`}
                className="bk-seal mt-7 block w-[112px]"
                aria-label={`Write to ${profile.name}`}
            >
                <WaxSeal className="w-full" />
            </a>
            <p className="mt-1 text-[11.5px] italic text-[color:var(--bk-ink-soft)]">press the seal to write</p>

            <p className="mt-6 bk-caps text-[10px] text-[color:var(--bk-rubric)]">Colophon</p>
            <p className="mt-1.5 text-[11.5px] leading-[1.55] text-[color:var(--bk-ink-soft)] max-w-[300px]">
                This book was set in EB Garamond, with notes in the margins in Caveat. It was bound in CSS —
                ten leaves in a single preserve-3d context, turned by your scroll, and lit by a lamp that
                does not exist. Its robot is Tomás Laulhé&rsquo;s, from the three.js examples.
            </p>
            <motion.p
                className="bk-script mt-4 text-[19px] leading-[1.1] text-[color:var(--bk-rubric)] max-w-[280px]"
                style={{ rotate: -2 }}
                initial={false}
                animate={{ opacity: played ? 0.92 : 0 }}
                transition={{ duration: played ? 1 : 0, delay: played ? 1 : 0 }}
            >
                bound for you on {BOUND_ON} — {read === total ? 'and you read every page' : `you read ${read} of its ${total} pages`}.
            </motion.p>

            <div className="mt-auto flex items-center gap-4 text-[13px] italic">
                <button type="button" onClick={restart} className="bk-link">
                    Read it again ↺
                </button>
                <span className="text-[color:var(--bk-ink-faint)]">·</span>
                <Link to="/" className="bk-link">
                    Return to the portfolio
                </Link>
            </div>
        </PaperPage>
    );
};
