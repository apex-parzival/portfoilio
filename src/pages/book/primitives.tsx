import { useEffect, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import type { Diagram, NodeKind } from '../../data/caseStudies';
import { useBook } from './context';
import { chapterOf, faceMeta, type FaceId } from './timeline';

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Page shell ──────────────────────────────────────────────────────────────

interface PaperPageProps {
    face: FaceId;
    children: ReactNode;
    /** Chapter openers carry no running head. */
    head?: boolean;
    /** The last page has nowhere further to turn. */
    dogEar?: boolean;
    className?: string;
}

/**
 * One printed page: paper stock, gutter shadow on the binding side, running
 * head, folio, and a dog-eared outer corner that turns the page when pressed.
 * Rectos are right-hand pages (a leaf's front); versos are left-hand (its back).
 */
export const PaperPage = ({ face, children, head = true, dogEar = true, className = '' }: PaperPageProps) => {
    const { next, prev } = useBook();
    const meta = faceMeta(face);
    const recto = meta.side === 'front';
    const chapter = chapterOf(meta.chapter);

    return (
        <div
            className={`bk-paper bk-serif absolute inset-0 overflow-hidden ${recto ? 'bk-recto' : 'bk-verso'}`}
        >
            {head && (
                <div
                    className={`absolute top-[26px] ${recto ? 'right-[42px] left-[50px] text-right' : 'left-[42px] right-[50px]'
                        } bk-caps text-[9.5px] text-[color:var(--bk-ink-faint)]`}
                    aria-hidden="true"
                >
                    {recto ? (
                        <>
                            {chapter.numeral && <span className="text-[color:var(--bk-rubric)]">{chapter.numeral} · </span>}
                            {chapter.title}
                        </>
                    ) : (
                        'Selected Work'
                    )}
                </div>
            )}

            <div
                className={`absolute top-[52px] bottom-[52px] ${recto ? 'left-[50px] right-[42px]' : 'left-[42px] right-[50px]'
                    } ${className}`}
            >
                {children}
            </div>

            {meta.folio && (
                <div
                    className="absolute bottom-[22px] inset-x-0 text-center text-[12px] text-[color:var(--bk-ink-soft)] italic"
                    aria-label={`Page ${meta.folio}`}
                >
                    {meta.folio}
                </div>
            )}

            {dogEar && (
                <button
                    type="button"
                    className={`bk-dogear ${recto ? 'bk-dogear-next' : 'bk-dogear-prev'}`}
                    onClick={recto ? next : prev}
                    aria-label={recto ? 'Turn to the next page' : 'Turn back a page'}
                    data-cursor-hide
                >
                    <span className="bk-dogear-hint bk-serif">{recto ? 'turn' : 'back'}</span>
                </button>
            )}
        </div>
    );
};

// ─── Headings ────────────────────────────────────────────────────────────────

interface ChapterOpenerProps {
    numeral: string;
    title: string;
    subtitle?: string;
    compact?: boolean;
}

export const ChapterOpener = ({ numeral, title, subtitle, compact }: ChapterOpenerProps) =>
    compact ? (
        <header className="mb-4">
            <div className="flex items-baseline gap-3">
                <span className="text-[26px] font-medium leading-none text-[color:var(--bk-rubric)]">
                    {numeral}
                </span>
                <h2 className="text-[26px] leading-none font-medium tracking-[-0.01em]">{title}</h2>
            </div>
            {subtitle && (
                <p className="mt-1.5 text-[12.5px] italic text-[color:var(--bk-ink-soft)]">{subtitle}</p>
            )}
            <Rule className="mt-3" />
        </header>
    ) : (
        <header className="mb-6 pt-3 text-center">
            <div className="bk-caps text-[10px] text-[color:var(--bk-ink-faint)] mb-2">Chapter</div>
            <div className="text-[46px] leading-none font-medium text-[color:var(--bk-rubric)]">
                {numeral}
            </div>
            <h2 className="mt-2 text-[31px] leading-tight font-medium tracking-[-0.01em]">{title}</h2>
            {subtitle && (
                <p className="mt-1 text-[13px] italic text-[color:var(--bk-ink-soft)]">{subtitle}</p>
            )}
            <Fleuron className="mx-auto mt-3 w-16 text-[color:var(--bk-rubric)]" />
        </header>
    );

export const Rule = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
        <span className="h-px flex-1 bg-[color:var(--bk-ink)] opacity-40" />
        <span className="w-1 h-1 rotate-45 bg-[color:var(--bk-rubric)]" />
        <span className="h-px flex-1 bg-[color:var(--bk-ink)] opacity-40" />
    </div>
);

