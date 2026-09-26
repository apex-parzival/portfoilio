/**
 * The page-turners' flight, as pure functions of the timeline.
 *
 * A flyer swoops in, closes its grip on the page's free edge, carries the page
 * up and over the spine, sets it down on the far side and leaves — and the next
 * page is the other one's job. The grip sits on the edge *in 3D*, at the
 * paper's own depth, so it holds the page from every angle the book is seen at.
 *
 * Shared by the 3D layer (three/Flyers3D) and its 2D fallback (Crew), so the
 * two can never disagree about where a hand should be.
 */
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

/**
 * Size of the invisible anchor Crew places on each grip, design px. Its size
 * on screen is the scale at the grip's depth.
 */
export const ANCHOR = 20;

/** How far down the outer edge the page is held — the upper third, clear of the running head. */
export const HOLD_Y = 150;
/** Hands rest a hair in front of the paper, never through it. */
const FRONT = 3;
/** Timeline units spent flying in before the turn, and away after it. */
const PRE = 0.9;
const POST = 0.9;

/** Who takes which leaf: they alternate. */
export const FAIRY = 1;
export const ROBOT = 0;

export interface Flight {
    leaf: number;
    phase: 'in' | 'carry' | 'out';
    /** Progress through the approach or the departure. */
    p: number;
    /** Eased turn fraction of the page, while carrying it. */
    t: number;
}

export interface P3 {
    x: number;
    y: number;
    z: number;
}

/**
 * Which turn this flyer is on and how far through it, or null while it is
 * away. The cover is nobody's job — a board is far too heavy to fly.
 */
export const flightAt = (u: number, parity: number): Flight | null => {
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

/** A glide between two points: eased, bowing gently downward mid-flight. */
const swoop = (a: P3, b: P3, p: number): P3 => {
    const e = easeInOutCubic(p);
    return {
        x: a.x + (b.x - a.x) * e,
        y: a.y + (b.y - a.y) * e + 22 * Math.sin(Math.PI * p),
        z: a.z + (b.z - a.z) * e,
    };
};

/** Where a flyer waits, out of sight, between its turns. */
export const PARKED: P3 = { x: PAGE_W + 180, y: HOLD_Y - 120, z: 140 };

/** Where the grip is, in the book's 3D space: on the page's free edge while carrying it. */
export const gripAt = (f: Flight | null): P3 => {
    if (!f) return PARKED;
    if (f.phase === 'carry') {
        const edge = pageEdge(f.t);
        return { x: edge.x, y: HOLD_Y, z: edge.z + leafZ(f.leaf, f.t) + FRONT };
    }
    if (f.phase === 'in') {
        return swoop(PARKED, { x: PAGE_W, y: HOLD_Y, z: leafZ(f.leaf, 0) + FRONT }, f.p);
    }
    return swoop(
        { x: -PAGE_W, y: HOLD_Y, z: leafZ(f.leaf, 1) + FRONT },
        { x: -PAGE_W - 200, y: HOLD_Y - 130, z: 140 },
        f.p
    );
};

/**
 * Attitude about the grip, degrees clockwise on screen. Body up while hauling
 * the page off the stack, level over the top, body down as it lowers it.
 */
export const pitchAt = (f: Flight | null) => {
    if (!f) return 0;
    if (f.phase === 'in') return -10 * easeInOutCubic(f.p);
    if (f.phase === 'out') return 10 - 22 * easeInOutCubic(f.p);
    return -10 * Math.cos(Math.PI * f.t);
};

export const opacityAt = (f: Flight | null) => {
    if (!f) return 0;
    if (f.phase === 'in') return easeInOutCubic(clamp01(f.p / 0.55));
    if (f.phase === 'out') return 1 - easeInOutCubic(clamp01((f.p - 0.3) / 0.7));
    return 1;
};
