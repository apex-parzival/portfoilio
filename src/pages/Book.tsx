import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { CustomCursor } from '../components/ui/CustomCursor';
import { profile, siteUrl } from '../data/profile';

/**
 * A scroll-driven, cursor-parallax book.
 *
 * Built from CSS 3D transforms rather than a 3D runtime: the scene is a handful
 * of planes in a `preserve-3d` context, so the browser's own perspective does
 * the parallax for free. That keeps it at zero additional bundle weight — a
 * Spline or Three.js scene would have cost more than the entire rest of this
 * site put together.
 *
 * Depth is expressed as `translateZ` on each layer, so tilting the book
 * separates the foil title from the ornament from the cover board exactly the
 * way real depth would.
 */

const TITLE = 'SELECTED';
const TITLE_2 = 'WORK';

/** Corner filigree. Drawn rather than imported so it inherits currentColor. */
const Filigree = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
        <path
            d="M4 4h44M4 4v44"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
        />
        <path
            d="M12 12h22M12 12v22"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.55"
        />
        <path
            d="M4 62c22 0 34-12 34-34"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.4"
        />
        <path
            d="M20 46c0-14 8-22 22-26"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.3"
        />
        <circle cx="46" cy="46" r="2.5" fill="currentColor" opacity="0.6" />
    </svg>
);

