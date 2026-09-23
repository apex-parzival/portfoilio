import { Link } from 'react-router-dom';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { CHAPTERS, chapterOf, faceMeta, type ChapterKey, type FaceId } from './timeline';

export const BookHeader = ({ onContents }: { onContents: () => void }) => (
    <header className="fixed top-0 inset-x-0 z-40 px-5 md:px-8 py-4 flex items-center justify-between pointer-events-none">
        <Link
            to="/"
            className="pointer-events-auto text-[11px] tracking-[0.25em] uppercase text-cream/70 hover:text-accent transition-colors duration-300"
        >
            &larr; Portfolio
        </Link>
        <button
            type="button"
            onClick={onContents}
            className="pointer-events-auto text-[11px] tracking-[0.25em] uppercase text-cream/70 hover:text-accent transition-colors duration-300"
        >
            Contents
        </button>
    </header>
);

/**
 * Thumb-index ribbons down the right edge — one per chapter, like the cut
 * tabs in a dictionary. The ones for pages currently open stand proud.
 */
export const ChapterRail = ({
    active,
    onGo,
}: {
    active: ReadonlySet<ChapterKey>;
    onGo: (face: FaceId) => void;
}) => (
    <nav
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-1.5 pointer-events-none"
        aria-label="Chapters"
    >
        {CHAPTERS.map((c) => {
            const on = active.has(c.key);
            return (
                <button
                    key={c.key}
                    type="button"
                    onClick={() => onGo(c.face)}
                    className="group pointer-events-auto flex items-center justify-end"
                    aria-current={on ? 'true' : undefined}
                    aria-label={`${c.numeral ? `Chapter ${c.numeral}: ` : ''}${c.title}`}
                >
                    <span className="bk-serif italic text-[13px] text-cream/0 group-hover:text-cream/80 mr-3 transition-colors duration-300 whitespace-nowrap">
                        {c.title}
                    </span>
                    <span
                        className={`bk-serif flex items-center justify-center h-8 rounded-l-md text-[12px] transition-all duration-300 ${on
                            ? 'w-14 bg-accent text-[#0a0a0a] font-semibold'
                            : 'w-10 bg-white/[0.06] text-cream/60 group-hover:w-12 group-hover:bg-white/10 group-hover:text-cream'
                            }`}
                    >
                        {c.numeral || (c.key === 'cover' ? '◆' : c.key === 'contents' ? '≡' : '∎')}
                    </span>
                </button>
            );
        })}
    </nav>
);

export const ReadingBar = ({
    faces,
    progress,
    canPrev,
    canNext,
    onPrev,
    onNext,
    single,
}: {
    faces: FaceId[];
    progress: MotionValue<number>;
    canPrev: boolean;
    canNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    single: boolean;
}) => {
    const closed = faces.length === 1 && faces[0] === 'cover';
    const metas = faces.map(faceMeta);
    const chapters = [...new Set(metas.map((m) => m.chapter))].map(chapterOf);
    const label = chapters.map((c) => (c.numeral ? `${c.numeral} · ${c.title}` : c.title)).join('  /  ');
    const folios = metas.map((m) => m.folio).filter(Boolean);
    const pages = folios.length === 2 ? `pp. ${folios[0]}–${folios[1]}` : folios.length === 1 ? `p. ${folios[0]}` : '';
    const width = useTransform(progress, (p) => `${p * 100}%`);

    return (
        <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto relative flex items-center gap-1 rounded-full border border-white/10 bg-[#0b0c10]/85 backdrop-blur-md p-1 max-w-full overflow-hidden">
                <motion.span
                    className="absolute left-0 bottom-0 h-[2px] bg-accent/80"
                    style={{ width }}
                    aria-hidden="true"
                />
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={!canPrev}
                    className="w-9 h-9 rounded-full text-cream/80 hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                    aria-label="Previous page"
                >
                    ‹
                </button>
                {closed ? (
                    <div className="px-3 min-w-0 flex items-center gap-2.5">
                        <span className="bk-hint-bob text-accent text-[15px] leading-none" aria-hidden="true">
                            ↓
                        </span>
                        <span className="text-left">
                            <span className="bk-serif block text-[14px] text-cream/90">Scroll to open</span>
                            <span className="bk-serif italic block text-[11px] text-cream/55 -mt-0.5">
                                {single ? 'or swipe the cover' : 'or press → · or drag a page'}
                            </span>
                        </span>
                    </div>
                ) : (
                    <div className="px-3 min-w-0 text-center" aria-live="polite">
                        <span className="bk-serif block text-[14px] text-cream/90 truncate max-w-[52vw] md:max-w-[420px]">
                            {label}
                        </span>
                        {pages && <span className="bk-serif italic block text-[11px] text-cream/50 -mt-0.5">{pages}</span>}
                    </div>
                )}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canNext}
                    className="w-9 h-9 rounded-full text-cream/80 hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent transition-colors"
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>
        </div>
    );
};
