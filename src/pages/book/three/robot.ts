import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ROBOT } from '../flight';
import { aimBone, fadeable, radialTexture, type Actor, type ActorFrame } from './rig';

/**
 * The robot: "RobotExpressive" by Tomás Laulhé (CC0 1.0), as published in the
 * three.js examples, with its fourteen animations. Here it is resurfaced in the
 * book's palette — enamelled in the rubric orange over brushed steel — given a
 * jetpack to fly with, and its right arm is raised onto the page's edge on top
 * of whatever animation is playing.
 */

/** Its height on the page, design px. */
const HEIGHT = 108;

/** Enamel, steel and smoked glass, in place of the model's flat colours. */
const resurface = (name: string): THREE.MeshPhysicalMaterial => {
    if (name === 'Main') {
        return new THREE.MeshPhysicalMaterial({
            color: '#c94a1b',
            metalness: 0.35,
            roughness: 0.3,
            clearcoat: 0.9,
            clearcoatRoughness: 0.16,
        });
    }
    if (name === 'Grey') {
        return new THREE.MeshPhysicalMaterial({ color: '#c9ced4', metalness: 1, roughness: 0.3 });
    }
    return new THREE.MeshPhysicalMaterial({
        color: '#14171b',
        metalness: 0.4,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
    });
};

export const loadRobot = async (url: string): Promise<Actor> => {
    const gltf = await new GLTFLoader().loadAsync(url);
    const model = gltf.scene;

    model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const old = mesh.material as THREE.Material;
        mesh.material = resurface(old.name);
        old.dispose();
        mesh.frustumCulled = false;
    });

    const mixer = new THREE.AnimationMixer(model);
    const clip = (name: string) => {
        const c = THREE.AnimationClip.findByName(gltf.animations, name);
        if (!c) throw new Error(`robot: no animation ${name}`);
        return c;
    };
    const idle = mixer.clipAction(clip('Idle'));
    const wave = mixer.clipAction(clip('Wave'));
    idle.play();
    mixer.update(0);

    // Size it: a fixed height on the page, whatever units the file uses.
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model, true);
    const size = box.getSize(new THREE.Vector3());
    const unit = HEIGHT / size.y;

    // The loader sanitises node names ("UpperArm.R" arrives as "UpperArmR").
    const bone = (name: string) => {
        const b = model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(name));
        if (!b) throw new Error(`robot: no bone ${name}`);
        return b;
    };
    const upperArm = bone('UpperArm.R');
    const lowerArm = bone('LowerArm.R');
    const palm = bone('Palm2.R');
    const fingertip = bone('Middle2.R');
    const torso = bone('Torso');

    const root = new THREE.Group();
    root.add(model);

    // ── Jetpack, strapped to its back ────────────────────────────────────
    const pack = new THREE.Group();
    const h = size.y;
    const steel = new THREE.MeshPhysicalMaterial({ color: '#8d949c', metalness: 1, roughness: 0.34 });
    const tank = new THREE.MeshPhysicalMaterial({
        color: '#2a2f36',
        metalness: 0.5,
        roughness: 0.32,
        clearcoat: 0.8,
    });
    pack.add(new THREE.Mesh(new RoundedBoxGeometry(h * 0.2, h * 0.24, h * 0.1, 3, h * 0.03), tank));
    const flames: { outer: THREE.Mesh; inner: THREE.Mesh; glow: THREE.Sprite; x: number }[] = [];
    const flameOuter = new THREE.MeshBasicMaterial({ color: '#ff7a2a', transparent: true, opacity: 0.8, depthWrite: false });
    const flameInner = new THREE.MeshBasicMaterial({ color: '#fff1c4', transparent: true, opacity: 0.95, depthWrite: false });
    for (const x of [-1, 1]) {
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.035, h * 0.05, h * 0.07, 20, 1, true), steel);
        nozzle.position.set(x * h * 0.06, -h * 0.15, 0);
        pack.add(nozzle);
        const outer = new THREE.Mesh(new THREE.ConeGeometry(h * 0.045, h * 0.2, 18, 1, true), flameOuter.clone());
        outer.rotation.x = Math.PI;
        const inner = new THREE.Mesh(new THREE.ConeGeometry(h * 0.022, h * 0.11, 14, 1, true), flameInner.clone());
        inner.rotation.x = Math.PI;
        const glow = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: radialTexture('rgba(255,170,80,0.7)', 'rgba(255,120,40,0)'), depthWrite: false })
        );
        glow.scale.set(h * 0.3, h * 0.3, 1);
        for (const m of [outer.material, inner.material, glow.material] as THREE.Material[]) m.userData.selfFade = true;
        pack.add(outer, inner, glow);
        flames.push({ outer, inner, glow, x });
    }
    root.add(pack);

    const center = new THREE.Object3D();
    root.add(center);

    const fadeBody = fadeable(root);
    let fade = 1;
    let waving = false;
    const lift = new THREE.Vector3();
    const torsoAt = new THREE.Vector3();

    return {
        name: 'robot',
        parity: ROBOT,
        root,
        hand: fingertip,
        center,
        unit,
        yaw: -0.22,
        pose: ({ time, dt, flight }: ActorFrame) => {
            // Once the page is down it lets go and waves goodbye on the way out.
            const shouldWave = flight.phase === 'out';
            if (shouldWave !== waving) {
                waving = shouldWave;
                const [from, to] = waving ? [idle, wave] : [wave, idle];
                to.reset().play();
                from.crossFadeTo(to, 0.35, false);
            }
            mixer.update(dt);
            root.updateMatrixWorld(true);

            // Right arm up onto the page's edge, over whatever the clip is doing:
            // reaching up and a little toward the page (screen left, world −x).
            if (!waving) {
                lift.set(-0.62, 1, 0.1).normalize();
                aimBone(upperArm, lowerArm, lift);
                aimBone(lowerArm, palm, lift);
            }

            // The pack rides on its back; the flames flicker and roar.
            torso.getWorldPosition(torsoAt);
            root.worldToLocal(torsoAt);
            // (Root-local, so in the model's own units — the root does the scaling.)
            pack.position.set(torsoAt.x, torsoAt.y - h * 0.02, torsoAt.z - h * 0.13);
            center.position.set(torsoAt.x, torsoAt.y - h * 0.1, torsoAt.z);
            for (const f of flames) {
                const n = 0.8 + 0.2 * Math.sin(time * 41 + f.x * 3) + 0.12 * Math.sin(time * 67 + f.x);
                f.outer.scale.set(1, n, 1);
                f.outer.position.set(f.x * h * 0.06, -h * 0.15 - h * 0.1 * n - h * 0.035, 0);
                f.inner.scale.set(1, n, 1);
                f.inner.position.set(f.x * h * 0.06, -h * 0.15 - h * 0.055 * n - h * 0.035, 0);
                f.glow.position.set(f.x * h * 0.06, -h * 0.23, 0.01);
                (f.outer.material as THREE.MeshBasicMaterial).opacity = 0.8 * fade;
                (f.inner.material as THREE.MeshBasicMaterial).opacity = 0.95 * fade;
                f.glow.material.opacity = (0.75 + 0.25 * n) * fade;
            }
        },
        setOpacity: (o: number) => {
            fade = o;
            fadeBody(o);
        },
    };
};
