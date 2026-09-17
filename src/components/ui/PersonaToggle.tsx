import { motion } from 'framer-motion';
import type { ViewMode } from '../../App';

interface PersonaToggleProps {
    viewMode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

/**
 * Mobile-only persona switch.
 *
 * The spotlight reveal layers are `hidden md:block` — they need a pointer to
 * drive them. Without this control, a phone visitor in "Both" mode can only
 * ever see the backend layer, which is half the site.
 */
export const PersonaToggle = ({ viewMode, onChange }: PersonaToggleProps) => {
    // 'both' collapses to the backend layer on mobile, so treat it as such.
    const isAi = viewMode === 'view_ai_ml';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-full border border-white/10 bg-background/85 backdrop-blur-md p-1"
            role="group"
            aria-label="Switch persona"
        >
            <button
                onClick={() => onChange('view_backend')}
                aria-pressed={!isAi}
                className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${!isAi ? 'bg-cream text-[#0a0a0a]' : 'text-muted'
                    }`}
            >
                Backend
            </button>
            <button
                onClick={() => onChange('view_ai_ml')}
                aria-pressed={isAi}
                className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${isAi ? 'bg-accent text-[#0a0a0a]' : 'text-muted'
                    }`}
            >
                AI &amp; ML
            </button>
        </motion.div>
    );
};
