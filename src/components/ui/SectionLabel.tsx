import { motion } from 'framer-motion';

interface SectionLabelProps {
    /** Clean text, e.g. "Projects". The spaced-out display form is derived. */
    children: string;
    className?: string;
    delay?: number;
}

/**
 * Section heading.
 *
 * The letter-spaced look is decorative — a screen reader would announce
 * "P R O J E C T S" letter by letter. So the spaced form is `aria-hidden`
 * and a clean copy is exposed to assistive tech, inside a real <h2> so the
 * document actually has an outline to navigate.
 */
export const SectionLabel = ({ children, className = '', delay = 0 }: SectionLabelProps) => (
    <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className={`text-xs tracking-[0.4em] uppercase font-normal ${className}`}
    >
        <span className="sr-only">{children}</span>
        {/* Letters are spaced with ordinary spaces, so words need a wider, unbreakable gap or they run together. */}
        <span aria-hidden="true">
            {children
                .toUpperCase()
                .split(' ')
                .map((word) => word.split('').join(' '))
                .join('\u00a0\u00a0\u00a0')}
        </span>
    </motion.h2>
);
