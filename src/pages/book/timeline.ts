/**
 * The book's choreography, as pure functions of one number.
 *
 * Everything the scene does — which leaf is turning, how far, where the camera
 * sits, which pages are on screen — is derived from `u`, a position along a
 * timeline measured in abstract "units". Scroll maps onto u linearly; nothing
 * else holds state. That keeps every effect in lock-step and makes the whole
 * thing unit-testable without a browser.
 *
 *   0 ─ INTRO ─┬─ TURN ─┬─ DWELL ─┬─ TURN ─┬─ … ─┬─ TURN ─┬─ FINAL_DWELL ─ TOTAL
 *   closed     cover     spread 1   leaf 1         leaf 9   last spread
 */

/** Design size of one page. The scene is laid out at this size and scaled to fit. */
export const PAGE_W = 440;
export const PAGE_H = 620;

/** Boards overhang the text block slightly, like a real hardback. */
export const BOARD_OVERHANG = 6;

/** Turnable leaves, cover included. The colophon sits on the fixed back board. */
export const LEAF_COUNT = 10;
export const SPREAD_COUNT = LEAF_COUNT + 1;

export const INTRO = 1.4;
/** A turn is the long part of a step: paper is heavy and should look it. */
export const TURN = 1.6;
export const DWELL = 1.3;
export const FINAL_DWELL = 2.4;
export const TOTAL = INTRO + LEAF_COUNT * TURN + (LEAF_COUNT - 1) * DWELL + FINAL_DWELL;

/** Scroll height of one unit. The whole book is ~TOTAL × this. */
export const VH_PER_UNIT = 62;

/** Leaf thickness in design px — pages stack up visibly as the book is read. */
export const LEAF_DZ = 1.6;
/** Where the colophon page sits above the back board. */
export const BASE_Z = 0.8;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Pages accelerate off the stack and settle onto the other one. */
export const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const turnStart = (i: number) => INTRO + i * (TURN + DWELL);
export const turnEnd = (i: number) => turnStart(i) + TURN;

export const spreadStart = (k: number) => (k === 0 ? 0 : turnEnd(k - 1));
export const spreadEnd = (k: number) => (k === LEAF_COUNT ? TOTAL : turnStart(k));
export const spreadLength = (k: number) => spreadEnd(k) - spreadStart(k);

/** Raw (linear) turn fraction of leaf i at position u. */
export const leafRaw = (i: number, u: number) => clamp01((u - turnStart(i)) / TURN);

/** Eased turn fraction: 0 = lying on the right, 1 = lying on the left. */
export const leafT = (i: number, u: number) => easeInOutCubic(leafRaw(i, u));

/** How many leaves have turned, fractionally. Drives the stack thicknesses. */
export const turnedCount = (u: number) => {
    let sum = 0;
    for (let i = 0; i < LEAF_COUNT; i++) sum += leafT(i, u);
    return sum;
};

/** Z height of leaf i: stacked on the right until halfway, then on the left. */
export const leafZ = (i: number, t: number) =>
    t < 0.5 ? BASE_Z + (LEAF_COUNT - i) * LEAF_DZ : (i + 1) * LEAF_DZ;

/**
 * Opacity of the shadow leaf `from` throws onto the page beneath it.
 * While it is over the right-hand stack it darkens the recto below; once past
 * vertical it falls on the verso below on the left. A faint occlusion lingers
 * near the spine on the other side.
 */
export const castFrom = (from: number, v: number, onto: 'left' | 'right') => {
    if (from < 0 || from >= LEAF_COUNT) return 0;
    const t = leafT(from, v);
    if (t <= 0 || t >= 1) return 0;
    const s = Math.sin(Math.PI * t);
    const over = onto === 'right' ? t < 0.5 : t >= 0.5;
    return over ? s * 0.75 : s * 0.22;
};

/** Peak bend at each hinge of a turning page, in degrees. */
export const BEND = 21;

