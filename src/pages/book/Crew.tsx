import { motion, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useBook } from './context';
import {
    LEAF_COUNT,
    PAGE_W,
    clamp01,
    easeInOutCubic,
    leafT,
    leafZ,
    pageEdge,
    turnEnd,
    turnStart,
} from './timeline';
import { Drone, Fairy, FlyerDefs } from './flyers';

/**
 * Nobody turns these pages by hand. A flyer swoops in, closes its grip on the
 * page's outer edge, carries it up and over the spine, sets it down on the far
 * side and flies off — and the next page is the other one's job.
 *
 * The grip is placed on the edge *in 3D*: at the same depth as the paper, not
 * just lined up with it on screen. A turning page swings up to a page-width
 * toward the viewer; a flyer drawn at a fixed depth only ever looked lined up
 * from one angle, and was never actually holding anything.
 */

/** The models' drawing box (see flyers.tsx), scaled into design px, and the grip within it. */
const VIEW_W = 120;
const VIEW_H = 100;
const SCALE = 1;
const FLY_W = VIEW_W * SCALE;
const FLY_H = VIEW_H * SCALE;
const GRIP_X = 8 * SCALE;
const GRIP_Y = 40 * SCALE;

/** How far down the outer edge the page is held — the upper third, clear of the running head. */
const HOLD_Y = 150;
/** Hands rest a hair in front of the paper, never through it. */
const FRONT = 3;
/** Timeline units spent flying in before the turn, and away after it. */
const PRE = 0.9;
const POST = 0.9;

interface Flight {
    leaf: number;
    phase: 'in' | 'carry' | 'out';
    /** Progress through the approach or the departure. */
    p: number;
    /** Eased turn fraction of the page, while carrying it. */
    t: number;
}

/**
 * Which turn this flyer is on and how far through it, or null while it is
 * away. Leaves alternate between the two, and the cover is nobody's job —
 * a board is far too heavy to fly.
 */
const flightAt = (u: number, parity: number): Flight | null => {
    for (let i = 1; i < LEAF_COUNT; i++) {
        if (i % 2 !== parity) continue;
        const start = turnStart(i);
        const end = turnEnd(i);
        if (u < start - PRE || u > end + POST) continue;
        if (u < start) return { leaf: i, phase: 'in', p: clamp01((u - start + PRE) / PRE), t: 0 };
        if (u > end) return { leaf: i, phase: 'out', p: clamp01((u - end) / POST), t: 1 };
        return { leaf: i, phase: 'carry', p: 0, t: leafT(i, u) };
    }
    return null;
};

interface P3 {
    x: number;
    y: number;
    z: number;
}

/** A glide between two points: eased, bowing gently downward mid-flight. */
const swoop = (a: P3, b: P3, p: number): P3 => {
    const e = easeInOutCubic(p);
    return {
        x: a.x + (b.x - a.x) * e,
        y: a.y + (b.y - a.y) * e + 22 * Math.sin(Math.PI * p),
        z: a.z + (b.z - a.z) * e,
    };
};

/** Where the grip is: on the page's free edge while carrying it; otherwise arriving or leaving. */
const gripAt = (f: Flight): P3 => {
    if (f.phase === 'carry') {
        const edge = pageEdge(f.t);
        return { x: edge.x, y: HOLD_Y, z: edge.z + leafZ(f.leaf, f.t) + FRONT };
    }
    if (f.phase === 'in') {
        return swoop(
            { x: PAGE_W + 180, y: HOLD_Y - 120, z: 140 },
            { x: PAGE_W, y: HOLD_Y, z: leafZ(f.leaf, 0) + FRONT },
            f.p
        );
    }
    return swoop(
        { x: -PAGE_W, y: HOLD_Y, z: leafZ(f.leaf, 1) + FRONT },
        { x: -PAGE_W - 200, y: HOLD_Y - 130, z: 140 },
        f.p
    );
};

/**
 * Attitude, about the grip. Body up while hauling the page off the stack,
 * level as it goes over, body down as it lowers it onto the other side.
 */
const pitchAt = (f: Flight) => {
    if (f.phase === 'in') return -10 * easeInOutCubic(f.p);
    if (f.phase === 'out') return 10 - 22 * easeInOutCubic(f.p);
    return -10 * Math.cos(Math.PI * f.t);
};

const opacityAt = (f: Flight | null) => {
    if (!f) return 0;
    if (f.phase === 'in') return easeInOutCubic(clamp01(f.p / 0.55));
    if (f.phase === 'out') return 1 - easeInOutCubic(clamp01((f.p - 0.3) / 0.7));
    return 1;
};

export const Crew = () => (
    <>
        <FlyerDefs />
        <Flyer parity={1} model={<Fairy />} />
        <Flyer parity={0} model={<Drone />} />
    </>
);

const Flyer = ({ parity, model }: { parity: number; model: ReactNode }) => {
    const { u } = useBook();

    const grip = (v: number) => {
        const f = flightAt(v, parity);
        return f ? gripAt(f) : { x: PAGE_W + 180, y: HOLD_Y - 120, z: 140 };
    };
    const x = useTransform(u, (v) => grip(v).x);
    const y = useTransform(u, (v) => grip(v).y);
    const z = useTransform(u, (v) => grip(v).z);
    const rotate = useTransform(u, (v) => {
        const f = flightAt(v, parity);
        return f ? pitchAt(f) : 0;
    });
    const opacity = useTransform(u, (v) => opacityAt(flightAt(v, parity)));
    // Nothing to draw while away; skip it outright rather than compositing an invisible layer.
    const visibility = useTransform(opacity, (o) => (o > 0.001 ? 'visible' : 'hidden'));

    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{
                left: -GRIP_X,
                top: -GRIP_Y,
                width: FLY_W,
                height: FLY_H,
                x,
                y,
                z,
                rotate,
                originX: GRIP_X / FLY_W,
                originY: GRIP_Y / FLY_H,
                opacity,
                visibility,
            }}
            aria-hidden="true"
        >
            {/* Swaying about the grip, never away from it: the hands stay on the paper. */}
            <div className="bk-sway w-full h-full" style={{ transformOrigin: `${GRIP_X}px ${GRIP_Y}px` }}>
                {model}
            </div>
        </motion.div>
    );
};
