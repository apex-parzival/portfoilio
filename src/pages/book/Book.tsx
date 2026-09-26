import './book.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { CustomCursor } from '../../components/ui/CustomCursor';
import { profile, siteUrl } from '../../data/profile';
import { BookContext, SeenFaces, type BookRuntime } from './context';
import {
    BASE_Z,
    BOARD_OVERHANG,
    CHAPTERS,
    LEAF_COUNT,
    LEAF_DZ,
    PAGE_H,
    PAGE_W,
    DWELL,
    TOTAL,
    TURN,
    VH_PER_UNIT,
    buildStops,
    cameraScale,
    cameraX,
    castFrom,
    clamp01,
    easeInOutCubic,
    faceMeta,
    facesAtStop,
    isRestingAt,
    leafT,
    nearestStop,
    stopForFace,
    turnedCount,
    type ChapterKey,
    type FaceId,
} from './timeline';
import { Leaf } from './Leaf';
import { Crew } from './Crew';
import { CoverFace } from './Cover';
import { Dust } from './Dust';
import { FoilDefs } from './primitives';
import { BookHeader, ChapterRail, ReadingBar } from './BookChrome';
import {
    AchievementsPage,
    AppendixPage,
    ColophonPage,
    ContentsPage,
    CopyrightPage,
    CorrespondencePage,
    EducationPage,
    EndpaperFace,
    ExperiencePage,
    PlatePage,
    SkillsPage,
    TitlePage,
    VoiceAiPage,
    VoiceBackendPage,
    WorkOpenerPage,
} from './content';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Layout {
    /** Phone layout: one page at a time, the camera pans between them. */
    single: boolean;
    /** Scale from design px (one page = PAGE_W × PAGE_H) to screen px. */
    fit: number;
    /** Room kept clear above and below the book for the header and reading bar. */
    padTop: number;
    padBottom: number;
}

const measure = (): Layout => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const single = vw < 860 || vw < vh * 1.05;
    // The header only has links in its corners, so the book may rise between them.
    const padTop = single ? 56 : 22;
    const padBottom = single ? 84 : 78;
    const availW = single ? vw - 20 : Math.min(vw - 150, 1800);
    const availH = vh - padTop - padBottom;
    const needW = single ? PAGE_W + BOARD_OVERHANG * 2 : (PAGE_W + BOARD_OVERHANG) * 2 + 8;
    // Headroom for perspective: layers nearest the camera project slightly larger.
    const needH = (PAGE_H + BOARD_OVERHANG * 2) * 1.035;
    const fit = Math.min(availW / needW, availH / needH, single ? 1.1 : 1.45);
    return { single, fit: Math.max(0.3, fit), padTop, padBottom };
};

const CAST_ON_BASE =
    'linear-gradient(90deg, rgba(25,14,4,0.62) 0%, rgba(25,14,4,0.24) 32%, transparent 72%)';

