'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei'; // <-- 1. REMOVED UNUSED 'OrbitControls'
import * as THREE from 'three';

// Electron component
function Electron({ radius = 1, speed = 1 }) {
  const ref = useRef<THREE.Mesh>(null!);
  
  // 'time' will increase on every frame
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    ref.current.position.x = Math.cos(time * speed) * radius;
    ref.current.position.z = Math.sin(time * speed) * radius;
  });

  return (
    <Sphere ref={ref} args={[0.05, 16, 16]}>
      <meshStandardMaterial
        color="#00FFFF"
        emissive="#00FFFF"
        emissiveIntensity={2}
      />
    </Sphere>
  );
}

// Atom scene
function AtomScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      
      {/* Nucleus */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color="#9F00FF"
          emissive="#9F00FF"
          emissiveIntensity={1}
        />
      </Sphere>

      {/* Electrons */}
      <Electron radius={1} speed={1.5} />
      <Electron radius={1.5} speed={1} />
      <Electron radius={2} speed={0.5} />
    </>
  );
}

// Main component
export default function AnimatedAtom() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <AtomScene />
    </Canvas>
  );
}

