import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [cursorMode, setCursorMode] = useState<'idle' | 'engulf' | 'hidden'>('idle');

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Priority 1: hide cursor (navbar links)
            if (target.closest('[data-cursor-hide]')) {
                setCursorMode('hidden');
                return;
            }

            // Priority 2: engulf (cards, buttons, links, interactive)
            if (
                target.closest('[data-cursor-engulf]') ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button')
            ) {
                setCursorMode('engulf');
                return;
            }

            setCursorMode('idle');
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    const isHidden = cursorMode === 'hidden';
    const isEngulf = cursorMode === 'engulf';
    const dotSize = isEngulf ? 80 : 12;
    const dotOffset = dotSize / 2;

    return createPortal(
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] bg-accent"
            animate={{
                x: mousePosition.x - dotOffset,
                y: mousePosition.y - dotOffset,
                width: dotSize,
                height: dotSize,
                opacity: isHidden ? 0 : 1,
            }}
            transition={{
                type: 'tween',
                ease: 'backOut',
                duration: isEngulf ? 0.25 : 0.12,
            }}
        />,
        document.body
    );
};
