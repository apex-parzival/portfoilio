import './book.css';
import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { CHAPTERS, PAGE_H, PAGE_W, BOARD_OVERHANG, faceMeta } from './timeline';
import { CoverFace } from './Cover';
import { FoilDefs, Fleuron, LeaderRow } from './primitives';

/** Page-block thickness of the miniature, in design px. */
const BLOCK = 16;
/** Loose leaves that fan up between the cover and the contents page as it opens. */
const FAN = [0, 1, 2, 3];

const STAGE_W = PAGE_W * 2 + 60;
const STAGE_H = PAGE_H + 90;

interface BookModelProps {
    /** 0 = closed, 1 = cover laid back with the leaves fanned. */
    open: MotionValue<number>;
    /** Pointer tilt, degrees. */
    tiltX: MotionValue<number>;
    tiltY: MotionValue<number>;
    /** Pointer position across the book, 0 (left) … 1 (right) — the thumb of a flip-book. */
    thumb: MotionValue<number>;
    /** How far the pointer has taken over the leaves from their resting fan, 0 … 1. */
    riffle: MotionValue<number>;
}

/**
 * The /book scene in miniature, for the homepage: the same cover, the same
 * cloth and paper, hinged the same way — but driven by a single `open` value
 * instead of a timeline. It is decoration; the real links sit beside it.
 */
