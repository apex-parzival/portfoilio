import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { SectionLabel } from '../ui/SectionLabel';
import { CHAPTERS } from '../../pages/book/timeline';
import { projects } from '../../data/projects';

// The model carries the book's typefaces and materials — fetch it only as the
// reader approaches, so the top of the page never pays for it.
const BookModel = lazy(() => import('../../pages/book/BookModel'));

const chapters = CHAPTERS.filter((c) => c.numeral);

/**
 * The homepage's door into /book: a miniature of the book that opens as it
 * scrolls into view. Under the pointer its loose leaves become a flip-book —
 * sweep across it and they turn after you.
 *
 * Its motion is springs on motion values — not CSS transitions or Framer
 * `animate` props — so it moves for everyone. The page-wide reduced-motion
 * settings zero those out, and on the author's own machine that left hover
 * effects looking broken.
 */
export const BookTeaser = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [near, setNear] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setNear(true);
                    io.disconnect();
                }
            },
            { rootMargin: '900px 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] });
    const hover = useMotionValue(0);
    // Scrolling in opens it (fully by the time it is centred); the pointer or focus opens it at once.
    const target = useTransform([scrollYProgress, hover], ([p, h]) =>
        Math.max(Math.min(1, Math.max(0, ((p as number) - 0.12) / 0.7)), h as number)
    );
    const open = useSpring(target, { stiffness: 55, damping: 15, mass: 1 });
    // Under the pointer the loose leaves become a flip-book (see BookModel).
    const thumbRaw = useMotionValue(0.5);
    const thumb = useSpring(thumbRaw, { stiffness: 160, damping: 22 });
    const riffle = useSpring(hover, { stiffness: 70, damping: 16 });

    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const tiltX = useSpring(useTransform(py, (y) => 8 + y * -14), { stiffness: 90, damping: 18 });
    const tiltY = useSpring(useTransform(px, (x) => -6 + x * 18), { stiffness: 90, damping: 18 });

    const onMove = (e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        px.set(x - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
        thumbRaw.set(x);
    };
    const settle = () => {
        hover.set(0);
        px.set(0);
        py.set(0);
    };

    return (
        <section ref={sectionRef} id="the-book" className="py-32 px-8 md:px-12 lg:px-20 overflow-hidden">
            <SectionLabel className="text-cream/80 mb-16">The Book</SectionLabel>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-14 lg:gap-10 items-center">
                <div>
                    <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] text-foreground">
                        The whole portfolio,
                        <br />
                        <span className="font-serif italic font-normal text-accent">bound.</span>
                    </h3>
                    <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted">
                        Everything on this page — both voices, the schooling, the toolkit, all {projects.length} projects
                        with their figures, the apprenticeships and the prizes — set in type and bound into a book you
                        turn by scrolling. Drag a page across, press an arrow key, or fold down a corner.
                    </p>

                    <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-white/10">
                        {chapters.map((c) => (
                            <li key={c.key} className="border-b border-white/10">
                                <Link
                                    to={`/book#${c.key}`}
                                    className="group flex items-baseline gap-4 py-3 text-sm"
                                    data-cursor-hide
                                >
                                    <span className="w-8 font-serif italic text-accent">{c.numeral}</span>
                                    <span className="text-foreground/80 group-hover:text-accent transition-colors duration-300">
                                        {c.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ol>

                    <Link
                        to="/book"
                        className="inline-flex items-center gap-3 mt-10 px-7 py-4 rounded-full border border-accent text-accent text-sm tracking-[0.2em] uppercase hover:bg-accent hover:text-[#0a0a0a] transition-colors duration-300"
                    >
                        Open the book <span aria-hidden="true">&#8599;</span>
                    </Link>
                </div>

                <Link
                    to="/book"
                    aria-label="Open the book"
                    className="block relative -mx-4 sm:mx-0 cursor-pointer"
                    onPointerEnter={() => hover.set(1)}
                    onPointerMove={onMove}
                    onPointerLeave={settle}
                    onFocus={() => {
                        // Keyboard focus has no pointer: park the thumb mid-book.
                        thumbRaw.set(0.5);
                        hover.set(1);
                    }}
                    onBlur={settle}
                    data-cursor-hide
                >
                    {/* Warm pool of lamp light behind the book. */}
                    <div
                        className="absolute inset-[-10%] pointer-events-none"
                        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,170,90,0.12), transparent 70%)' }}
                        aria-hidden="true"
                    />
                    {near ? (
                        <Suspense fallback={<div className="w-full aspect-[940/710]" />}>
                            <BookModel open={open} tiltX={tiltX} tiltY={tiltY} thumb={thumb} riffle={riffle} />
                        </Suspense>
                    ) : (
                        <div className="w-full aspect-[940/710]" />
                    )}
                </Link>
            </div>
        </section>
    );
};
