import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorMode = 'idle' | 'engulf' | 'hidden' | 'lens';

/** Fallback lens radius if a section forgets to declare one. */
const DEFAULT_LENS_RADIUS = 120;

/** Shape the cursor takes when it locks onto a control. */
interface EngulfBox {
    width: number;
    height: number;
    radius: string;
}

const ENGULF_SELECTOR = '[data-cursor-engulf], a, button';

/**
 * Merging only reads well at control scale. Anything larger keeps the plain
 * blob rather than becoming a full-width wash across the viewport.
 */
const MAX_MERGE_WIDTH = 420;
const MAX_MERGE_HEIGHT = 160;

/**
 * Pointer-following cursor.
 *
 * Position is driven by motion values rather than React state, so moving the
 * mouse does not re-render the component tree on every frame. It only mounts
 * for fine pointers (mouse/trackpad) — on touch devices the native cursor
 * behaviour is left alone.
 *
 * Modes:
 *  - idle   a small dot following the pointer
 *  - engulf locks onto the hovered control, taking its exact size and corner
 *           radius so it merges with the button rather than overlapping it
 *  - lens   a ring matching the spotlight radius of a dual-layer section
 *  - hidden rows that already answer hover with a full accent fill
 */
export const CustomCursor = () => {
    const [enabled, setEnabled] = useState(false);
    const [mode, setMode] = useState<CursorMode>('idle');
    const [lensRadius, setLensRadius] = useState(DEFAULT_LENS_RADIUS);
    const [engulfBox, setEngulfBox] = useState<EngulfBox | null>(null);

    /** The control the cursor is currently locked onto, if any. */
    const engulfTarget = useRef<HTMLElement | null>(null);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);

    // Free-following reproduces the original `tween / backOut / 0.12s` feel: a
    // short visible trail, damping ratio ~0.89 so it overshoots very slightly.
    // Locked onto a control it arrives crisply instead, with the same character
    // as the size spring below — when the two differ, the box finishes resizing
    // at a different moment than it finishes moving, which reads as lag.
    //
    // Deliberately NOT branched on prefers-reduced-motion. A cursor trailing by
    // ~120ms is not the kind of motion that setting is protecting against, and
    // branching on it flattened the cursor entirely on machines that report it.
    // The magnetic contact buttons and Lenis smooth scroll still honour it.
    const follow = engulfBox
        ? { stiffness: 900, damping: 45, mass: 0.35 }
        : { stiffness: 500, damping: 28, mass: 0.5 };

    const springX = useSpring(x, follow);
    const springY = useSpring(y, follow);

    // Only enable for fine pointers, and drop out if the user switches to a
    // touch device mid-session.
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

        const releaseTarget = () => {
            engulfTarget.current = null;
            setEngulfBox(null);
        };

        const updatePosition = (e: MouseEvent) => {
            const target = engulfTarget.current;

            // While locked onto a control, sit on its centre rather than the
            // pointer — that is what makes it read as merged. Recomputed per
            // move so it stays aligned if the page scrolls underneath.
            if (target?.isConnected) {
                const rect = target.getBoundingClientRect();
                x.set(rect.left + rect.width / 2);
                y.set(rect.top + rect.height / 2);
                return;
            }

            x.set(e.clientX);
            y.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Priority 1: hide (rows that already respond with an accent fill)
            if (target.closest('[data-cursor-hide]')) {
                releaseTarget();
                setMode('hidden');
                return;
            }

            // Priority 2: lens (a section with a spotlight reveal underneath)
            const lens = target.closest<HTMLElement>('[data-cursor-lens]');
            if (lens) {
                releaseTarget();
                const radius = Number(lens.dataset.cursorLens);
                setLensRadius(Number.isFinite(radius) && radius > 0 ? radius : DEFAULT_LENS_RADIUS);
                setMode('lens');
                return;
            }

            // Priority 3: engulf — take the control's own shape.
            const control = target.closest<HTMLElement>(ENGULF_SELECTOR);
            if (control) {
                const rect = control.getBoundingClientRect();
                const mergeable =
                    rect.width > 0 &&
                    rect.height > 0 &&
                    rect.width <= MAX_MERGE_WIDTH &&
                    rect.height <= MAX_MERGE_HEIGHT;

                if (mergeable) {
                    engulfTarget.current = control;
                    setEngulfBox({
                        width: rect.width,
                        height: rect.height,
                        // borderTopLeftRadius is always a single value; the shorthand
                        // can be four, which does not interpolate cleanly.
                        radius: getComputedStyle(control).borderTopLeftRadius || '9999px',
                    });
                    x.set(rect.left + rect.width / 2);
                    y.set(rect.top + rect.height / 2);
                } else {
                    releaseTarget();
                }
                setMode('engulf');
                return;
            }

            releaseTarget();
            setMode('idle');
        };

        const handleLeave = () => {
            releaseTarget();
            setMode('hidden');
        };

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
    const isMerged = mode === 'engulf' && engulfBox !== null;

    // Merged: a little past the control's own edge so it reads as a highlight
    // around it. Lens: match the reveal radius exactly. Otherwise a dot — or
    // the plain blob, for a control with no measurable box.
    const size = (extent: number) =>
        isLens ? lensRadius * 2 : isMerged ? extent + 12 : mode === 'engulf' ? 80 : 12;

    // A solid fill would bury the button's own label, so the merged state is a
    // translucent wash with a hard accent edge and the control stays readable.
    const skin = isLens
        ? 'border-2 border-cream/50 bg-transparent'
        : isMerged
            ? 'border-2 border-accent bg-accent/25'
            : 'bg-accent';

    return createPortal(
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999]"
            style={{ x: springX, y: springY }}
        >
            <motion.div
                className={`-translate-x-1/2 -translate-y-1/2 ${skin}`}
                animate={{
                    width: size(engulfBox?.width ?? 0),
                    height: size(engulfBox?.height ?? 0),
                    borderRadius: isMerged ? engulfBox.radius : '9999px',
                    opacity: mode === 'hidden' ? 0 : 1,
                }}
                initial={false}
                transition={{
                    default: { type: 'spring', stiffness: 900, damping: 45, mass: 0.35 },
                    // Springing opacity looks wrong; keep the fade a plain tween.
                    opacity: { type: 'tween', duration: 0.15 },
                }}
            />
        </motion.div>,
        document.body
    );
};