/**
 * How far each strip of a turning page runs ahead of the one before it, at
 * eased turn fraction t. Positive while lifting (the free edge leads, as when
 * a thumb pulls the corner), negative while falling (air holds the edge back),
 * and zero at both ends so a page lands flat.
 */
export const bendAngle = (t: number) => BEND * Math.sin(2 * Math.PI * t);

/** Perspective on the stage. The crew need it to keep their hands on the page. */
export const PERSPECTIVE = 2400;

/** A turning page is drawn as this many hinged strips (see Leaf), so it can bend. */
export const STRIPS = 3;
export const STRIP_W = PAGE_W / STRIPS;

/** How far strip k of a bending page has turned, in degrees. */
export const stripAngle = (t: number, k: number) => 180 * t + k * bendAngle(t);

/**
 * The hinges of a turning page, from the spine out to the free edge: design px
 * across (x) and toward the viewer (z). A bent page curls its far strips over,
 * so the free edge is not simply where a flat rotation would put it.
 */
export const pageHinges = (t: number) => {
    const points = [{ x: 0, z: 0 }];
    let x = 0;
    let z = 0;
    for (let k = 0; k < STRIPS; k++) {
        const a = (stripAngle(t, k) * Math.PI) / 180;
        x += STRIP_W * Math.cos(a);
        z += STRIP_W * Math.sin(a);
        points.push({ x, z });
    }
    return points;
};

/**
 * The free edge of a turning page, in the book's own 3D space: design px
 * across from the spine (x) and toward the viewer (z), before the leaf's
 * stacking height is added. Anything that holds the page holds it here —
 * placed in 3D rather than lined up on screen, so it stays on the paper from
 * every angle the book is seen at.
 */
export const pageEdge = (t: number) => pageHinges(t)[STRIPS];

/** Index of the leaf currently in motion, or -1. */
export const turningLeaf = (u: number) => {
    for (let i = 0; i < LEAF_COUNT; i++) {
        const r = leafRaw(i, u);
        if (r > 0 && r < 1) return i;
    }
    return -1;
};

/** Which spread's dwell window contains u (turn windows resolve to the one after). */
export const spreadAt = (u: number) => {
    for (let k = 0; k < SPREAD_COUNT; k++) {
        if (u < spreadEnd(k)) return k;
    }
    return LEAF_COUNT;
};

// ─── Single-page (phone) camera ─────────────────────────────────────────────
// A spread is two pages; a phone shows one. The camera reads the left page,
// pans to the right one, then follows the next leaf across as it turns.

const PAN_FROM = 0.38;
const PAN_TO = 0.62;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Camera offset, as a percentage of one page width, applied to the book.
 *  - 0%   → the right-hand page (or the closed cover) is centred
 *  - 50%  → the spine is centred (two-page spread)
 *  - 100% → the left-hand page is centred
 */
export const cameraX = (u: number, single: boolean) => {
    if (!single) return 50 * leafT(0, u);

    const turning = turningLeaf(u);
    if (turning >= 0) return 100 * leafT(turning, u);

    const k = spreadAt(u);
    if (k === 0) return 0;

    const s = (u - spreadStart(k)) / spreadLength(k);
    if (s <= PAN_FROM) return 100;
    if (s >= PAN_TO) return 0;
    return 100 * (1 - easeInOutSine((s - PAN_FROM) / (PAN_TO - PAN_FROM)));
};

/** Each turn breathes the camera out slightly, as if leaning back to watch the page go over. */
export const cameraScale = (u: number) => {
    const turning = turningLeaf(u);
    const breath = turning >= 0 ? Math.sin(Math.PI * leafRaw(turning, u)) : 0;
    return 1 - 0.035 * breath;
};

// ─── Faces ───────────────────────────────────────────────────────────────────

