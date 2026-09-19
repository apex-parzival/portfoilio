import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    /*
     * In AI & ML mode the Hero, About and Skills sections are full accent, so a
     * bare accent bar vanishes against them. A dark track underneath keeps the
     * brand colour readable over both the dark sections and the orange ones.
     */
    return (
        <div
            className="fixed top-0 left-0 right-0 h-[2px] bg-[#0a0a0a]/50 z-[60]"
            aria-hidden="true"
        >
            <motion.div className="h-full bg-accent origin-left" style={{ scaleX }} />
        </div>
    );
};
