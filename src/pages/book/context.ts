import { createContext, useContext } from 'react';
import type { MotionValue } from 'framer-motion';
import type { FaceId } from './timeline';

export interface BookRuntime {
    /** Smoothed timeline position (see timeline.ts). */
    u: MotionValue<number>;
    /** Phone layout: one page on screen at a time. */
    single: boolean;
    /** Pages on screen right now. */
    activeFaces: ReadonlySet<FaceId>;
    /**
     * Pages that have been on screen at least once. Flourishes (figures inking
     * in, numbers counting up) key off this rather than `activeFaces`, so they
     * play on first sight and then stay put — a page leaving view mid-turn
     * never blanks out its own drawing.
     */
    seenFaces: ReadonlySet<FaceId>;
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
export const useFacePlayed = (id: FaceId) => useBook().seenFaces.has(id);
