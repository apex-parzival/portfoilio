import { describe, expect, it } from 'vitest';
import { FAIRY, ROBOT, flightAt, gripAt, opacityAt } from './flight';
import { LEAF_COUNT, LEAF_DZ, TOTAL, leafZ, pageEdge, turnEnd, turnStart } from './timeline';

const samples = (step = 0.004) => {
    const out: number[] = [];
    for (let u = 0; u <= TOTAL; u += step) out.push(u);
    return out;
};

describe('page-turners', () => {
    it('gives every page exactly one flyer, alternating, and leaves the cover alone', () => {
        for (let i = 0; i < LEAF_COUNT; i++) {
            const mid = (turnStart(i) + turnEnd(i)) / 2;
            const carrying = [FAIRY, ROBOT].filter((p) => flightAt(mid, p)?.phase === 'carry');
            if (i === 0) {
                expect(carrying).toEqual([]);
            } else {
                expect(carrying).toEqual([i % 2 === 1 ? FAIRY : ROBOT]);
            }
        }
    });

    it('never has one flyer in two places', () => {
        // Each flyer has one flight at a time: its windows for its own pages never overlap.
        for (const parity of [FAIRY, ROBOT]) {
            for (const u of samples()) {
                const f = flightAt(u, parity);
                if (f) expect(f.leaf % 2).toBe(parity);
            }
        }
    });

    it('holds the page by its free edge for the whole carry', () => {
        for (const u of samples()) {
            for (const parity of [FAIRY, ROBOT]) {
                const f = flightAt(u, parity);
                if (f?.phase !== 'carry') continue;
                const grip = gripAt(f);
                const edge = pageEdge(f.t);
                expect(grip.x).toBeCloseTo(edge.x, 9);
                // On the paper, a hair in front of it — never behind or through.
                const paper = edge.z + leafZ(f.leaf, f.t);
                expect(grip.z - paper).toBeGreaterThan(0);
                expect(grip.z - paper).toBeLessThan(5);
            }
        }
    });

    it('arrives on the corner and leaves from it without letting go', () => {
        // A jump across the page is a hand leaving it. Depth is the exception:
        // a leaf steps from one stack's height to the other's as it passes
        // vertical, and the grip — tied to the paper — steps with it.
        for (const parity of [FAIRY, ROBOT]) {
            let prev = gripAt(flightAt(0, parity));
            let prevActive = false;
            for (const u of samples(0.002)) {
                const f = flightAt(u, parity);
                const g = gripAt(f);
                if (f && prevActive) {
                    expect(Math.hypot(g.x - prev.x, g.y - prev.y)).toBeLessThan(6);
                    expect(Math.abs(g.z - prev.z)).toBeLessThan(LEAF_COUNT * LEAF_DZ + 2);
                }
                prev = g;
                prevActive = !!f;
            }
        }
    });

    it('is fully there while carrying, and fades only on the way in and out', () => {
        for (const u of samples()) {
            for (const parity of [FAIRY, ROBOT]) {
                const f = flightAt(u, parity);
                if (f?.phase === 'carry') expect(opacityAt(f)).toBe(1);
                if (!f) expect(opacityAt(f)).toBe(0);
            }
        }
    });
});
