const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const behavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

export const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: behavior() });
};

export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: behavior() });
};
