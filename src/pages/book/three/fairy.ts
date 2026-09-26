import * as THREE from 'three';
import { FAIRY } from '../flight';
import { capsuleBetween, fadeable, radialTexture, taperedTube, type Actor, type ActorFrame } from './rig';

/**
 * A fairy, modelled here rather than loaded: a figurine of lathed and capsule
 * forms under physically based materials — skin with a soft sheen, a cotton
 * slip that ripples, hair that catches the lamp, and wings of iridescent film
 * with their veins drawn into a texture at load.
 *
 * She is built standing, facing −x (toward the page), in design px; the flight
 * group then tips her forward into a reach, and the layer hangs her from her
 * hands on the page's edge.
 */

const V = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);

const skin = new THREE.MeshPhysicalMaterial({
    color: '#f1c4a5',
    roughness: 0.5,
    sheen: 0.4,
    sheenColor: new THREE.Color('#ffcfb8'),
    sheenRoughness: 0.55,
    clearcoat: 0.08,
});
const hairMat = new THREE.MeshPhysicalMaterial({
    color: '#8f4219',
    roughness: 0.36,
    metalness: 0.05,
    sheen: 1,
    sheenColor: new THREE.Color('#ffb46a'),
    sheenRoughness: 0.3,
});
const dressMat = new THREE.MeshPhysicalMaterial({
    color: '#b9d4c8',
    roughness: 0.8,
    sheen: 1,
    sheenColor: new THREE.Color('#ffffff'),
    sheenRoughness: 0.45,
    side: THREE.DoubleSide,
});
const eyeMat = new THREE.MeshBasicMaterial({ color: '#2a1810' });

/** A wing outline, root at the origin and running along +x. */
interface WingShape {
    shape: THREE.Shape;
    min: THREE.Vector2;
    max: THREE.Vector2;
    /** Veins, as curves from the root toward the tip: [cp1, cp2, end]. */
    veins: [number, number, number, number, number, number][];
}

const upperWing = (): WingShape => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(8, 6.5, 24, 11.5, 38, 10.4);
    s.bezierCurveTo(46.5, 9.6, 48.5, 4, 44, 0.4);
    s.bezierCurveTo(36, -4.2, 18, -3.8, 0, -1.4);
    s.closePath();
    return {
        shape: s,
        min: new THREE.Vector2(0, -5),
        max: new THREE.Vector2(49, 12),
        veins: [
            [10, 4.5, 26, 8.5, 42, 7.6],
            [12, 2, 28, 4, 45, 2.4],
            [12, -0.8, 26, -1.8, 40, -1.6],
            [6, 1, 16, 2.6, 30, 2.2],
        ],
    };
};

const lowerWing = (): WingShape => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(7, 4, 18, 7, 29, 5.8);
    s.bezierCurveTo(35.5, 5.2, 36.5, 0.8, 32, -1.8);
    s.bezierCurveTo(24, -5.2, 12, -4, 0, -1.2);
    s.closePath();
    return {
        shape: s,
        min: new THREE.Vector2(0, -5),
        max: new THREE.Vector2(37, 8),
        veins: [
            [8, 2.6, 20, 4.8, 30, 4],
            [9, 0.6, 21, 1, 33, 0.2],
            [8, -1.2, 18, -2.6, 28, -2.4],
        ],
    };
};