export const Fleuron = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 64 14" className={className} fill="none" aria-hidden="true">
        <path d="M2 7h18M44 7h18" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <path
            d="M32 7c-3-5-9-5-10-1-1 3 3 4 5 2M32 7c3-5 9-5 10-1 1 3-3 4-5 2M32 7c-3 5-9 5-10 1M32 7c3 5 9 5 10 1"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
        />
        <circle cx="32" cy="7" r="1.6" fill="currentColor" />
    </svg>
);

/** A dotted-leader line: label ……… value. */
export const LeaderRow = ({
    label,
    value,
    className = '',
}: {
    label: ReactNode;
    value: ReactNode;
    className?: string;
}) => (
    <div className={`flex items-end ${className}`}>
        <span className="min-w-0">{label}</span>
        <span className="bk-leader" aria-hidden="true" />
        <span className="shrink-0">{value}</span>
    </div>
);

// ─── Flourishes that play when a page first comes into view ─────────────────

/** Handwritten note in the margin, in rubric ink. */
export const Marginalia = ({
    children,
    className = '',
    rotate = -4,
    played,
    delay = 0.9,
}: {
    children: ReactNode;
    className?: string;
    rotate?: number;
    played: boolean;
    delay?: number;
}) => (
    <motion.div
        className={`bk-script absolute text-[17px] leading-[1.05] text-[color:var(--bk-rubric)] pointer-events-none ${className}`}
        style={{ rotate }}
        initial={false}
        animate={
            played
                ? { opacity: 0.92, clipPath: 'inset(-40% -20% -40% -20%)' }
                : { opacity: 0, clipPath: 'inset(-40% 120% -40% -20%)' }
        }
        transition={{ duration: played ? 1.1 : 0, delay: played ? delay : 0, ease: EASE }}
        aria-hidden="true"
    >
        {children}
    </motion.div>
);

const COUNTABLE = /^(~?)(\d+(?:\.\d+)?)([^\d]*)$/;

/**
 * Counts a metric up from zero the first time its page is seen. Values that
 * are not a plain number with a suffix ("48/48", "Parallel") just fade in.
 */
