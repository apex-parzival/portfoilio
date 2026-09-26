import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { useBook } from './context';
import { ANCHOR, FAIRY, ROBOT, flightAt, gripAt, opacityAt, pitchAt } from './flight';
import { Drone, Fairy, FlyerDefs } from './flyers';

/**
 * Where the page-turners are, in the book's own 3D space.
 *
 * For each flyer this places an *anchor*: an invisible marker sitting exactly
 * on its grip point, inside the same preserve-3d scene as the pages. The WebGL
 * layer (three/Flyers3D) reads each anchor's position and size off the screen
 * every frame, which is how a model drawn on a flat canvas ends up with its
 * hand on a page that is swinging through 3D — the browser has already done
 * the projection.
 *
 * Until that layer is ready, and on machines where it cannot start, the 2D
 * models in flyers.tsx fly the same route instead.
 */

/** The 2D models' drawing box and the grip within it. */
const FLY_W = 120;
const FLY_H = 100;
const GRIP_X = 8;
const GRIP_Y = 40;

export const Crew = ({ drawn }: { drawn: boolean }) => (
    <>
        {drawn && <FlyerDefs />}
        <Flyer parity={FAIRY} name="fairy" model={drawn ? <Fairy /> : null} />
        <Flyer parity={ROBOT} name="robot" model={drawn ? <Drone /> : null} />
    </>
);

const Flyer = ({ parity, name, model }: { parity: number; name: string; model: ReactNode }) => {
    const { u } = useBook();
    const x = useTransform(u, (v) => gripAt(flightAt(v, parity)).x);
    const y = useTransform(u, (v) => gripAt(flightAt(v, parity)).y);
    const z = useTransform(u, (v) => gripAt(flightAt(v, parity)).z);

    return (
        <>
            <motion.div
                className="absolute pointer-events-none invisible"
                style={{ left: -ANCHOR / 2, top: -ANCHOR / 2, width: ANCHOR, height: ANCHOR, x, y, z }}
                data-flyer-anchor={name}
                aria-hidden="true"
            />
            {model && <Drawn parity={parity} x={x} y={y} z={z} model={model} />}
        </>
    );
};

/** The 2D fallback: the flat model, pitched about its grip. */
const Drawn = ({
    parity,
    x,
    y,
    z,
    model,
}: {
    parity: number;
    x: MotionValue<number>;
    y: MotionValue<number>;
    z: MotionValue<number>;
    model: ReactNode;
}) => {
    const { u } = useBook();
    const rotate = useTransform(u, (v) => pitchAt(flightAt(v, parity)));
    const opacity = useTransform(u, (v) => opacityAt(flightAt(v, parity)));
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
            <div className="bk-sway w-full h-full" style={{ transformOrigin: `${GRIP_X}px ${GRIP_Y}px` }}>
                {model}
            </div>
        </motion.div>
    );
};