export const Book = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [layout, setLayout] = useState<Layout>(measure);
    const { single, fit, padTop, padBottom } = layout;

    useEffect(() => {
        const onResize = () =>
            setLayout((prev) => {
                const next = measure();
                return next.single === prev.single && Math.abs(next.fit - prev.fit) < 0.002 && next.padTop === prev.padTop
                    ? prev
                    : next;
            });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const stops = useMemo(() => buildStops(single), [single]);

    // ─── Scroll → timeline ────────────────────────────────────────────────
    const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
    // Soft and overdamped: the book trails the scroll slightly and settles
    // without ever overshooting, which is what reads as weight rather than lag.
    const smooth = useSpring(scrollYProgress, { stiffness: 72, damping: 26, mass: 0.9, restDelta: 0.00002 });
    const u = useTransform(smooth, (p) => clamp01(p) * TOTAL);

    // ─── Camera ───────────────────────────────────────────────────────────
    const camX = useTransform(u, (v) => `${cameraX(v, single)}%`);
    const camScale = useTransform(u, (v) => cameraScale(v));
    const openness = useTransform(u, (v) => leafT(0, v));
    /** The book pivots on its centre when closed and on its spine once open. */
    const pivot = useTransform(openness, (o) => `${50 - 50 * o}%`);

    // ─── Pointer tilt, foil light, lamp drift ─────────────────────────────
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const tiltYTarget = useTransform([px, openness], ([x, o]) => -(x as number) * 22 * (1 - 0.62 * (o as number)));
    const tiltXTarget = useTransform([py, openness], ([y, o]) => (y as number) * 16 * (1 - 0.62 * (o as number)));
    const tiltY = useSpring(tiltYTarget, { stiffness: 80, damping: 16, mass: 0.9 });
    const tiltX = useSpring(tiltXTarget, { stiffness: 80, damping: 16, mass: 0.9 });
    const shine = useTransform(tiltY, (r) => `${50 - r * 2.6}%`);
    const lampX = useTransform(px, (x) => x * 70);
    const lampY = useTransform(py, (y) => y * 44);
    const ribbonSway = useTransform(tiltY, (r) => r * 0.9);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            px.set(e.clientX / window.innerWidth - 0.5);
            py.set(e.clientY / window.innerHeight - 0.5);
        };
        const onLeave = () => {
            px.set(0);
            py.set(0);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        return () => {
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
        };
    }, [px, py]);

    // Phones: tilt with the device instead of a pointer, where the browser
    // allows it without a permission prompt.
    useEffect(() => {
        if (!single) return;
        const onOrient = (e: DeviceOrientationEvent) => {
            if (e.gamma == null || e.beta == null) return;
            px.set(Math.max(-0.5, Math.min(0.5, e.gamma / 60)));
            py.set(Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 80)));
        };
        window.addEventListener('deviceorientation', onOrient);
        return () => window.removeEventListener('deviceorientation', onOrient);
    }, [single, px, py]);

    // ─── The page block ───────────────────────────────────────────────────
    const turned = useTransform(u, turnedCount);
    const thickRight = useTransform(turned, (t) => BASE_Z + (LEAF_COUNT - t) * LEAF_DZ);
    const thickLeft = useTransform(turned, (t) => t * LEAF_DZ);
    const spineOpacity = useTransform(openness, (o) => 1 - o);
    const leftBlockOpacity = useTransform(openness, (o) => (o > 0.5 ? 1 : 0));
    const castOnBase = useTransform(u, (v) => castFrom(LEAF_COUNT - 1, v, 'right'));
    const shadowWidth = useTransform(openness, (o) => (PAGE_W + BOARD_OVERHANG) * (1 + o) + 60);
    const shadowLeft = useTransform(openness, (o) => -(PAGE_W + BOARD_OVERHANG) * o - 30);
    const readingProgress = useTransform(u, (v) => v / TOTAL);

    // ─── Where are we ─────────────────────────────────────────────────────
    const [stopIndex, setStopIndex] = useState(0);
    // Not state: pages subscribe to their own entry, so arriving at a spread
    // wakes those two pages rather than re-rendering the whole book mid-turn.
    // The cover is on screen before anything moves, so it starts out seen.
    const seenRef = useRef<SeenFaces | null>(null);
    seenRef.current ??= new SeenFaces(['cover']);
    const seen = seenRef.current;

    useMotionValueEvent(u, 'change', (v) => {
        const i = nearestStop(stops, v);
        setStopIndex((prev) => (prev === i ? prev : i));
        if (isRestingAt(v, single)) seen.add(facesAtStop(stops[i]));
    });

    const stop = stops[Math.min(stopIndex, stops.length - 1)];
    const activeFaces = useMemo(() => new Set(facesAtStop(stop)), [stop]);
    const activeChapters = useMemo(
        () => new Set<ChapterKey>([...activeFaces].map((f) => faceMeta(f).chapter)),
        [activeFaces]
    );

    // ─── Moving through the book ──────────────────────────────────────────
    const programmaticUntil = useRef(0);
    const targetStop = useRef(0);
    const dragging = useRef(false);
    const glide = useRef(0);

    const geometry = useCallback(() => {
        const el = trackRef.current;
        if (!el) return { top: 0, range: 1 };
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { top, range: Math.max(1, el.offsetHeight - window.innerHeight) };
    }, []);

    const uFromScroll = useCallback(() => {
        const { top, range } = geometry();
        return clamp01((window.scrollY - top) / range) * TOTAL;
    }, [geometry]);

    /** Cancels any glide in flight. */
    const stopGlide = useCallback(() => {
        if (glide.current) {
            cancelAnimationFrame(glide.current);
            glide.current = 0;
        }
    }, []);

    const scrollToU = useCallback(
        (target: number, behavior: ScrollBehavior = 'smooth') => {
            const { top, range } = geometry();
            const to = top + clamp01(target / TOTAL) * range;
            stopGlide();

            if (behavior === 'instant') {
                programmaticUntil.current = performance.now() + 150;
                window.scrollTo({ top: to, behavior: 'auto' });
                return;
            }

            const from = window.scrollY;
            const delta = to - from;
            if (Math.abs(delta) < 1) return;

            // The browser's own smooth scroll is brisk and its pace cannot be
            // set, which made every turn a snap. One step is one unhurried
            // sweep; asking for several at once only stretches it so far.
            const step = (range * (TURN + DWELL)) / TOTAL;
            const duration = Math.min(2900, Math.max(760, 1550 * Math.sqrt(Math.abs(delta) / step)));
            const started = performance.now();
            programmaticUntil.current = started + duration + 140;

            const frame = (now: number) => {
                const p = clamp01((now - started) / duration);
                window.scrollTo(0, from + delta * easeInOutCubic(p));
                glide.current = p < 1 ? requestAnimationFrame(frame) : 0;
            };
            glide.current = requestAnimationFrame(frame);
        },
        [geometry, stopGlide]
    );

    // A hand on the wheel always wins: a glide yields the moment you scroll.
    useEffect(() => {
        const yield_ = () => {
            stopGlide();
            programmaticUntil.current = 0;
        };
        window.addEventListener('wheel', yield_, { passive: true });
        window.addEventListener('touchstart', yield_, { passive: true });
        return () => {
            window.removeEventListener('wheel', yield_);
            window.removeEventListener('touchstart', yield_);
        };
    }, [stopGlide]);

    const goToStop = useCallback(
        (i: number, behavior?: ScrollBehavior) => {
            const index = Math.max(0, Math.min(stops.length - 1, i));
            targetStop.current = index;
            scrollToU(stops[index].u, behavior);
        },
        [stops, scrollToU]
    );

    /** Rapid presses stack up: while a move is in flight, step from its destination. */
    const baseStop = useCallback(
        () =>
            performance.now() < programmaticUntil.current
                ? targetStop.current
                : nearestStop(stops, uFromScroll()),
        [stops, uFromScroll]
    );

    const next = useCallback(() => goToStop(baseStop() + 1), [goToStop, baseStop]);
    const prev = useCallback(() => goToStop(baseStop() - 1), [goToStop, baseStop]);
    const goToFace = useCallback(
        (id: FaceId, behavior?: ScrollBehavior) => goToStop(stopForFace(stops, id), behavior),
        [stops, goToStop]
    );
    const restart = useCallback(() => goToStop(0), [goToStop]);

    // Never leave a page standing on its edge: when scrolling stops mid-turn
    // (or mid-pan on a phone), settle onto the nearest resting place.
    useEffect(() => {
        let timer = 0;
        const onScroll = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                if (dragging.current || performance.now() < programmaticUntil.current) return;
                const v = uFromScroll();
                if (v <= 0.001 || v >= TOTAL - 0.001) return;
                if (!isRestingAt(v, single)) goToStop(nearestStop(stops, v));
            }, 170);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('scroll', onScroll);
        };
    }, [single, stops, uFromScroll, goToStop]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
                e.preventDefault();
                next();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
                e.preventDefault();
                prev();
            } else if (e.key === 'Home') {
                e.preventDefault();
                goToStop(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                goToStop(stops.length - 1);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, prev, goToStop, stops.length]);

    // Deep links: /book#iv opens straight at chapter IV. A hash typed into the
    // address bar (or reached with back/forward) riffles there instead.
    const openedFromHash = useRef(false);
    useEffect(() => {
        const faceForHash = () => {
            const key = decodeURIComponent(window.location.hash.slice(1));
            if (key === '') return 'cover';
            return CHAPTERS.find((c) => c.key === key)?.face ?? (key === 'front' ? 'title' : undefined);
        };
        if (!openedFromHash.current) {
            openedFromHash.current = true;
            const face = faceForHash();
            if (face && face !== 'cover') requestAnimationFrame(() => goToFace(face, 'instant'));
        }
        const onHash = () => {
            const face = faceForHash();
            if (face) goToFace(face);
        };
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, [goToFace]);

    // …and the address bar follows along as you read.
    useEffect(() => {
        const first = [...activeFaces][0];
        if (!first) return;
        const chapter = faceMeta(first).chapter;
        const hash = chapter === 'cover' ? '' : `#${chapter}`;
        if (window.location.hash !== hash) {
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
        }
    }, [activeFaces]);

    useEffect(() => {
        const previous = document.title;
        document.title = `Selected Work, the book — ${profile.name}`;
        const canonical = document.querySelector('link[rel="canonical"]');
        const prevHref = canonical?.getAttribute('href') ?? null;
        canonical?.setAttribute('href', `${siteUrl}/book`);
        return () => {
            document.title = previous;
            if (canonical && prevHref) canonical.setAttribute('href', prevHref);
        };
    }, []);

    // ─── Grab a page and pull it across ───────────────────────────────────
    const drag = useRef<{ id: number; x0: number; y0: number; u0: number; active: boolean } | null>(null);

    const onPointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, u0: uFromScroll(), active: false };
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const dx = e.clientX - d.x0;
        const dy = e.clientY - d.y0;
        if (!d.active) {
            // Horizontal intent only — vertical movement is ordinary scrolling.
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            d.active = true;
            dragging.current = true;
            stageRef.current?.setPointerCapture(e.pointerId);
        }
        const pageOnScreen = PAGE_W * fit;
        scrollToU(d.u0 - (dx / pageOnScreen) * (single ? 1.15 : 1.7), 'instant');
    };

    const onPointerUp = (e: React.PointerEvent) => {
        const d = drag.current;
        drag.current = null;
        if (!d || d.id !== e.pointerId) return;

        if (!d.active) {
            // A plain click on the closed cover opens the book.
            const target = e.target as HTMLElement;
            const moved = Math.hypot(e.clientX - d.x0, e.clientY - d.y0);
            if (moved < 6 && !target.closest('a,button') && nearestStop(stops, d.u0) === 0) next();
            return;
        }

        dragging.current = false;
        const dx = e.clientX - d.x0;
        const from = nearestStop(stops, d.u0);
        if (Math.abs(dx) > PAGE_W * fit * 0.16) goToStop(dx < 0 ? from + 1 : from - 1);
        else goToStop(from);
    };

    // Deliberately free of anything that changes as you read: every page in
    // the book consumes this, so a new identity here re-renders all of them.
    const runtime = useMemo<BookRuntime>(
        () => ({ u, single, seen, goToFace, next, prev, restart }),
        [u, single, seen, goToFace, next, prev, restart]
    );

    /**
     * The pages themselves. Held still across renders: the leaf elements keep
     * their identity, so React skips the whole stack when the reading position
     * changes — otherwise every page in the book re-rendered mid-turn.
     */
    const leaves = useMemo(
        () => (
            <>
                <Leaf index={0} board deepFront front={<CoverFace />} back={<EndpaperFace />} />
                <Leaf index={1} front={<TitlePage />} back={<CopyrightPage />} />
                <Leaf index={2} front={<ContentsPage />} back={<VoiceBackendPage />} />
                <Leaf index={3} front={<VoiceAiPage />} back={<EducationPage />} />
                <Leaf index={4} front={<SkillsPage />} back={<WorkOpenerPage />} />
                <Leaf index={5} front={<PlatePage index={0} />} back={<PlatePage index={1} />} />
                <Leaf index={6} front={<PlatePage index={2} />} back={<PlatePage index={3} />} />
                <Leaf index={7} front={<PlatePage index={4} />} back={<PlatePage index={5} />} />
                <Leaf index={8} front={<AppendixPage />} back={<ExperiencePage />} />
                <Leaf index={9} front={<AchievementsPage />} back={<CorrespondencePage />} />
            </>
        ),
        []
    );

    const size = { width: PAGE_W, height: PAGE_H };
    const stageFaces = facesAtStop(stop);

    return (
        <BookContext.Provider value={runtime}>
            <div className="bk-root bg-[#08090c] text-foreground" data-motion="always">
                <CustomCursor />
                <FoilDefs />
                <BookHeader onContents={() => goToFace('contents')} />

                <div ref={trackRef} className="relative" style={{ height: `${TOTAL * VH_PER_UNIT + 100}vh` }}>
                    <div
                        ref={stageRef}
                        className="sticky top-0 h-[100svh] overflow-hidden select-none"
                        style={{ touchAction: 'pan-y' }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                    >
                        {/* The lamp: a warm pool of light that drifts toward the pointer. */}
                        <motion.div
                            className="absolute inset-[-10%] bk-lamp pointer-events-none"
                            style={{ x: lampX, y: lampY }}
                            aria-hidden="true"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)',
                            }}
                            aria-hidden="true"
                        />
                        <Dust />

                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ paddingTop: padTop, paddingBottom: padBottom }}
                        >
                            <div style={{ ...size, transform: `scale(${fit})` }}>
                                <div style={{ ...size, perspective: 2400 }}>
                                    <motion.div style={{ ...size, x: camX, scale: camScale, transformStyle: 'preserve-3d' }}>
                                        {/* Shadow on the desk: flat, and does not tilt with the book. */}
                                        <motion.div
                                            className="absolute pointer-events-none rounded-[50%]"
                                            style={{
                                                left: shadowLeft,
                                                width: shadowWidth,
                                                top: PAGE_H * 0.14,
                                                height: PAGE_H * 0.92,
                                                z: -40,
                                                y: 34,
                                                background: 'radial-gradient(closest-side, rgba(0,0,0,0.8), rgba(0,0,0,0.35) 60%, transparent)',
                                                filter: 'blur(26px)',
                                            }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 1.2, delay: 0.9 }}
                                            aria-hidden="true"
                                        />

                                        <div className="bk-float" style={{ ...size, transformStyle: 'preserve-3d' }}>
                                            <motion.div
                                                style={{ ...size, transformStyle: 'preserve-3d' }}
                                                initial={{ opacity: 0, y: -90, rotateX: 48 }}
                                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                transition={{ duration: 1.7, ease: EASE, delay: 0.25 }}
                                            >
                                                <motion.div
                                                    className="relative"
                                                    style={
                                                        {
                                                            ...size,
                                                            rotateX: tiltX,
                                                            rotateY: tiltY,
                                                            originX: pivot,
                                                            transformStyle: 'preserve-3d',
                                                            '--shine': shine,
                                                        } as unknown as React.CSSProperties
                                                    }
                                                >
                                                    {/* Back board. */}
                                                    <div
                                                        className="absolute bk-cloth rounded-[3px_7px_7px_3px]"
                                                        style={{
                                                            left: 0,
                                                            top: -BOARD_OVERHANG,
                                                            width: PAGE_W + BOARD_OVERHANG,
                                                            height: PAGE_H + BOARD_OVERHANG * 2,
                                                            boxShadow: '0 30px 60px -24px rgba(0,0,0,0.85)',
                                                        }}
                                                        aria-hidden="true"
                                                    />

                                                    {/* Ribbon bookmark, leaving the pages at the foot. */}
                                                    <motion.div
                                                        className="absolute pointer-events-none"
                                                        style={{
                                                            left: PAGE_W - 74,
                                                            top: PAGE_H - 14,
                                                            width: 13,
                                                            height: 84,
                                                            z: 0.4,
                                                            rotate: ribbonSway,
                                                            originY: 0,
                                                        }}
                                                        aria-hidden="true"
                                                    >
                                                        <div className="bk-ribbon w-full h-full" />
                                                    </motion.div>

                                                    {/* The page block, edge-on: it thins on the right as you read. */}
                                                    <motion.div
                                                        className="absolute bk-edge-fore"
                                                        style={{ left: PAGE_W, top: 0, height: PAGE_H, width: thickRight, originX: 0, rotateY: -90 }}
                                                        aria-hidden="true"
                                                    />
                                                    <motion.div
                                                        className="absolute bk-edge-top"
                                                        style={{ left: 0, top: 0, width: PAGE_W, height: thickRight, originY: 0, rotateX: 90 }}
                                                        aria-hidden="true"
                                                    />
                                                    <motion.div
                                                        className="absolute bk-edge-top"
                                                        style={{ left: 0, top: PAGE_H, width: PAGE_W, height: thickRight, originY: 0, rotateX: 90 }}
                                                        aria-hidden="true"
                                                    />
                                                    <motion.div
                                                        className="absolute bk-spine-face"
                                                        style={{ left: 0, top: -BOARD_OVERHANG, height: PAGE_H + BOARD_OVERHANG * 2, width: thickRight, originX: 0, rotateY: -90, opacity: spineOpacity }}
                                                        aria-hidden="true"
                                                    />
                                                    <motion.div
                                                        className="absolute bk-edge-fore"
                                                        style={{ left: -PAGE_W, top: 0, height: PAGE_H, width: thickLeft, originX: 0, rotateY: -90, opacity: leftBlockOpacity }}
                                                        aria-hidden="true"
                                                    />
                                                    <motion.div
                                                        className="absolute bk-edge-top"
                                                        style={{ left: -PAGE_W, top: 0, width: PAGE_W, height: thickLeft, originY: 0, rotateX: 90, opacity: leftBlockOpacity }}
                                                        aria-hidden="true"
                                                    />
                                                    <motion.div
                                                        className="absolute bk-edge-top"
                                                        style={{ left: -PAGE_W, top: PAGE_H, width: PAGE_W, height: thickLeft, originY: 0, rotateX: 90, opacity: leftBlockOpacity }}
                                                        aria-hidden="true"
                                                    />

                                                    {leaves}

                                                    {/* The two who turn the pages, in front of the whole block. */}
                                                    <Crew />

                                                    {/* Printed on the back board: the last page. */}
                                                    <div className="absolute inset-0" style={{ transform: `translateZ(${BASE_Z}px)` }}>
                                                        <ColophonPage />
                                                        <motion.div
                                                            className="absolute inset-0 pointer-events-none"
                                                            style={{ background: CAST_ON_BASE, opacity: castOnBase }}
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {!single && <ChapterRail active={activeChapters} onGo={(f) => goToFace(f)} />}
                <ReadingBar
                    faces={stageFaces}
                    progress={readingProgress}
                    canPrev={stopIndex > 0}
                    canNext={stopIndex < stops.length - 1}
                    onPrev={prev}
                    onNext={next}
                    single={single}
                />

                <section className="relative px-6 md:px-12 lg:px-20 py-24 border-t border-white/10 bg-[#08090c]">
                    <h2 className="bk-serif italic text-[26px] text-cream mb-5">How this book is bound</h2>
                    <div className="bk-serif grid gap-5 md:grid-cols-3 text-[16px] leading-relaxed text-muted max-w-5xl">
                        <p>
                            No 3D engine. Ten leaves sit in one CSS{' '}
                            <code className="text-cream font-mono text-[13px]">preserve-3d</code> context, each hinged on{' '}
                            <code className="text-cream font-mono text-[13px]">transform-origin: left</code>. Real
                            depth separates the foil from the cloth, and the page block thickens and thins as you read.
                        </p>
                        <p>
                            Every motion — which leaf is turning, the camera, the light on the page — is a pure
                            function of one number: how far you have scrolled. Stop mid-turn and the page settles
                            itself; drag a page and it follows your hand.
                        </p>
                        <p>
                            The paper grain, cloth weave, gilt lattice and page edges are all generated in CSS; the
                            dust is a canvas. The only downloads are two typefaces.
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="inline-block mt-10 text-xs tracking-[0.25em] uppercase text-cream/70 hover:text-accent transition-colors duration-300"
                    >
                        &larr; Back to the portfolio
                    </Link>
                </section>

                <Analytics />
            </div>
        </BookContext.Provider>
    );
};

export default Book;
