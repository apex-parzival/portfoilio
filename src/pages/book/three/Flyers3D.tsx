import { useEffect, useRef } from 'react';
import { cancelFrame, frame } from 'framer-motion';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useBook } from '../context';
import { ANCHOR, flightAt, opacityAt, pitchAt } from '../flight';
import { buildFairy } from './fairy';
import { loadRobot } from './robot';
import { radialTexture, type Actor } from './rig';

/**
 * The page-turners, in real 3D: one transparent WebGL canvas laid over the
 * book, lit to match its lamp.
 *
 * Syncing a WebGL camera to a CSS 3D scene is fragile, so this doesn't try.
 * Crew places an invisible anchor on each flyer's grip *inside* the book's own
 * 3D scene; the browser projects it along with the pages, and here we simply
 * read where it landed and how big it is. A model is then posed, and placed so
 * that its hand sits on that point — the hand, not the body, is what is pinned
 * to the page.
 *
 * Nothing renders while both flyers are away. On machines without WebGL the
 * layer never reports ready, and the 2D models in flyers.tsx fly instead.
 */

const DEG = Math.PI / 180;
const ROBOT_URL = '/models/robot.glb';

const Flyers3D = ({ onReady }: { onReady: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { u } = useBook();
    const ready = useRef(onReady);
    useEffect(() => {
        ready.current = onReady;
    }, [onReady]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
        } catch {
            return; // No WebGL: the 2D flyers stay on.
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        // A room to reflect: without it, metal and glass render as flat grey.
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = env;
        scene.environmentIntensity = 0.55;
        pmrem.dispose();

        // The book's lamp: warm, high and to the left. A cool rim from behind
        // separates a figure from the page it is holding.
        const key = new THREE.DirectionalLight('#ffd9ac', 2.6);
        key.position.set(-0.8, 1.2, 1);
        const fill = new THREE.DirectionalLight('#b8c8ff', 0.45);
        fill.position.set(1, 0.2, 0.6);
        const rim = new THREE.DirectionalLight('#ffffff', 1.1);
        rim.position.set(0.4, 0.6, -1);
        scene.add(key, fill, rim, new THREE.HemisphereLight('#ffe9cc', '#2a1c10', 0.5));

        // Screen-space camera: one world unit is one CSS pixel, y up.
        const camera = new THREE.OrthographicCamera(0, 1, 0, -1, 1, 4000);
        camera.position.z = 2000;

        const shadowTex = radialTexture('rgba(20,12,4,0.55)', 'rgba(20,12,4,0)');
        const actors: { actor: Actor; shadow: THREE.Mesh }[] = [];
        const addActor = (actor: Actor) => {
            const shadow = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 1),
                new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
            );
            scene.add(actor.root, shadow);
            actors.push({ actor, shadow });
        };

        // The whole cast or none of it. The 2D flyers stay on until this layer
        // reports ready, so drawing any 3D flyer before then would put two of
        // the same one on the page at once.
        let disposed = false;
        let live = false;
        const fairy = buildFairy();
        loadRobot(ROBOT_URL)
            .then((robot) => {
                if (disposed) return;
                addActor(fairy);
                addActor(robot);
                live = true;
                ready.current();
            })
            .catch((err) => {
                // Stay on the 2D pair rather than show half a cast — but say why.
                console.warn('Book: 3D page-turners unavailable, using 2D.', err);
            });

        let width = 0;
        let height = 0;
        const fit = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (w === width && h === height) return;
            width = w;
            height = h;
            renderer.setSize(w, h, false);
            camera.right = w;
            camera.bottom = -h;
            camera.updateProjectionMatrix();
        };

        const grip = new THREE.Vector3();
        const handAt = new THREE.Vector3();
        const centerAt = new THREE.Vector3();
        const anchors = new Map<string, Element>();
        const anchorFor = (name: string) => {
            let el = anchors.get(name);
            if (!el || !el.isConnected) {
                el = document.querySelector(`[data-flyer-anchor="${name}"]`) ?? undefined;
                if (el) anchors.set(name, el);
            }
            return el;
        };

        let last = performance.now();
        let drewLast = false;

        // After framer has written this frame's transforms, so the anchors
        // are where the pages are.
        const tick = () => {
            if (!live) return;
            const now = performance.now();
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const time = now / 1000;
            fit();

            const v = u.get();
            const box = canvas.getBoundingClientRect();
            let drawing = false;

            for (const { actor, shadow } of actors) {
                const flight = flightAt(v, actor.parity);
                const o = opacityAt(flight);
                const el = o > 0.001 && flight ? anchorFor(actor.name) : undefined;
                if (!el || !flight) {
                    actor.root.visible = false;
                    shadow.visible = false;
                    continue;
                }
                const r = el.getBoundingClientRect();
                const scale = Math.min(r.width, r.height) / ANCHOR;
                grip.set(r.left + r.width / 2 - box.left, -(r.top + r.height / 2 - box.top), 0);

                // Turn, scale and pitch the figure, pose it, then slide it so
                // its hand lands on the grip. The sway pivots on the hand too.
                const sway = 2.4 * Math.sin(time * 2.7 + actor.parity * 1.7);
                actor.root.visible = true;
                actor.root.position.set(0, 0, 0);
                actor.root.scale.setScalar(scale * actor.unit);
                actor.root.rotation.set(0, actor.yaw, -(pitchAt(flight) + sway) * DEG, 'ZYX');
                actor.root.updateMatrixWorld(true);
                actor.pose({ time, dt, flight });
                actor.root.updateMatrixWorld(true);
                actor.hand.getWorldPosition(handAt);
                actor.root.position.set(grip.x - handAt.x, grip.y - handAt.y, -handAt.z);
                actor.root.updateMatrixWorld(true);
                actor.setOpacity(o);

                // Its shadow on the page: down and right of the lamp, stretched
                // along the body from the hand.
                actor.center.getWorldPosition(centerAt);
                const dx = centerAt.x - grip.x;
                const dy = centerAt.y - grip.y;
                shadow.visible = true;
                shadow.position.set(centerAt.x + 7 * scale, centerAt.y - 11 * scale, -1500);
                shadow.rotation.z = Math.atan2(dy, dx);
                shadow.scale.set(Math.hypot(dx, dy) * 2.1 + 20 * scale, 30 * scale, 1);
                (shadow.material as THREE.MeshBasicMaterial).opacity = 0.5 * o;

                drawing = true;
            }

            if (drawing || drewLast) renderer.render(scene, camera);
            drewLast = drawing;
        };
        frame.postRender(tick, true);

        return () => {
            disposed = true;
            cancelFrame(tick);
            renderer.dispose();
            env.dispose();
            scene.traverse((o) => {
                const mesh = o as THREE.Mesh;
                mesh.geometry?.dispose();
            });
        };
    }, [u]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
};

export default Flyers3D;
