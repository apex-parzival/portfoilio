import { useEffect, useRef } from 'react';

interface Mote {
    x: number;
    y: number;
    r: number;
    vy: number;
    phase: number;
    alpha: number;
}

const COUNT = 80;

/**
 * Dust drifting through the lamp light. A 2D canvas, not DOM nodes, so eighty
 * motes cost one layer. Motes are only bright inside the pool of light and
 * fade to nothing in the dark, which is what makes the light read as a beam.
 */
export const Dust = () => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let w = 0;
        let h = 0;
        let frame = 0;
        const motes: Mote[] = [];

        const spawn = (anywhere: boolean): Mote => ({
            x: Math.random() * w,
            y: anywhere ? Math.random() * h : h + 10,
            r: 0.4 + Math.random() * 1.5,
            vy: 0.06 + Math.random() * 0.22,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.25 + Math.random() * 0.6,
        });

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (motes.length === 0) {
                for (let i = 0; i < COUNT; i++) motes.push(spawn(true));
            }
        };

        const draw = (time: number) => {
            ctx.clearRect(0, 0, w, h);
            const cx = w / 2;
            const cy = h * 0.42;
            for (let i = 0; i < motes.length; i++) {
                const m = motes[i];
                m.y -= m.vy;
                m.x += Math.sin(time * 0.00025 + m.phase) * 0.18;
                if (m.y < -10) motes[i] = spawn(false);

                const dx = (m.x - cx) / (w * 0.42);
                const dy = (m.y - cy) / (h * 0.55);
                const light = Math.max(0, 1 - (dx * dx + dy * dy));
                const twinkle = 0.75 + 0.25 * Math.sin(time * 0.0012 + m.phase * 3);

                ctx.globalAlpha = m.alpha * light * light * twinkle;
                ctx.fillStyle = '#ffd6a0';
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
                ctx.fill();
            }
            frame = requestAnimationFrame(draw);
        };

        const onVisibility = () => {
            cancelAnimationFrame(frame);
            if (!document.hidden) frame = requestAnimationFrame(draw);
        };

        resize();
        frame = requestAnimationFrame(draw);
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
};
