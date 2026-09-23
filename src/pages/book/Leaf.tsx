import { useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';
import { useBook } from './context';
import {
    BOARD_OVERHANG,
    PAGE_H,
    PAGE_W,
    bendAngle,
    castFrom,
    leafRaw,
    leafT,
    leafZ,
} from './timeline';

interface LeafProps {
    index: number;
    front: ReactNode;
    back: ReactNode;
    /** Boards are a touch larger than the text block, overhang it, and never bend. */
    board?: boolean;
    /** The front face has depth layers of its own (the cover). */
    deepFront?: boolean;
}

const SHADE_RECTO = 'linear-gradient(90deg, rgba(28,16,6,0.22) 0%, rgba(28,16,6,0.55) 100%)';
const SHADE_VERSO = 'linear-gradient(270deg, rgba(28,16,6,0.22) 0%, rgba(28,16,6,0.55) 100%)';
const CAST_RECTO = 'linear-gradient(90deg, rgba(25,14,4,0.62) 0%, rgba(25,14,4,0.24) 32%, transparent 72%)';
const CAST_VERSO = 'linear-gradient(270deg, rgba(25,14,4,0.62) 0%, rgba(25,14,4,0.24) 32%, transparent 72%)';
const GLINT =
    'linear-gradient(100deg, transparent 38%, rgba(255,248,232,0.55) 49%, rgba(255,248,232,0.18) 53%, transparent 63%)';

/** A turning page is drawn as this many hinged strips, so it can bend. */
const STRIPS = 3;
const STRIP_W = PAGE_W / STRIPS;

/**
 * One leaf of the book: two faces back to back, hinged on the spine.
 *
 * Which face shows is decided by the turn angle rather than
 * backface-visibility — the cover's front carries preserve-3d depth layers,
 * and backface culling is unreliable once a face has 3D children of its own.
 *
 * At rest a leaf is one flat plane. While it turns it is re-drawn as hinged
 * strips (see `Strip`), so the paper curls: the free edge leads as it lifts
 * and trails as it falls. Only the leaf in motion pays for the extra copies.
 *
 * Light sells the turn:
 *  - shade:   the lifted page darkens as it rotates away from the lamp
 *  - glint:   a highlight catches whichever part of the curl faces the lamp
 *  - cast:    the page underneath receives its shadow (see `castFrom`)
 */
export const Leaf = ({ index, front, back, board = false, deepFront = false }: LeafProps) => {
    const { u } = useBook();

    const isBending = (v: number) => {
        if (board) return false;
        const r = leafRaw(index, v);
        return r > 0 && r < 1;
    };
    const [bending, setBending] = useState(() => isBending(u.get()));
    useMotionValueEvent(u, 'change', (v) => {
        const b = isBending(v);
        setBending((prev) => (prev === b ? prev : b));
    });

    const t = useTransform(u, (v) => leafT(index, v));
    const rotateY = useTransform(t, (v) => -180 * v);
    const z = useTransform(t, (v) => leafZ(index, v));

    return (
        <motion.div
            className="absolute inset-0"
            style={{
                rotateY,
                z,
                transformOrigin: '0% 50%',
                transformStyle: 'preserve-3d',
                width: PAGE_W,
                height: PAGE_H,
            }}
        >
            {bending ? (
                <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                    <Strip k={0} t={t} front={front} back={back} />
                </div>
            ) : (
                <FlatFaces index={index} t={t} front={front} back={back} board={board} deepFront={deepFront} />
            )}
        </motion.div>
    );
};

const FlatFaces = ({
    index,
    t,
    front,
    back,
    board,
    deepFront,
}: {
    index: number;
    t: MotionValue<number>;
    front: ReactNode;
    back: ReactNode;
    board: boolean;
    deepFront: boolean;
}) => {
    const { u } = useBook();

    const frontOpacity = useTransform(t, (v) => (v < 0.5 ? 1 : 0));
    const backOpacity = useTransform(t, (v) => (v < 0.5 ? 0 : 1));
    const frontEvents = useTransform(t, (v) => (v < 0.5 ? 'auto' : 'none'));
    const backEvents = useTransform(t, (v) => (v < 0.5 ? 'none' : 'auto'));

    // Only boards turn flat, so only they need light while turning.
    const shade = useTransform(t, (v) => Math.sin(Math.PI * v) * 0.85);
    const glintOpacity = useTransform(u, (v) => {
        const r = leafRaw(index, v);
        return r > 0 && r < 1 ? Math.sin(Math.PI * r) * 0.7 : 0;
    });
    const glintPos = useTransform(u, (v) => `${130 - leafRaw(index, v) * 160}% 0%`);

    // Shadows this leaf *receives* from its neighbours as they turn over it.
    const castOnFront = useTransform(u, (v) => castFrom(index - 1, v, 'right'));
    const castOnBack = useTransform(u, (v) => castFrom(index + 1, v, 'left'));

    const faceBox = board
        ? { left: 0, top: -BOARD_OVERHANG, width: PAGE_W + BOARD_OVERHANG, height: PAGE_H + BOARD_OVERHANG * 2 }
        : { left: 0, top: 0, width: PAGE_W, height: PAGE_H };

    return (
        <>
            <motion.div
                className="absolute"
                style={{
                    ...faceBox,
                    opacity: frontOpacity,
                    pointerEvents: frontEvents,
                    transformStyle: deepFront ? 'preserve-3d' : undefined,
                }}
            >
                {front}
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{ background: CAST_RECTO, opacity: castOnFront }}
                    aria-hidden="true"
                />
                {board && (
                    <>
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: SHADE_RECTO, opacity: shade }}
                            aria-hidden="true"
                        />
                        <motion.div
                            className="absolute inset-0 pointer-events-none mix-blend-screen"
                            style={{
                                backgroundImage: GLINT,
                                backgroundSize: '260% 100%',
                                backgroundPosition: glintPos,
                                opacity: glintOpacity,
                            }}
                            aria-hidden="true"
                        />
                    </>
                )}
            </motion.div>

            <motion.div
                className="absolute"
                style={{
                    ...faceBox,
                    opacity: backOpacity,
                    pointerEvents: backEvents,
                    rotateY: 180,
                }}
            >
                {back}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: CAST_VERSO, opacity: castOnBack }}
                    aria-hidden="true"
                />
                {board && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: SHADE_VERSO, opacity: shade }}
                        aria-hidden="true"
                    />
                )}
            </motion.div>
        </>
    );
};