/** The film: a pale iridescent wash with veins, written straight into a texture. */
const wingTexture = ({ shape, min, max, veins }: WingShape) => {
    const W = 512;
    const H = Math.round((W * (max.y - min.y)) / (max.x - min.x));
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d')!;
    const px = (x: number) => ((x - min.x) / (max.x - min.x)) * W;
    const py = (y: number) => (1 - (y - min.y) / (max.y - min.y)) * H;

    const path = new Path2D();
    const pts = shape.getPoints(64);
    pts.forEach((p, i) => (i ? path.lineTo(px(p.x), py(p.y)) : path.moveTo(px(p.x), py(p.y))));
    path.closePath();

    const grad = g.createLinearGradient(0, H, W, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0.62)');
    grad.addColorStop(0.4, 'rgba(214,240,255,0.34)');
    grad.addColorStop(0.75, 'rgba(232,214,255,0.26)');
    grad.addColorStop(1, 'rgba(255,214,236,0.22)');
    g.fillStyle = grad;
    g.fill(path);

    g.save();
    g.clip(path);
    g.strokeStyle = 'rgba(255,255,255,0.7)';
    g.lineWidth = 3;
    for (const [a, b, c2, d, e, f] of veins) {
        g.beginPath();
        g.moveTo(px(0), py(0));
        g.bezierCurveTo(px(a), py(b), px(c2), py(d), px(e), py(f));
        g.stroke();
    }
    // Cross-veins: the net that makes it read as a wing rather than a petal.
    g.lineWidth = 1.4;
    g.strokeStyle = 'rgba(255,255,255,0.4)';
    for (let x = 6; x < max.x - 2; x += 3.4) {
        g.beginPath();
        g.moveTo(px(x), py(max.y));
        g.lineTo(px(x + 1.6), py(min.y));
        g.stroke();
    }
    g.restore();

    g.strokeStyle = 'rgba(255,255,255,0.85)';
    g.lineWidth = 2.4;
    g.stroke(path);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
};

const wingGeometry = ({ shape, min, max }: WingShape) => {
    const geo = new THREE.ShapeGeometry(shape, 24);
    const uv = geo.attributes.uv;
    const pos = geo.attributes.position;
    for (let i = 0; i < uv.count; i++) {
        uv.setXY(i, (pos.getX(i) - min.x) / (max.x - min.x), (pos.getY(i) - min.y) / (max.y - min.y));
    }
    return geo;
};

const wingMaterial = (tex: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        roughness: 0.16,
        metalness: 0,
        iridescence: 1,
        iridescenceIOR: 1.32,
        iridescenceThicknessRange: [160, 640],
        clearcoat: 1,
        clearcoatRoughness: 0.08,
    });

interface Wing {
    pivot: THREE.Group;
    ghost: THREE.Group;
    /** Resting sweep, radians, and which side of the body. */
    rest: number;
    side: 1 | -1;
    phase: number;
}

