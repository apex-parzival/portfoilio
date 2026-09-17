import { useEffect, useState } from 'react';

/**
 * Tracks which of the given section ids is currently the dominant one in view.
 * Used to highlight the nav and to label the right-hand rail.
 */
export const useActiveSection = (ids: string[]) => {
    const [active, setActive] = useState<string>(ids[0] ?? '');

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const ratios = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
                });

                let best = '';
                let bestRatio = 0;
                ratios.forEach((ratio, id) => {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        best = id;
                    }
                });

                if (best) setActive(best);
            },
            {
                // Bias toward the middle of the viewport so a section counts as
                // "active" when it is actually being read, not merely peeking in.
                rootMargin: '-35% 0px -35% 0px',
                threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ids]);

    return active;
};
