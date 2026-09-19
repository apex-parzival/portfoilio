import { useCallback, useEffect, useRef } from 'react';

/** Parked far enough off-section that the clip circle is nowhere near it. */
const PARKED = '-9999px';

/**
 * Drives the `--mx` / `--my` custom properties that position a section's
 * spotlight reveal.
 *
 * The clip circle is positioned in *section* coordinates, but the pointer
 * arrives in viewport coordinates, so the offset depends on where the section
 * currently sits. Recomputing only on mousemove meant that scrolling without
 * moving the mouse left the reveal behind while the cursor's lens ring —
 * which is position: fixed — carried on with the pointer. The two visibly
 * separated: a ring with nothing revealed inside it.
 *
 * So the last pointer position is remembered and reapplied on scroll and
 * resize as well.
 */
export const useSpotlight = (active: boolean) => {
    const ref = useRef<HTMLElement>(null);
    const pointer = useRef<{ x: number; y: number } | null>(null);

    const apply = useCallback(() => {
        const el = ref.current;
        const p = pointer.current;
        if (!el || !p) return;

        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${p.x - rect.left}px`);
        el.style.setProperty('--my', `${p.y - rect.top}px`);
    }, []);

    const park = useCallback(() => {
        pointer.current = null;
        const el = ref.current;
        if (!el) return;
        el.style.setProperty('--mx', PARKED);
        el.style.setProperty('--my', PARKED);
    }, []);

    const onMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!active) return;
            pointer.current = { x: e.clientX, y: e.clientY };
            apply();
        },
        [active, apply]
    );

    useEffect(() => {
        if (!active) {
            park();
            return;
        }

        const sync = () => apply();
        window.addEventListener('scroll', sync, { passive: true });
        window.addEventListener('resize', sync, { passive: true });
        return () => {
            window.removeEventListener('scroll', sync);
            window.removeEventListener('resize', sync);
        };
    }, [active, apply, park]);

    return { ref, onMouseMove, onMouseLeave: park };
};
