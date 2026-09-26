import { describe, expect, it } from 'vitest';
import {
    CHAPTERS,
    FACES,
    LEAF_COUNT,
    PAGE_W,
    SPREAD_COUNT,
    STRIPS,
    TOTAL,
    bendAngle,
    buildStops,
    cameraX,
    castFrom,
    facesAtStop,
    isRestingAt,
    leafT,
    leafZ,
    pageEdge,
    pageHinges,
    stopForFace,
    turnEnd,
    turnStart,
    turningLeaf,
} from './timeline';

const samples = (step = 0.005) => {
    const out: number[] = [];
    for (let u = 0; u <= TOTAL; u += step) out.push(u);
    return out;
};

describe('book timeline', () => {
    it('turns every leaf fully, one at a time', () => {
        for (let i = 0; i < LEAF_COUNT; i++) {
            expect(leafT(i, turnStart(i))).toBe(0);
            expect(leafT(i, turnEnd(i))).toBe(1);
            if (i > 0) expect(turnStart(i)).toBeGreaterThan(turnEnd(i - 1));
        }
        expect(turnEnd(LEAF_COUNT - 1)).toBeLessThan(TOTAL);
    });

    it('never has two leaves in motion at once', () => {
        for (const u of samples()) {
            const moving = Array.from({ length: LEAF_COUNT }, (_, i) => leafT(i, u)).filter((t) => t > 0 && t < 1);
            expect(moving.length).toBeLessThanOrEqual(1);
        }
    });

    it('stacks a leaf above its neighbours on whichever side it lies', () => {
        for (let i = 1; i < LEAF_COUNT; i++) {
            // Unturned: earlier leaves sit higher on the right-hand stack.
            expect(leafZ(i - 1, 0)).toBeGreaterThan(leafZ(i, 0));
            // Turned: later leaves sit higher on the left-hand stack.
            expect(leafZ(i, 1)).toBeGreaterThan(leafZ(i - 1, 1));
        }
    });

    it('moves the camera continuously, with no jumps between spreads', () => {
        for (const single of [false, true]) {
            let prev = cameraX(0, single);
            for (const u of samples(0.002)) {
                const x = cameraX(u, single);
                expect(Math.abs(x - prev)).toBeLessThan(2);
                prev = x;
            }
        }
    });

    it('bends a turning page only mid-turn, leading then trailing', () => {
        expect(bendAngle(0)).toBeCloseTo(0);
        expect(bendAngle(0.5)).toBeCloseTo(0);
        expect(bendAngle(1)).toBeCloseTo(0);
        expect(bendAngle(0.25)).toBeGreaterThan(0);
        expect(bendAngle(0.75)).toBeLessThan(0);
    });

    it('casts no shadow from a leaf at rest', () => {
        for (let i = 0; i < LEAF_COUNT; i++) {
            expect(castFrom(i, turnStart(i), 'right')).toBe(0);
            expect(castFrom(i, turnEnd(i), 'left')).toBe(0);
        }
    });
});

describe('the turning page on screen', () => {
    it('puts the free edge at one fore-edge flat and the other when turned', () => {
        expect(pageEdge(0).x).toBeCloseTo(PAGE_W, 6);
        expect(pageEdge(0).z).toBeCloseTo(0, 6);
        expect(pageEdge(1).x).toBeCloseTo(-PAGE_W, 6);
        expect(pageEdge(1).z).toBeCloseTo(0, 6);
    });

    it('hinges the page into strips that always add up to its width', () => {
        for (const t of [0, 0.17, 0.4, 0.5, 0.83, 1]) {
            const pts = pageHinges(t);
            expect(pts).toHaveLength(STRIPS + 1);
            let run = 0;
            for (let k = 1; k < pts.length; k++) {
                run += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].z - pts[k - 1].z);
            }
            expect(run).toBeCloseTo(PAGE_W, 6);
        }
    });

    it('carries its edge over smoothly, toward the viewer and back down', () => {
        // A flyer's grip rides this point, so any jump here is a hand
        // letting go of the page. Steps vary with the page's speed, which
        // peaks mid-turn, but never by more than a steady sweep allows.
        const steps: number[] = [];
        let prev = pageEdge(0);
        for (let t = 0.002; t <= 1; t += 0.002) {
            const e = pageEdge(t);
            steps.push(Math.hypot(e.x - prev.x, e.z - prev.z));
            expect(e.z).toBeGreaterThanOrEqual(-1e-9);
            prev = e;
        }
        const mean = steps.reduce((a, b) => a + b, 0) / steps.length;
        expect(Math.max(...steps)).toBeLessThan(mean * 2.5);
        // Over the top it stands a page-width proud of the spine.
        expect(pageEdge(0.5).z).toBeCloseTo(PAGE_W, 0);
        expect(Math.abs(pageEdge(0.5).x)).toBeLessThan(1);
    });
});

describe('book stops', () => {
    it('has one stop per spread on wide screens and one per page on phones', () => {
        expect(buildStops(false)).toHaveLength(SPREAD_COUNT);
        expect(buildStops(true)).toHaveLength(1 + 2 * (SPREAD_COUNT - 1));
    });

    it('puts every stop where nothing is moving', () => {
        for (const single of [false, true]) {
            for (const stop of buildStops(single)) {
                expect(turningLeaf(stop.u)).toBe(-1);
                expect(isRestingAt(stop.u, single)).toBe(true);
            }
        }
    });

    it('can reach every page, and shows it when it gets there', () => {
        for (const single of [false, true]) {
            const stops = buildStops(single);
            for (const face of FACES) {
                const stop = stops[stopForFace(stops, face.id)];
                expect(facesAtStop(stop)).toContain(face.id);
            }
        }
    });
});

describe('book faces', () => {
    it('gives every leaf a front and a back, in reading order', () => {
        for (let i = 0; i < LEAF_COUNT; i++) {
            const faces = FACES.filter((f) => f.leaf === i);
            expect(faces.map((f) => f.side)).toEqual(['front', 'back']);
        }
        expect(FACES.at(-1)?.leaf).toBe('base');
    });

    it('numbers pages uniquely', () => {
        const folios = FACES.map((f) => f.folio).filter(Boolean);
        expect(new Set(folios).size).toBe(folios.length);
    });

    it('opens every chapter on one of its own pages', () => {
        for (const c of CHAPTERS) {
            expect(FACES.find((f) => f.id === c.face)?.chapter).toBe(c.key);
        }
    });
});