export const Book = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ['start start', 'end end'],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    // ─── Scroll choreography ───
    // 0.00–0.12  closed, settling
    // 0.12–0.62  cover swings open
    // 0.62–1.00  camera pushes in on the spread
    const coverRotate = useTransform(progress, [0.12, 0.62], [0, -168], {
        clamp: true,
    });
    // The open spread is twice the book's width and sits half a width to the
    // left, so shifting right by exactly half the element width re-centres it.
    const sceneScale = useTransform(progress, [0, 0.62, 1], [0.92, 1, 1.06]);
    const sceneShift = useTransform(progress, [0.12, 0.62], ['0%', '50%']);
    const spreadOpacity = useTransform(progress, [0.45, 0.68], [0, 1]);
    const hintOpacity = useTransform(progress, [0, 0.1], [1, 0]);

    // Which face of the cover is showing. Swapping on opacity at the halfway
    // point avoids backface-visibility, which is unreliable once the faces have
    // their own preserve-3d children.
    const frontFace = useTransform(coverRotate, (r) => (r > -90 ? 1 : 0));
    const innerFace = useTransform(coverRotate, (r) => (r > -90 ? 0 : 1));

    // ─── Cursor parallax ───
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const tilt = { stiffness: 140, damping: 22, mass: 0.6 };
    const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [16, -16]), tilt);
    const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [-12, 12]), tilt);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            pointerX.set(e.clientX / window.innerWidth - 0.5);
            pointerY.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [pointerX, pointerY]);

    useEffect(() => {
        const previous = document.title;
        document.title = `The Book — ${profile.name}`;
        const canonical = document.querySelector('link[rel="canonical"]');
        const prevHref = canonical?.getAttribute('href') ?? null;
        canonical?.setAttribute('href', `${siteUrl}/book`);
        return () => {
            document.title = previous;
            if (canonical && prevHref) canonical.setAttribute('href', prevHref);
        };
    }, []);

    return (
        <div className="bg-background text-foreground">
            <CustomCursor />

            <header className="fixed top-0 left-0 right-0 z-40 px-8 md:px-12 py-6 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xs tracking-[0.25em] uppercase text-cream/70 hover:text-accent transition-colors duration-300"
                    data-cursor-hide
                >
                    &larr; Portfolio
                </Link>
                <span className="text-[10px] tracking-[0.3em] uppercase text-faint">
                    An experiment
                </span>
            </header>

            {/* The tall track the scroll choreography is mapped onto. */}
            <div ref={scrollRef} className="relative h-[320vh]">
                <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
                    {/* Warm pool of light behind the book. */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(60% 50% at 50% 45%, rgba(255,77,0,0.13), transparent 70%)',
                        }}
                        aria-hidden="true"
                    />

                    <motion.div
                        className="relative"
                        style={{
                            perspective: 2200,
                            scale: sceneScale,
                            x: sceneShift,
                        }}
                    >
                        <motion.div
                            className="relative book-size"
                            style={{
                                transformStyle: 'preserve-3d',
                                rotateX: reduceMotion ? 0 : tiltX,
                                rotateY: reduceMotion ? 0 : tiltY,
                            }}
                        >
                            {/* ─── The spread underneath ─── */}
                            <div className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden book-page">
                                <motion.div
                                    className="h-full w-full p-8 md:p-10 flex flex-col justify-center"
                                    style={{ opacity: spreadOpacity }}
                                >
                                    <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-5">
                                        Chapter one
                                    </p>
                                    <h2 className="text-xl md:text-2xl font-bold text-cream leading-snug mb-5">
                                        Systems that survive
                                        <br />
                                        contact with reality
                                    </h2>
                                    <p className="text-[13px] md:text-sm leading-relaxed text-muted mb-7">
                                        Twenty-one projects — agentic pipelines, computer vision,
                                        healthcare interoperability, reverse auctions — written up
                                        properly, with the diagrams and the decisions that made
                                        them work.
                                    </p>
                                    <Link
                                        to="/#projects"
                                        className="self-start px-5 py-2.5 rounded-full border border-accent/60 text-accent text-[11px] font-bold tracking-widest uppercase hover:bg-accent hover:text-[#0a0a0a] transition-colors duration-300"
                                    >
                                        Read it &rarr;
                                    </Link>
                                </motion.div>
                            </div>

                            {/* ─── The hinged cover ─── */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: 'left center',
                                    rotateY: coverRotate,
                                    // Coplanar surfaces z-fight in a preserve-3d
                                    // context; lift the cover clear of the page.
                                    translateZ: 3,
                                }}
                            >
                                {/* Outside of the cover */}
                                <motion.div
                                    className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden book-cover"
                                    style={{ transformStyle: 'preserve-3d', opacity: frontFace }}
                                >
                                    <div className="book-linen absolute inset-0" aria-hidden="true" />
                                    <div className="book-spine absolute inset-y-0 left-0" aria-hidden="true" />

                                    <div
                                        className="absolute inset-0 text-accent/70"
                                        style={{ transform: 'translateZ(14px)' }}
                                        aria-hidden="true"
                                    >
                                        <Filigree className="absolute top-4 left-5 w-14 h-14" />
                                        <Filigree className="absolute top-4 right-5 w-14 h-14 scale-x-[-1]" />
                                        <Filigree className="absolute bottom-4 left-5 w-14 h-14 scale-y-[-1]" />
                                        <Filigree className="absolute bottom-4 right-5 w-14 h-14 scale-[-1]" />
                                    </div>

                                    <div
                                        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
                                        style={{ transform: 'translateZ(34px)' }}
                                    >
                                        <span className="text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-cream/50 mb-6">
                                            {profile.name}
                                        </span>
                                        <h1 className="book-foil text-[clamp(1.6rem,3.4vw,2.6rem)] font-black leading-[0.95] tracking-[-0.02em]">
                                            {TITLE}
                                            <br />
                                            {TITLE_2}
                                        </h1>
                                        <span className="mt-6 h-px w-12 bg-accent/60" aria-hidden="true" />
                                        <span className="mt-5 text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-cream/40">
                                            Backend &amp; AI/ML
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Inside of the cover, seen once it swings past 90° */}
                                <motion.div
                                    className="absolute inset-0 rounded-l-lg overflow-hidden book-endpaper"
                                    style={{
                                        transform: 'rotateY(180deg)',
                                        opacity: innerFace,
                                    }}
                                >
                                    <div className="h-full w-full flex flex-col items-center justify-center px-8 text-center">
                                        <p className="text-[11px] leading-relaxed text-cream/45 italic max-w-[22ch]">
                                            “I’d rather the infrastructure be boring and the product
                                            be interesting.”
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        style={{ opacity: hintOpacity }}
                    >
                        <span className="text-[10px] tracking-[0.3em] uppercase text-faint">
                            Scroll to open
                        </span>
                        <span className="h-8 w-px bg-gradient-to-b from-accent to-transparent" />
                    </motion.div>
                </div>
            </div>

            <section className="px-8 md:px-12 lg:px-20 py-24 border-t border-white/10">
                <h2 className="text-[10px] tracking-[0.35em] uppercase text-accent mb-5">
                    How this is built
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-muted max-w-2xl">
                    No 3D engine. The book is a few planes in a CSS{' '}
                    <code className="text-cream font-mono text-[13px]">preserve-3d</code> context,
                    so the browser's own perspective does the parallax. Each layer carries a{' '}
                    <code className="text-cream font-mono text-[13px]">translateZ</code> depth, the
                    cover is hinged on{' '}
                    <code className="text-cream font-mono text-[13px]">transform-origin: left</code>
                    , and scroll position drives its rotation. Total added weight: zero bytes of new
                    dependencies.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-8 text-xs tracking-[0.25em] uppercase text-cream/70 hover:text-accent transition-colors duration-300"
                >
                    &larr; Back to the portfolio
                </Link>
            </section>

            <Analytics />
        </div>
    );
};

export default Book;
