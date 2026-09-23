import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion';

/**
 * A book the size of a letter: its cover swings open when `open` goes to 1.
 * Spring-driven, like the cursor, so it still moves where the page-wide
 * reduced-motion settings have zeroed CSS transitions.
 */
export const BookGlyph = ({ open, className = '' }: { open: MotionValue<number>; className?: string }) => {
    const eased = useSpring(open, { stiffness: 260, damping: 18, mass: 0.6 });
    const cover = useTransform(eased, (o) => -155 * o);
    const leaf = useTransform(eased, (o) => -118 * o);
    const coverFill = useTransform(cover, (a) => (a > -90 ? 'var(--glyph-cover)' : 'var(--glyph-inside)'));

    return (
        <span
            className={`relative inline-block w-[11px] h-[14px] ${className}`}
            style={
                {
                    perspective: 60,
                    '--glyph-cover': 'currentColor',
                    '--glyph-inside': '#efe6d2',
                } as React.CSSProperties
            }
            aria-hidden="true"
        >
            <span className="absolute inset-0 rounded-[1px] border border-current opacity-60" />
            <span className="absolute inset-y-[2px] left-[2px] right-[1px] bg-[#efe6d2]/80 rounded-[1px]" />
            <motion.span
                className="absolute inset-y-[2px] left-[1px] right-[1px] bg-[#efe6d2] rounded-[1px]"
                style={{ rotateY: leaf, originX: 0 }}
            />
            <motion.span
                className="absolute inset-0 rounded-[1px]"
                style={{ rotateY: cover, originX: 0, backgroundColor: coverFill }}
            />
        </span>
    );
};
