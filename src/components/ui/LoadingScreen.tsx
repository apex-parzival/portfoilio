import { useRef } from 'react';
import { motion } from 'framer-motion';

type ViewMode = 'view_ai_ml' | 'view_backend' | 'both';

interface LoadingScreenProps {
    onSelectMode: (mode: ViewMode) => void;
}

export const LoadingScreen = ({ onSelectMode }: LoadingScreenProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
        containerRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
            style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
        >
            {/* Spotlight Effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(255, 77, 0, 0.4), transparent 40%)',
                }}
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-cream/40 text-xs tracking-[0.4em] uppercase mb-12 relative z-10"
            >
                SELECT YOUR EXPERIENCE
            </motion.p>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 relative z-10">
                {[
                    { label: 'Backend Engineer', value: 'view_backend' },
                    { label: 'AI & ML Engineer', value: 'view_ai_ml' },
                    { label: 'Both', value: 'both' },
                ].map((option, i) => (
                    <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        onClick={() => onSelectMode(option.value as ViewMode)}
                        className="group relative px-10 py-5 overflow-hidden rounded-full border border-white/10 hover:border-accent/50 transition-colors duration-500"
                        data-cursor-stick
                    >
                        <span className="relative z-10 text-sm md:text-base font-bold tracking-widest uppercase text-cream group-hover:text-accent transition-colors duration-300">
                            {option.label}
                        </span>
                        <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};
