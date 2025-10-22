'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// This component represents a single orbiting electron
function Electron({ radius = 2.5, speed = 2 }) {
    const ref = useRef<THREE.Mesh>(null!);

    // useFrame is a hook that runs on every rendered frame
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed;
        ref.current.position.x = radius * Math.cos(t);
        ref.current.position.z = radius * Math.sin(t);
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
    );
}

// This is the main scene component
function AtomScene() {
    return (
        <>
            {/* Ambient light to softly illuminate the scene */}
            <ambientLight intensity={0.5} />
            {/* Point light in the center to make the nucleus glow */}
            <pointLight position={[0, 0, 0]} color="#9f00ff" intensity={50} distance={5} />

            {/* Nucleus */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="#9f00ff" emissive="#9f00ff" emissiveIntensity={1} roughness={0.5} />
            </mesh>

            {/* Electron Orbits */}
            <Electron radius={2.5} speed={1.5} />
            <group rotation-x={Math.PI / 4}>
                <Electron radius={2.7} speed={1.2} />
            </group>
             <group rotation-y={Math.PI / 3} rotation-x={-Math.PI / 6}>
                <Electron radius={3} speed={0.9} />
            </group>
        </>
    );
}

// The final component that wraps our scene in a Canvas
export default function AnimatedAtom() {
    return (
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
             {/* Stars for a nice space background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <AtomScene />
            {/* Optional controls to let the user pan and zoom the scene */}
            {/* <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} /> */}
        </Canvas>
    );
}
