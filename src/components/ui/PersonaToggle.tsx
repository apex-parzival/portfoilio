import { motion } from 'framer-motion';
import type { ViewMode } from '../../App';

interface PersonaToggleProps {
    viewMode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

const options: { label: string; value: ViewMode }[] = [
    { label: 'Backend', value: 'view_backend' },
    { label: 'Both', value: 'both' },
    { label: 'AI & ML', value: 'view_ai_ml' },
];

/**
 * Always-visible persona switch.
 *
 * Two reasons this cannot be hidden on any breakpoint:
 *  - The spotlight reveal layers are `hidden md:block`, so without a control a
 *    phone visitor can never reach the AI/ML persona at all.
 *  - The chosen mode persists for the browser session, so a visitor who picked
 *    "Backend Engineer" once would otherwise be stuck there with the chooser
 *    permanently skipped and no way back.
 */
export const PersonaToggle = ({ viewMode, onChange }: PersonaToggleProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-full border border-white/10 bg-background/85 backdrop-blur-md p-1"
        role="group"
        aria-label="Switch persona"
    >
        {options.map((option) => {
            const active = viewMode === option.value;
            return (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase whitespace-nowrap transition-colors duration-300 ${active
                        ? option.value === 'view_backend'
                            ? 'bg-cream text-[#0a0a0a]'
                            : 'bg-accent text-[#0a0a0a]'
                        : 'text-muted hover:text-foreground'
                        }`}
                    data-cursor-hide
                >
                    {option.label}
                </button>
            );
        })}
    </motion.div>
);