export const CountUp = ({ value, played }: { value: string; played: boolean }) => {
    const match = COUNTABLE.exec(value);
    const target = match ? parseFloat(match[2]) : 0;
    const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;
    // A page re-drawn mid-turn (see Leaf) mounts already played: start at the answer.
    const mv = useMotionValue(match && !played ? 0 : target);
    const text = useTransform(mv, (v) =>
        match ? `${match[1]}${v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${match[3]}` : value
    );

    useEffect(() => {
        if (!match || !played) return;
        const controls = animate(mv, target, { duration: 1.6, ease: EASE, delay: 0.5 });
        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [played]);

    if (!match) {
        return (
            <motion.span
                initial={false}
                animate={{ opacity: played ? 1 : 0 }}
                transition={{ duration: 0.8, delay: played ? 0.5 : 0 }}
            >
                {value}
            </motion.span>
        );
    }
    return <motion.span>{text}</motion.span>;
};

// ─── Figures ─────────────────────────────────────────────────────────────────

const dominantKind = (kinds: NodeKind[]): NodeKind => {
    for (const k of ['ai', 'output', 'external', 'store', 'input'] as NodeKind[]) {
        if (kinds.includes(k)) return k;
    }
    return 'process';
};

/** Small printed glyph per node role, matching the legend on the case-study pages. */
const KindGlyph = ({ kind }: { kind: NodeKind }) => {
    const common = { stroke: 'var(--bk-ink)', strokeWidth: 1.1, fill: 'var(--bk-paper)' };
    return (
        <svg viewBox="0 0 12 12" className="w-[11px] h-[11px] shrink-0" aria-hidden="true">
            {kind === 'ai' && <rect x="2.2" y="2.2" width="7.6" height="7.6" transform="rotate(45 6 6)" fill="var(--bk-rubric)" stroke="var(--bk-rubric)" />}
            {kind === 'output' && <rect x="2" y="2" width="8" height="8" fill="var(--bk-ink)" />}
            {kind === 'external' && <rect x="2.4" y="2.4" width="7.2" height="7.2" transform="rotate(45 6 6)" {...common} strokeDasharray="1.6 1.2" />}
            {kind === 'store' && <ellipse cx="6" cy="6" rx="4.2" ry="3.2" {...common} />}
            {kind === 'input' && <path d="M3 2.5 L9.5 6 L3 9.5 Z" {...common} />}
            {kind === 'process' && <circle cx="6" cy="6" r="3.6" {...common} />}
        </svg>
    );
};

/**
 * The case study's flow diagram, re-drawn as an engraved plate: stages run top
 * to bottom along an inked rule that draws itself in when the page is seen.
 */
export const InkFigure = ({
    diagram,
    number,
    played,
}: {
    diagram: Diagram;
    number: number;
    played: boolean;
}) => {
    const stages = diagram.columns.slice(0, 6);

    return (
        <figure className="relative">
            <div className="relative pl-[18px]">
                <motion.span
                    className="absolute left-[5px] top-[7px] bottom-[7px] w-px bg-[color:var(--bk-ink)] origin-top"
                    initial={false}
                    animate={{ scaleY: played ? 1 : 0 }}
                    transition={{ duration: played ? 1.3 : 0, delay: played ? 0.35 : 0, ease: EASE }}
                    aria-hidden="true"
                />
                <ol className="space-y-[5px]">
                    {stages.map((col, i) => {
                        const kind = dominantKind(col.nodes.map((n) => n.kind));
                        const labels = col.nodes.map((n) => n.label);
                        const joined = labels.slice(0, 2).join(' · ');
                        const detail = joined.length <= 46 ? joined : labels[0];
                        return (
                            <motion.li
                                key={col.title}
                                className="relative flex items-baseline gap-2 text-[12px] leading-[1.35]"
                                initial={false}
                                animate={played ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                                transition={{
                                    duration: played ? 0.5 : 0,
                                    delay: played ? 0.45 + i * 0.16 : 0,
                                    ease: EASE,
                                }}
                            >
                                <span className="absolute -left-[18px] top-[3px] bg-[color:var(--bk-paper)] p-[1px]">
                                    <KindGlyph kind={kind} />
                                </span>
                                <span className="bk-caps text-[9px] tracking-[0.1em] w-[92px] shrink-0 whitespace-nowrap text-[color:var(--bk-ink-soft)]">
                                    {col.title}
                                </span>
                                <span className="min-w-0">{detail}</span>
                            </motion.li>
                        );
                    })}
                </ol>
            </div>
            <figcaption className="mt-2 text-[11px] italic text-[color:var(--bk-ink-soft)]">
                <span className="not-italic bk-caps text-[9px] text-[color:var(--bk-rubric)]">Fig. {number}</span>{' '}
                {diagram.title}
            </figcaption>
        </figure>
    );
};

// ─── Ornaments ───────────────────────────────────────────────────────────────

/** Corner filigree for the cover, stamped in foil. */
export const Filigree = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 90 90" fill="none" className={className} style={style} aria-hidden="true">
        <path d="M3 3h40M3 3v40" stroke="url(#bk-foil-grad)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10 10h18M10 10v18" stroke="url(#bk-foil-grad)" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M3 52c20 0 31-11 31-31" stroke="url(#bk-foil-grad)" strokeWidth="0.9" />
        <path d="M17 38c0-12 7-19 19-22" stroke="url(#bk-foil-grad)" strokeWidth="0.8" />
        <path d="M24 24c4-3 9-3 12 1s-1 8-5 6" stroke="url(#bk-foil-grad)" strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="38" cy="38" r="2.4" fill="url(#bk-foil-grad)" />
        <circle cx="47" cy="3" r="1.3" fill="url(#bk-foil-grad)" />
        <circle cx="3" cy="47" r="1.3" fill="url(#bk-foil-grad)" />
    </svg>
);

/** Shared gradient so every foil-stamped SVG catches the same light. */
export const FoilDefs = () => (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
            <linearGradient id="bk-foil-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8a6a34" />
                <stop offset="0.35" stopColor="#f3dca0" />
                <stop offset="0.5" stopColor="#fff6dc" />
                <stop offset="0.65" stopColor="#d9ae62" />
                <stop offset="1" stopColor="#7a5a26" />
            </linearGradient>
            <radialGradient id="bk-wax" cx="0.38" cy="0.32" r="0.75">
                <stop offset="0" stopColor="#ff8a4c" />
                <stop offset="0.45" stopColor="#d4430f" />
                <stop offset="1" stopColor="#7a1c02" />
            </radialGradient>
            <radialGradient id="bk-gilt" cx="0.35" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#fff3cf" />
                <stop offset="0.45" stopColor="#d9b56c" />
                <stop offset="1" stopColor="#7d5c25" />
            </radialGradient>
            <path id="bk-device-ring" d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0" />
        </defs>
    </svg>
);

/** Printer's device: the monogram inside a ring of words. */
export const Device = ({ className = '', ink = 'var(--bk-ink)' }: { className?: string; ink?: string }) => (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <circle cx="60" cy="60" r="55" fill="none" stroke={ink} strokeWidth="1.2" />
        <circle cx="60" cy="60" r="33" fill="none" stroke={ink} strokeWidth="0.7" />
        <text
            fill={ink}
            fontSize="8.4"
            letterSpacing="2.6"
            fontFamily="'EB Garamond', Georgia, serif"
        >
            <textPath href="#bk-device-ring">SYSTEMS · MODELS · DECISIONS · SYSTEMS · MODELS ·</textPath>
        </text>
        <text
            x="60"
            y="69"
            textAnchor="middle"
            fill="var(--bk-rubric)"
            fontSize="27"
            fontStyle="italic"
            fontFamily="'EB Garamond', Georgia, serif"
        >
            YS
        </text>
    </svg>
);

/** The seal on the last page. Press it to write a letter. */
export const WaxSeal = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <path
            d="M60 6c9 0 12 5 19 7s13 1 17 8 1 12 4 19 9 10 8 19-7 11-9 18 1 13-5 19-12 3-19 7-9 10-18 10-11-6-18-9-14 0-19-6-3-12-7-18-10-9-10-18 7-12 8-19-3-12 3-18 12-3 18-7S51 6 60 6z"
            fill="url(#bk-wax)"
        />
        <circle cx="60" cy="61" r="33" fill="none" stroke="#7a1c02" strokeWidth="2.2" opacity="0.55" />
        <circle cx="60" cy="61" r="30" fill="none" stroke="#ff9a63" strokeWidth="0.8" opacity="0.5" />
        <text
            x="60"
            y="72"
            textAnchor="middle"
            fontSize="30"
            fontStyle="italic"
            fontFamily="'EB Garamond', Georgia, serif"
            fill="#6d1902"
            opacity="0.9"
        >
            YS
        </text>
        <text
            x="59"
            y="71"
            textAnchor="middle"
            fontSize="30"
            fontStyle="italic"
            fontFamily="'EB Garamond', Georgia, serif"
            fill="#ff9a63"
            opacity="0.45"
        >
            YS
        </text>
        <ellipse cx="42" cy="30" rx="13" ry="6" fill="#fff" opacity="0.18" transform="rotate(-30 42 30)" />
    </svg>
);

/** An engraved medallion on a ribbon, for the distinctions page. */
export const Medal = ({ numeral, className = '' }: { numeral: string; className?: string }) => (
    <svg viewBox="0 0 64 84" className={className} aria-hidden="true">
        <path d="M18 0h11l7 30-9 4z" fill="var(--bk-rubric)" />
        <path d="M46 0H35l-7 30 9 4z" fill="#8a2a06" />
        <circle cx="32" cy="56" r="25" fill="url(#bk-gilt)" stroke="#6e4f1c" strokeWidth="1" />
        <circle cx="32" cy="56" r="19.5" fill="none" stroke="#6e4f1c" strokeWidth="0.7" strokeDasharray="1.2 1.6" />
        <text
            x="32"
            y="63"
            textAnchor="middle"
            fontSize="18"
            fontWeight="600"
            fontFamily="'EB Garamond', Georgia, serif"
            fill="#4d360f"
        >
            {numeral}
        </text>
        <ellipse
            className="bk-medal-shine"
            cx="24"
            cy="46"
            rx="9"
            ry="4"
            fill="#fff"
            transform="rotate(-35 24 46)"
        />
    </svg>
);