export type FaceId =
    | 'cover'
    | 'endpaper'
    | 'title'
    | 'copyright'
    | 'contents'
    | 'voice-backend'
    | 'voice-ai'
    | 'education'
    | 'skills'
    | 'work'
    | 'plate-0'
    | 'plate-1'
    | 'plate-2'
    | 'plate-3'
    | 'plate-4'
    | 'plate-5'
    | 'appendix'
    | 'experience'
    | 'achievements'
    | 'correspondence'
    | 'colophon';

export type ChapterKey =
    | 'cover'
    | 'front'
    | 'contents'
    | 'i'
    | 'ii'
    | 'iii'
    | 'iv'
    | 'v'
    | 'vi'
    | 'vii'
    | 'colophon';

export interface FaceMeta {
    id: FaceId;
    /** Leaf index, or 'base' for the page printed on the back board. */
    leaf: number | 'base';
    side: 'front' | 'back';
    chapter: ChapterKey;
    /** Printed page number, if the page carries one. */
    folio?: string;
}

/** Every page, in reading order — which is also DOM order, so screen readers get it right. */
export const FACES: FaceMeta[] = [
    { id: 'cover', leaf: 0, side: 'front', chapter: 'cover' },
    { id: 'endpaper', leaf: 0, side: 'back', chapter: 'front' },
    { id: 'title', leaf: 1, side: 'front', chapter: 'front', folio: 'i' },
    { id: 'copyright', leaf: 1, side: 'back', chapter: 'front', folio: 'ii' },
    { id: 'contents', leaf: 2, side: 'front', chapter: 'contents', folio: 'iii' },
    { id: 'voice-backend', leaf: 2, side: 'back', chapter: 'i', folio: '1' },
    { id: 'voice-ai', leaf: 3, side: 'front', chapter: 'i', folio: '2' },
    { id: 'education', leaf: 3, side: 'back', chapter: 'ii', folio: '3' },
    { id: 'skills', leaf: 4, side: 'front', chapter: 'iii', folio: '4' },
    { id: 'work', leaf: 4, side: 'back', chapter: 'iv', folio: '5' },
    { id: 'plate-0', leaf: 5, side: 'front', chapter: 'iv', folio: '6' },
    { id: 'plate-1', leaf: 5, side: 'back', chapter: 'iv', folio: '7' },
    { id: 'plate-2', leaf: 6, side: 'front', chapter: 'iv', folio: '8' },
    { id: 'plate-3', leaf: 6, side: 'back', chapter: 'iv', folio: '9' },
    { id: 'plate-4', leaf: 7, side: 'front', chapter: 'iv', folio: '10' },
    { id: 'plate-5', leaf: 7, side: 'back', chapter: 'iv', folio: '11' },
    { id: 'appendix', leaf: 8, side: 'front', chapter: 'iv', folio: '12' },
    { id: 'experience', leaf: 8, side: 'back', chapter: 'v', folio: '13' },
    { id: 'achievements', leaf: 9, side: 'front', chapter: 'vi', folio: '14' },
    { id: 'correspondence', leaf: 9, side: 'back', chapter: 'vii', folio: '15' },
    { id: 'colophon', leaf: 'base', side: 'front', chapter: 'colophon', folio: '16' },
];

export const faceMeta = (id: FaceId) => FACES.find((f) => f.id === id)!;

export const faceOf = (leaf: number | 'base', side: 'front' | 'back') =>
    FACES.find((f) => f.leaf === leaf && f.side === side);

/** The two pages visible at spread k (the closed cover has no left page). */
export const spreadFaces = (k: number): { left?: FaceId; right?: FaceId } => ({
    left: k === 0 ? undefined : faceOf(k - 1, 'back')?.id,
    right: (k === LEAF_COUNT ? faceOf('base', 'front') : faceOf(k, 'front'))?.id,
});

/** Which spread, and which side of it, a face appears on. */
export const spreadOfFace = (id: FaceId): { spread: number; side: 'left' | 'right' } => {
    const f = faceMeta(id);
    if (f.leaf === 'base') return { spread: LEAF_COUNT, side: 'right' };
    return f.side === 'front'
        ? { spread: f.leaf, side: 'right' }
        : { spread: f.leaf + 1, side: 'left' };
};