/** Lamp light caught by paper at this turn angle, peaking where it faces the lamp. */
const catchLight = (deg: number) => Math.exp(-(((deg - 50) / 24) ** 2)) * 0.34;
/** Shadow on paper tilted away from the lamp. */
const darkness = (deg: number) => Math.sin((Math.PI * Math.min(180, Math.max(0, deg))) / 180) * 0.42;

/**
 * Turn angle along the page at strip boundary j (0 = spine, STRIPS = free
 * edge). Interior boundaries take the mean of the two strips meeting there,
 * so a gradient from one boundary to the next shades the page continuously —
 * it reads as a curve rather than as facets.
 */
const boundaryAngle = (v: number, j: number) =>
    180 * v + Math.max(0, Math.min(STRIPS - 1, j - 0.5)) * bendAngle(v);

const ramp = (rgb: string, a: number, b: number) =>
    `linear-gradient(90deg, rgba(${rgb},${a.toFixed(3)}), rgba(${rgb},${b.toFixed(3)}))`;

/**
 * One vertical strip of a bending page, and — nested inside it, hinged on its
 * right edge — the next strip. Each shows its own slice of both faces.
 * Strips after the first render duplicate content, so they are inert and
 * hidden from assistive tech; the reader never interacts mid-turn anyway.
 */
const Strip = ({
    k,
    t,
    front,
    back,
}: {
    k: number;
    t: MotionValue<number>;
    front: ReactNode;
    back: ReactNode;
}) => {
    // rotateY is negative in the direction of the turn; a positive bend leads.
    const joint = useTransform(t, (v) => (k === 0 ? 0 : -bendAngle(v)));
    /** How far this strip has turned, 0 (flat on the right) … 180 (flat on the left). */
    const angle = useTransform(t, (v) => 180 * v + k * bendAngle(v));
    const frontOpacity = useTransform(angle, (a) => (a < 90 ? 1 : 0));
    const backOpacity = useTransform(angle, (a) => (a < 90 ? 0 : 1));
    // Front: local left is boundary k. Back is mirrored: local left is boundary k + 1.
    const frontShade = useTransform(t, (v) =>
        ramp('28,16,6', darkness(boundaryAngle(v, k)), darkness(boundaryAngle(v, k + 1)))
    );
    const backShade = useTransform(t, (v) =>
        ramp('28,16,6', darkness(boundaryAngle(v, k + 1)), darkness(boundaryAngle(v, k)))
    );
    const frontLight = useTransform(t, (v) =>
        ramp('255,246,226', catchLight(boundaryAngle(v, k)), catchLight(boundaryAngle(v, k + 1)))
    );
    const backLight = useTransform(t, (v) =>
        ramp('255,246,226', catchLight(180 - boundaryAngle(v, k + 1)), catchLight(180 - boundaryAngle(v, k)))
    );
    const duplicate = k > 0;
    // Faces overlap the next strip by a pixel, or anti-aliasing leaves a seam at each hinge.
    const w = k < STRIPS - 1 ? STRIP_W + 1 : STRIP_W;

    return (
        <motion.div
            className="absolute top-0"
            style={{
                left: k === 0 ? 0 : STRIP_W,
                width: STRIP_W,
                height: PAGE_H,
                rotateY: joint,
                transformOrigin: '0% 50%',
                transformStyle: 'preserve-3d',
            }}
        >
            <motion.div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: w, opacity: frontOpacity }}
                inert={duplicate}
                aria-hidden={duplicate || undefined}
            >
                <div className="absolute top-0" style={{ left: -k * STRIP_W, width: PAGE_W, height: PAGE_H }}>
                    {front}
                </div>
                <motion.div className="absolute inset-0" style={{ backgroundImage: frontShade }} />
                <motion.div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: frontLight }} />
            </motion.div>

            <motion.div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: w, opacity: backOpacity, rotateY: 180 }}
                inert={duplicate}
                aria-hidden={duplicate || undefined}
            >
                <div
                    className="absolute top-0"
                    style={{ left: -(PAGE_W - (k + 1) * STRIP_W) + (w - STRIP_W), width: PAGE_W, height: PAGE_H }}
                >
                    {back}
                </div>
                <motion.div className="absolute inset-0" style={{ backgroundImage: backShade }} />
                <motion.div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: backLight }} />
            </motion.div>

            {k < STRIPS - 1 && <Strip k={k + 1} t={t} front={front} back={back} />}
        </motion.div>
    );
};