export const buildFairy = (): Actor => {
    const root = new THREE.Group();
    const body = new THREE.Group();
    // Tipped forward into the reach: head toward the page, legs trailing.
    body.rotation.z = THREE.MathUtils.degToRad(58);
    root.add(body);

    // ── Legs, trailing — the far one bent at the knee ────────────────────
    const legs: { hip: THREE.Group; knee: THREE.Group; side: number }[] = [];
    for (const side of [1, -1]) {
        const hip = new THREE.Group();
        hip.position.set(0.6, 36, side * 2.1);
        const thigh = capsuleBetween(V(0, 0), V(0.6, -16), side > 0 ? 2.3 : 2.1, skin);
        const knee = new THREE.Group();
        knee.position.set(0.6, -16, 0);
        knee.rotation.z = side > 0 ? -0.08 : -0.55;
        const shin = capsuleBetween(V(0, 0), V(1.2, -14.5), 1.6, skin);
        const foot = capsuleBetween(V(1.2, -14.5), V(0.4, -19.5), 1.05, skin);
        knee.add(shin, foot);
        hip.add(thigh, knee);
        body.add(hip);
        legs.push({ hip, knee, side });
    }

    // ── Slip dress: bodice and a skirt swept back by the flight ──────────
    const bodice = new THREE.Mesh(
        new THREE.LatheGeometry(
            [V(0, 40), V(3.9, 40.4), V(4.4, 43), V(4.2, 46), V(4.9, 50), V(5.1, 52.4), V(4.3, 55), V(2.2, 56.7), V(0, 57.1)].map(
                (p) => new THREE.Vector2(p.x, p.y)
            ),
            28
        ),
        dressMat
    );
    bodice.scale.z = 0.72;
    body.add(bodice);

    const skirtGeo = new THREE.LatheGeometry(
        [V(4.4, 42), V(5.4, 38.5), V(6.8, 34.5), V(8.4, 30.5), V(9.8, 27.4), V(10.4, 26.4)].map(
            (p) => new THREE.Vector2(p.x, p.y)
        ),
        36
    );
    const skirtRest = Float32Array.from(skirtGeo.attributes.position.array);
    const skirt = new THREE.Mesh(skirtGeo, dressMat);
    skirt.scale.z = 0.8;
    body.add(skirt);

    // ── Arms raised overhead: after the tip-forward they reach for the page ─
    const hands: THREE.Vector3[] = [];
    for (const side of [1, -1]) {
        const shoulder = V(-0.4, 54.4, side * 4.7);
        const elbow = V(-2.2, 65, side * 3.6);
        const wrist = V(-3.2, 74.5, side * 2.6);
        body.add(capsuleBetween(shoulder, elbow, 1.45, skin));
        body.add(capsuleBetween(elbow, wrist, 1.2, skin));
        const hand = new THREE.Mesh(new THREE.SphereGeometry(1.35, 14, 10), skin);
        hand.position.set(-3.6, 76, side * 2.2);
        hand.scale.set(0.8, 1.25, 0.7);
        body.add(hand);
        hands.push(hand.position.clone());
    }
    const hand = new THREE.Object3D();
    hand.position.copy(hands[0]).add(hands[1]).multiplyScalar(0.5).add(V(-0.4, 1.4, 0));
    body.add(hand);

    // ── Neck, head in profile, face toward the page ──────────────────────
    body.add(capsuleBetween(V(0, 55.6), V(-0.3, 59.4), 1.45, skin));
    // Everything above the neck turns together: tipped back so she looks
    // ahead along her reach, not down at the desk.
    const headGroup = new THREE.Group();
    headGroup.position.set(-0.3, 58.4, 0);
    headGroup.rotation.z = THREE.MathUtils.degToRad(-30);
    body.add(headGroup);
    const at = (m: THREE.Object3D, x: number, y: number, z = 0) => {
        m.position.set(x + 0.3, y - 58.4, z);
        headGroup.add(m);
        return m;
    };

    const head = at(new THREE.Mesh(new THREE.SphereGeometry(5.1, 28, 20), skin), -0.3, 64);
    head.scale.set(0.96, 1.12, 0.9);
    at(new THREE.Mesh(new THREE.SphereGeometry(0.85, 10, 8), skin), -5.1, 63.4);
    for (const side of [1, -1]) {
        at(new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 6), eyeMat), -4.3, 65.2, side * 1.9);
    }
    const lips = at(new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6), new THREE.MeshPhysicalMaterial({ color: '#c96f63', roughness: 0.45 })), -4.7, 60.6);
    lips.scale.set(0.6, 0.5, 1.4);

    // Hair: a cap over the crown and back only, so the face stays clear, and
    // tapered locks that hang down her back — which, tipped into flight,
    // streams them out behind her.
    const cap = at(new THREE.Mesh(new THREE.SphereGeometry(5.45, 28, 20), hairMat), 2.4, 66.2);
    cap.scale.set(0.8, 1, 0.96);
    const strands: { mesh: THREE.Mesh; z: number }[] = [];
    for (const [z, r, len, wave] of [
        [-2.6, 1.9, 1, 1.2],
        [0, 2.2, 1.12, -1],
        [2.6, 1.8, 0.94, 0.9],
        [1.2, 1.3, 0.8, -0.6],
    ] as const) {
        const curve = new THREE.CatmullRomCurve3([
            V(3.6, 67.5, z),
            V(6 + wave, 60, z * 1.1),
            V(7 - wave, 52 - 4 * (len - 1), z * 1.2),
            V(8.4 + wave, 44 - 10 * (len - 1), z),
        ]);
        // The curve is in body coordinates; at(…, 0, 0) cancels the neck offset.
        const mesh = at(new THREE.Mesh(taperedTube(curve, r, 0.1), hairMat), 0, 0) as THREE.Mesh;
        strands.push({ mesh, z });
    }

    // ── Wings: two pairs, spread in a V behind her back ─────────────────
    const upper = upperWing();
    const lower = lowerWing();
    const upperMat = wingMaterial(wingTexture(upper));
    const lowerMat = wingMaterial(wingTexture(lower));
    const upperGeo = wingGeometry(upper);
    const lowerGeo = wingGeometry(lower);
    const ghostUpper = upperMat.clone();
    ghostUpper.opacity = 0.32;
    const ghostLower = lowerMat.clone();
    ghostLower.opacity = 0.32;

    const wings: Wing[] = [];
    for (const side of [1, -1] as const) {
        for (const [geo, mat, ghostMat, rest, y] of [
            [upperGeo, upperMat, ghostUpper, 0.62, 52.5],
            [lowerGeo, lowerMat, ghostLower, -0.42, 50.5],
        ] as const) {
            const make = (m: THREE.Material) => {
                const g = new THREE.Group();
                g.position.set(2, y, side * 1.4);
                g.add(new THREE.Mesh(geo, m));
                body.add(g);
                return g;
            };
            wings.push({ pivot: make(mat), ghost: make(ghostMat), rest, side, phase: side > 0 ? 0 : 0.18 });
        }
    }

    // A warm aura: she gives off a little light of her own.
    const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: radialTexture('rgba(255,214,160,0.55)', 'rgba(255,190,120,0)'),
            depthWrite: false,
        })
    );
    glow.material.userData.selfFade = true;
    glow.scale.set(96, 74, 1);
    glow.position.set(2, 50, -12);
    body.add(glow);

    // Pollen, shaken off the wings as she goes.
    const dust = new THREE.SpriteMaterial({
        map: radialTexture('rgba(255,236,190,1)', 'rgba(255,220,150,0)'),
        depthWrite: false,
    });
    const motes = Array.from({ length: 10 }, (_, i) => {
        const s = new THREE.Sprite(dust.clone());
        s.material.userData.selfFade = true;
        s.userData.seed = i * 1.37;
        body.add(s);
        return s;
    });

    const center = new THREE.Object3D();
    center.position.set(1, 44, 0);
    body.add(center);

    const fadeBody = fadeable(root);
    let fade = 1;
    const setOpacity = (o: number) => {
        fade = o;
        fadeBody(o);
    };
    const pos = skirtGeo.attributes.position;
    const flap = (w: Wing, time: number) =>
        w.rest + 0.42 * Math.sin((time * 7.2 + w.phase) * Math.PI * 2);

    return {
        name: 'fairy',
        parity: FAIRY,
        root,
        hand,
        center,
        unit: 1.3,
        yaw: 0.34,
        pose: ({ time }: ActorFrame) => {
            // Wings beat about their roots; each ghost trails a quarter-beat
            // behind — the after-image a fast wing leaves.
            for (const w of wings) {
                w.pivot.rotation.set(0, w.side * -0.38, flap(w, time));
                w.ghost.rotation.set(0, w.side * -0.38, flap(w, time - 0.034));
            }
            // A slow flutter kick.
            for (const { hip, knee, side } of legs) {
                hip.rotation.z = 0.12 * Math.sin(time * 2.6 + (side > 0 ? 0 : Math.PI));
                knee.rotation.z = (side > 0 ? -0.08 : -0.55) - 0.1 * Math.sin(time * 2.6 + 0.8 + (side > 0 ? 0 : Math.PI));
            }
            // The hem ripples in the wind of the flight.
            for (let i = 0; i < pos.count; i++) {
                const x0 = skirtRest[i * 3];
                const y0 = skirtRest[i * 3 + 1];
                const z0 = skirtRest[i * 3 + 2];
                const d = THREE.MathUtils.clamp((42 - y0) / 16, 0, 1);
                const sweep = d * d * 7;
                const ripple = d * 1.1 * Math.sin(time * 6.5 + Math.atan2(z0, x0) * 3 + y0 * 0.4);
                pos.setXYZ(i, x0 + sweep + ripple * 0.5, y0 + ripple * 0.35, z0);
            }
            pos.needsUpdate = true;
            // Hair lifts and settles.
            for (const s of strands) {
                s.mesh.rotation.z = 0.05 * Math.sin(time * 3.1 + s.z);
            }
            headGroup.rotation.z = THREE.MathUtils.degToRad(-30) + 0.04 * Math.sin(time * 1.3);
            // Pollen drifts back along her wake and fades.
            for (const m of motes) {
                const k = (time * 0.45 + m.userData.seed) % 1;
                m.position.set(14 + k * 34, 48 - k * 18 + 3 * Math.sin(m.userData.seed * 5), 2 * Math.sin(m.userData.seed * 9));
                const size = 2.2 * (1 - k);
                m.scale.set(size, size, 1);
                m.material.opacity = fade * (1 - k);
            }
            glow.material.opacity = fade * (0.85 + 0.15 * Math.sin(time * 4.3));
        },
        setOpacity,
    };
};