const BookModel = ({ open, tiltX, tiltY, thumb, riffle }: BookModelProps) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.5);

    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_W));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Closed, the cover is centred; open, the spine is.
    const camX = useTransform(open, (o) => (PAGE_W / 2) * Math.min(1, o * 1.4));
    /** Tilts about its middle when closed, about the spine once open — as the real one does. */
    const pivot = useTransform(open, (o) => 0.5 - 0.5 * Math.min(1, o * 1.4));
    const coverAngle = useTransform(open, (o) => -172 * o);
    const coverFront = useTransform(coverAngle, (a) => (a > -90 ? 1 : 0));
    const coverBack = useTransform(coverAngle, (a) => (a > -90 ? 0 : 1));
    const coverShade = useTransform(coverAngle, (a) => Math.sin((-a * Math.PI) / 180) * 0.7);
    // Closed, the board tops the stack; laid back, it is the bottom of the left-hand one.
    const coverZ = useTransform(coverAngle, (a) => (a > -90 ? BLOCK + 2 : 1));
    const shine = useTransform(tiltY, (r) => `${50 - r * 3}%`);
    const shadowW = useTransform(open, (o) => PAGE_W * (1 + Math.min(1, o * 1.2)) + 80);
    const shadowX = useTransform(open, (o) => -PAGE_W * Math.min(1, o * 1.2) - 40);

    return (
        <div ref={boxRef} className="bk-root relative w-full" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }} aria-hidden="true">
            <FoilDefs />
            <div
                className="absolute left-0 top-0 origin-top-left"
                style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
            >
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 2200 }}>
                    <motion.div
                        className="relative bk-serif"
                        style={
                            {
                                width: PAGE_W,
                                height: PAGE_H,
                                x: camX,
                                rotateX: tiltX,
                                rotateY: tiltY,
                                originX: pivot,
                                transformStyle: 'preserve-3d',
                                '--shine': shine,
                            } as unknown as React.CSSProperties
                        }
                    >
                        {/* Shadow on the table. */}
                        <motion.div
                            className="absolute rounded-[50%] pointer-events-none"
                            style={{
                                left: shadowX,
                                width: shadowW,
                                top: PAGE_H * 0.12,
                                height: PAGE_H * 0.95,
                                z: -30,
                                y: 30,
                                background: 'radial-gradient(closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0.3) 60%, transparent)',
                                filter: 'blur(24px)',
                            }}
                        />

                        {/* Back board and page block. */}
                        <div
                            className="absolute bk-cloth rounded-[3px_7px_7px_3px]"
                            style={{ left: 0, top: -BOARD_OVERHANG, width: PAGE_W + BOARD_OVERHANG, height: PAGE_H + BOARD_OVERHANG * 2 }}
                        />
                        <div
                            className="absolute bk-edge-fore"
                            style={{ left: PAGE_W, top: 0, height: PAGE_H, width: BLOCK, transformOrigin: '0 50%', transform: 'rotateY(-90deg)' }}
                        />
                        <div
                            className="absolute bk-edge-top"
                            style={{ left: 0, top: PAGE_H, width: PAGE_W, height: BLOCK, transformOrigin: '50% 0', transform: 'rotateX(90deg)' }}
                        />

                        {/* The page you land on: contents. */}
                        <div
                            className="absolute inset-0 bk-paper bk-recto overflow-hidden"
                            style={{ transform: 'translateZ(1px)' }}
                        >
                            <div className="absolute left-[50px] right-[42px] top-[64px]">
                                <p className="text-center text-[34px] italic font-medium">Contents</p>
                                <Fleuron className="mx-auto mt-2 w-16 text-[color:var(--bk-rubric)]" />
                                <ol className="mt-8 space-y-[11px]">
                                    {CHAPTERS.filter((c) => c.numeral || c.key === 'colophon').map((c) => (
                                        <li key={c.key}>
                                            <LeaderRow
                                                className="text-[16px]"
                                                label={
                                                    <span className="flex items-baseline gap-3">
                                                        <span className="w-7 text-right text-[color:var(--bk-rubric)] font-medium">
                                                            {c.numeral}
                                                        </span>
                                                        {c.title}
                                                    </span>
                                                }
                                                value={<span className="italic">{faceMeta(c.face).folio}</span>}
                                            />
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {FAN.map((k) => (
                            <FanLeaf key={k} k={k} open={open} thumb={thumb} riffle={riffle} />
                        ))}

                        {/* Front board. */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                rotateY: coverAngle,
                                z: coverZ,
                                transformOrigin: '0% 50%',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.div
                                className="absolute"
                                style={{
                                    left: 0,
                                    top: -BOARD_OVERHANG,
                                    width: PAGE_W + BOARD_OVERHANG,
                                    height: PAGE_H + BOARD_OVERHANG * 2,
                                    opacity: coverFront,
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <CoverFace />
                                <motion.div
                                    className="absolute inset-0 rounded-[3px_7px_7px_3px] bg-black"
                                    style={{ opacity: coverShade }}
                                />
                            </motion.div>
                            <motion.div
                                className="absolute bk-endpaper rounded-[7px_3px_3px_7px]"
                                style={{
                                    left: 0,
                                    top: -BOARD_OVERHANG,
                                    width: PAGE_W + BOARD_OVERHANG,
                                    height: PAGE_H + BOARD_OVERHANG * 2,
                                    rotateY: 180,
                                    opacity: coverBack,
                                }}
                            >
                                <motion.div className="absolute inset-0 bg-black" style={{ opacity: coverShade }} />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

/** Faint lines of type, so a page caught mid-turn reads as printed. */
const TYPE_LINES =
    'repeating-linear-gradient(180deg, rgba(33,28,22,0.2) 0 2px, transparent 2px 15px)';

const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

/**
 * A loose leaf. At rest they stand fanned after the opened cover, like a thumb
 * riffling them; under the pointer they become a flip-book — each leaf has its
 * own point across the book, and flips to whichever side of it the pointer is.
 */
const FanLeaf = ({
    k,
    open,
    thumb,
    riffle,
}: {
    k: number;
    open: MotionValue<number>;
    thumb: MotionValue<number>;
    riffle: MotionValue<number>;
}) => {
    const n = FAN.length;
    const angle = useTransform([open, thumb, riffle], ([o, x, r]) => {
        const start = 0.2 + k * 0.1;
        const f = Math.max(0, Math.min(1, ((o as number) - start) / (1 - start)));
        const fanned = -f * (160 - k * 22);
        const point = 0.3 + (k * 0.4) / (n - 1);
        const flipped = -2 - (176 - k) * smoothstep(point + 0.07, point - 0.07, x as number);
        return fanned + (flipped - fanned) * (r as number);
    });
    // Whichever side a leaf lies on, the one turned last sits on top.
    const z = useTransform(angle, (a) => (a > -90 ? 4 + (n - 1 - k) * 3 : 4 + k * 3));
    const front = useTransform(angle, (a) => (a > -90 ? 1 : 0));
    const back = useTransform(angle, (a) => (a > -90 ? 0 : 1));
    const shade = useTransform(angle, (a) => Math.sin((-a * Math.PI) / 180) * 0.34);

    return (
        <motion.div
            className="absolute inset-0"
            style={{ rotateY: angle, z, transformOrigin: '0% 50%', transformStyle: 'preserve-3d' }}
        >
            <motion.div className="absolute inset-0 bk-paper bk-recto" style={{ opacity: front }}>
                <div className="absolute left-[50px] right-[42px] top-[70px] bottom-[80px]" style={{ backgroundImage: TYPE_LINES }} />
                <motion.div className="absolute inset-0 bg-[#1c1006]" style={{ opacity: shade }} />
            </motion.div>
            <motion.div className="absolute inset-0 bk-paper bk-verso" style={{ opacity: back, rotateY: 180 }}>
                <div className="absolute left-[42px] right-[50px] top-[70px] bottom-[80px]" style={{ backgroundImage: TYPE_LINES }} />
                <motion.div className="absolute inset-0 bg-[#1c1006]" style={{ opacity: shade }} />
            </motion.div>
        </motion.div>
    );
};

export default BookModel;
