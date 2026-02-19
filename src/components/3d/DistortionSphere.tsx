import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const DistortionSphere = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Subtle rotation or movement
        meshRef.current.rotation.x = time * 0.1;
        meshRef.current.rotation.y = time * 0.15;
    });

    return (
        <Sphere args={[1, 64, 64]} scale={2.5}>
            <MeshDistortMaterial
                color="#ededed"
                attach="material"
                distort={0.4} // Strength, 0 disables the effect (default=1)
                speed={2} // Speed (default=1)
                roughness={0.2}
                metalness={0.9}
            />
        </Sphere>
    );
};
