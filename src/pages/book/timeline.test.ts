import { describe, expect, it } from 'vitest';
import {
    CHAPTERS,
    FACES,
    LEAF_COUNT,
    SPREAD_COUNT,
    TOTAL,
    bendAngle,
    buildStops,
    cameraX,
    castFrom,
    facesAtStop,
    isRestingAt,
    leafT,
    leafZ,
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
