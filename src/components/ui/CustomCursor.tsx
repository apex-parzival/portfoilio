import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorMode = 'idle' | 'engulf' | 'hidden' | 'lens';

/** Fallback lens radius if a section forgets to declare one. */
const DEFAULT_LENS_RADIUS = 120;

/**
 * Pointer-following cursor.
 *
 * Position is driven by motion values rather than React state, so moving the
 * mouse does not re-render the component tree on every frame. It only mounts
 * for fine pointers (mouse/trackpad) — on touch devices the native cursor
 * behaviour is left alone.
 */
export const CustomCursor = () => {
    const [enabled, setEnabled] = useState(false);
    const [mode, setMode] = useState<CursorMode>('idle');
    const [lensRadius, setLensRadius] = useState(DEFAULT_LENS_RADIUS);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);

    // Tuned to reproduce the original `tween / backOut / 0.12s` follow: a short
    // visible trail with a slight overshoot. Damping ratio here is ~0.89, i.e.
    // just underdamped — the earlier 1400/70/0.3 spring was overdamped (~1.7)
    // and felt rigid by comparison.
    //
    // Deliberately NOT branched on prefers-reduced-motion. A cursor trailing by
    // ~120ms is not the kind of motion that setting is protecting against, and
    // branching on it flattened the cursor entirely on machines that report it.
    // The magnetic contact buttons and Lenis smooth scroll still honour it.
    const springX = useSpring(x, { stiffness: 500, damping: 28, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 500, damping: 28, mass: 0.5 });

    // Only enable for fine pointers, and drop out if the user plugs in / switches
    // to a touch device mid-session.
    useEffect(() => {
        const query = window.matchMedia('(pointer: fine)');
        const sync = () => setEnabled(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    // Let CSS know whether to hide the native cursor.
    useEffect(() => {
        document.documentElement.classList.toggle('custom-cursor-active', enabled);
        return () => document.documentElement.classList.remove('custom-cursor-active');
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        const updatePosition = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Priority 1: hide cursor (rows and links that already respond on hover)
            if (target.closest('[data-cursor-hide]')) {
                setMode('hidden');
                return;
            }

            // Priority 2: lens — a section with a spotlight reveal underneath.
            const lens = target.closest<HTMLElement>('[data-cursor-lens]');
            if (lens) {
                const radius = Number(lens.dataset.cursorLens);
                setLensRadius(Number.isFinite(radius) && radius > 0 ? radius : DEFAULT_LENS_RADIUS);
                setMode('lens');
                return;
            }

            // Priority 3: engulf (cards, buttons, links, interactive)
            if (
                target.closest('[data-cursor-engulf]') ||
                target.closest('a') ||
                target.closest('button')
            ) {
                setMode('engulf');
                return;
            }

            setMode('idle');
        };

        const handleLeave = () => setMode('hidden');

        window.addEventListener('mousemove', updatePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseleave', handleLeave);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleLeave);
        };
    }, [enabled, x, y]);

    if (!enabled) return null;

    const isLens = mode === 'lens';
    // Match the reveal radius exactly, so the ring outlines what is uncovered.
    const size = isLens ? lensRadius * 2 : mode === 'engulf' ? 80 : 12;

    return createPortal(
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999]"
            style={{ x: springX, y: springY }}
        >
            <motion.div
                className={`rounded-full -translate-x-1/2 -translate-y-1/2 ${isLens ? 'border-2 border-cream/50 bg-transparent' : 'bg-accent'
                    }`}
                animate={{
                    width: size,
                    height: size,
                    opacity: mode === 'hidden' ? 0 : 1,
                }}
                initial={false}
                transition={{ type: 'tween', ease: 'backOut', duration: mode === 'idle' ? 0.12 : 0.25 }}
            />
        </motion.div>,
        document.body
    );
};