// ─── Stops ───────────────────────────────────────────────────────────────────
// Resting positions — where keyboard, buttons, contents links and the soft
// snap all land. A spread on a wide screen; a single page on a phone.

export interface Stop {
    u: number;
    spread: number;
    /** 'both' on wide screens; the page in view on a phone. */
    side: 'left' | 'right' | 'both';
}

export const buildStops = (single: boolean): Stop[] => {
    const stops: Stop[] = [{ u: 0, spread: 0, side: single ? 'right' : 'both' }];
    for (let k = 1; k < SPREAD_COUNT; k++) {
        const start = spreadStart(k);
        const len = spreadLength(k);
        if (single) {
            stops.push({ u: start + 0.18 * len, spread: k, side: 'left' });
            stops.push({ u: start + 0.82 * len, spread: k, side: 'right' });
        } else {
            stops.push({ u: start + 0.5 * len, spread: k, side: 'both' });
        }
    }
    return stops;
};

export const nearestStop = (stops: Stop[], u: number) => {
    let best = 0;
    for (let i = 1; i < stops.length; i++) {
        if (Math.abs(stops[i].u - u) < Math.abs(stops[best].u - u)) best = i;
    }
    return best;
};

/** True where nothing is moving — no leaf mid-turn, no camera mid-pan. */
export const isRestingAt = (u: number, single: boolean) => {
    if (turningLeaf(u) >= 0) return false;
    if (!single) return true;
    const k = spreadAt(u);
    if (k === 0) return true;
    const s = (u - spreadStart(k)) / spreadLength(k);
    return s <= PAN_FROM || s >= PAN_TO;
};

export const stopForFace = (stops: Stop[], id: FaceId) => {
    const { spread, side } = spreadOfFace(id);
    const index = stops.findIndex(
        (s) => s.spread === spread && (s.side === 'both' || s.side === side)
    );
    return index === -1 ? 0 : index;
};

/** The faces actually on screen at a stop — what gets to play its entrance. */
export const facesAtStop = (stop: Stop): FaceId[] => {
    const { left, right } = spreadFaces(stop.spread);
    if (stop.side === 'left') return left ? [left] : [];
    if (stop.side === 'right') return right ? [right] : [];
    return [left, right].filter((f): f is FaceId => Boolean(f));
};

// ─── Chapters ────────────────────────────────────────────────────────────────

export interface Chapter {
    key: ChapterKey;
    numeral: string;
    title: string;
    /** First page of the chapter. */
    face: FaceId;
}

export const CHAPTERS: Chapter[] = [
    { key: 'cover', numeral: '', title: 'Cover', face: 'cover' },
    { key: 'contents', numeral: '', title: 'Contents', face: 'contents' },
    { key: 'i', numeral: 'I', title: 'Two Voices', face: 'voice-backend' },
    { key: 'ii', numeral: 'II', title: 'Schooling', face: 'education' },
    { key: 'iii', numeral: 'III', title: 'The Toolkit', face: 'skills' },
    { key: 'iv', numeral: 'IV', title: 'The Work', face: 'work' },
    { key: 'v', numeral: 'V', title: 'Apprenticeships', face: 'experience' },
    { key: 'vi', numeral: 'VI', title: 'Distinctions', face: 'achievements' },
    { key: 'vii', numeral: 'VII', title: 'Correspondence', face: 'correspondence' },
    { key: 'colophon', numeral: '', title: 'Colophon', face: 'colophon' },
];

export const chapterOf = (key: ChapterKey) =>
    CHAPTERS.find((c) => c.key === key) ?? {
        key,
        numeral: '',
        title: key === 'front' ? 'Front Matter' : 'Cover',
        face: 'cover' as FaceId,
    };
