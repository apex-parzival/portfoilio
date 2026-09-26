import * as THREE from 'three';
import type { Flight } from '../flight';

export interface ActorFrame {
    /** Seconds, for the parts that keep their own time: wings, rotors, flames. */
    time: number;
    dt: number;
    flight: Flight;
}

/**
 * Something that turns pages. Whatever it is, it has a hand, and the layer
 * places it so that hand lands on the page's edge — the rest of the body
 * hangs off it however the pose has it hanging.
 */
export interface Actor {
    name: 'fairy' | 'robot';
    parity: number;
    /** Placed, scaled and pitched by the layer. */
    root: THREE.Group;
    /** Goes on the grip. */
    hand: THREE.Object3D;
    /** Body centre, for the shadow it throws on the page. */
    center: THREE.Object3D;
    /** Design px per model unit. */
    unit: number;
    /** Turned a little toward the viewer, radians, for a three-quarter view. */
    yaw: number;
    /** Animate for this frame. Runs after the root is rotated, before it is placed. */
    pose(f: ActorFrame): void;
    setOpacity(o: number): void;
}

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const q1 = new THREE.Quaternion();
const q2 = new THREE.Quaternion();
const turn = new THREE.Quaternion();

/**
 * Swing `bone` so that the line from it to `tip` points along `dir` (world
 * space). Works whatever the bone's own axes are, which saves knowing how a
 * rig was built — only where its joints end up.
 */
export const aimBone = (bone: THREE.Object3D, tip: THREE.Object3D, dir: THREE.Vector3) => {
    bone.updateWorldMatrix(true, true);
    const from = bone.getWorldPosition(v1);
    const current = tip.getWorldPosition(v2).sub(from).normalize();
    turn.setFromUnitVectors(current, dir);
    const world = bone.getWorldQuaternion(q1).premultiply(turn);
    const parent = bone.parent ? bone.parent.getWorldQuaternion(q2) : q2.identity();
    bone.quaternion.copy(parent.invert().multiply(world));
    bone.updateWorldMatrix(false, true);
};

/** Every material under `root`, each remembering the opacity it was made with. */
export const fadeable = (root: THREE.Object3D) => {
    const mats = new Set<THREE.Material>();
    root.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (!m) return;
        for (const mat of Array.isArray(m) ? m : [m]) {
            // Parts that animate their own opacity fold the fade in themselves.
            if (mat.userData.selfFade) continue;
            mat.userData.baseOpacity ??= mat.opacity;
            mat.transparent = true;
            mats.add(mat);
        }
    });
    return (o: number) => {
        for (const mat of mats) mat.opacity = mat.userData.baseOpacity * o;
    };
};

/** A soft radial dab of colour — glows, shadows, sparkles. */
export const radialTexture = (inner: string, outer: string) => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

/** A capsule from a to b — limbs, mostly. */
export const capsuleBetween = (a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) => {
    const len = a.distanceTo(b);
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len), 6, 14), mat);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return mesh;
};

/**
 * A tube that narrows along its length — a lock of hair rather than a rod.
 * TubeGeometry lays its vertices out ring by ring, so each ring is simply
 * drawn in toward the curve by how far along it sits.
 */
export const taperedTube = (curve: THREE.Curve<THREE.Vector3>, radius: number, tip = 0.12, segments = 24) => {
    const radial = 8;
    const geo = new THREE.TubeGeometry(curve, segments, radius, radial);
    const pos = geo.attributes.position;
    const centre = new THREE.Vector3();
    const p = new THREE.Vector3();
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        curve.getPointAt(t, centre);
        const k = 1 - (1 - tip) * t * t;
        for (let j = 0; j <= radial; j++) {
            const idx = i * (radial + 1) + j;
            p.fromBufferAttribute(pos, idx).sub(centre).multiplyScalar(k).add(centre);
            pos.setXYZ(idx, p.x, p.y, p.z);
        }
    }
    geo.computeVertexNormals();
    return geo;
};
