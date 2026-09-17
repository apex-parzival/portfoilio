import { useEffect } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus inside `ref` while `active`, closes on Escape, and restores
 * focus to whatever was focused before opening.
 *
 * Without this, tabbing out of the open mobile menu lands on the page behind it
 * — invisible focus, which is worse than no focus.
 */
export const useFocusTrap = (
    ref: React.RefObject<HTMLElement | null>,
    active: boolean,
    onClose: () => void
) => {
    useEffect(() => {
        if (!active) return;

        const container = ref.current;
        if (!container) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusables = () =>
            Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (el) => el.offsetParent !== null || el === document.activeElement
            );

        focusables()[0]?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key !== 'Tab') return;

            const items = focusables();
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [ref, active, onClose]);
};
