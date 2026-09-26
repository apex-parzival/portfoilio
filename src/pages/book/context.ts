import { createContext, useContext, useSyncExternalStore } from 'react';
import type { MotionValue } from 'framer-motion';
import type { FaceId } from './timeline';

/**
 * Which pages have been on screen at least once.
 *
 * Flourishes (figures inking in, numbers counting up) key off this rather than
 * what is on screen right now, so they play on first sight and then stay put —
 * a page leaving view mid-turn never blanks out its own drawing.
 *
 * It is a store rather than state because every page in the book subscribes:
 * as React state it would re-render all twenty-one of them each time a new
 * spread was reached, which dropped frames in the middle of a page turn.
 * Here a page re-renders only when its own answer changes.
 */
export class SeenFaces {
    private seen: Set<FaceId>;
    private listeners = new Set<() => void>();

    constructor(initial: readonly FaceId[] = []) {
        this.seen = new Set(initial);
    }

    has = (id: FaceId) => this.seen.has(id);

    add = (ids: readonly FaceId[]) => {
        let changed = false;
        for (const id of ids) {
            if (!this.seen.has(id)) {
                this.seen.add(id);
                changed = true;
            }
        }
        if (changed) for (const listen of this.listeners) listen();
    };

    /** How many of the book's pages have been read — for the colophon. */
    count = (of: readonly FaceId[]) => of.reduce((n, id) => n + (this.seen.has(id) ? 1 : 0), 0);

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };
}

export interface BookRuntime {
    /** Smoothed timeline position (see timeline.ts). */
    u: MotionValue<number>;
    /** Phone layout: one page on screen at a time. */
    single: boolean;
    seen: SeenFaces;
    goToFace: (id: FaceId) => void;
    next: () => void;
    prev: () => void;
    restart: () => void;
}

export const BookContext = createContext<BookRuntime | null>(null);

export const useBook = () => {
    const ctx = useContext(BookContext);
    if (!ctx) throw new Error('useBook must be used inside the book');
    return ctx;
};

/** Whether a page's flourishes should have played by now. */
export const useFacePlayed = (id: FaceId) => {
    const { seen } = useBook();
    return useSyncExternalStore(
        seen.subscribe,
        () => seen.has(id),
        () => false
    );
};
