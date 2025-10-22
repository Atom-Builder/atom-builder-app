'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Function to calculate Bohr model shells
const calculateShells = (electrons: number) => {
  const shells = [];
  let remaining = electrons;
  let n = 1;
  while (remaining > 0) {
    const capacity = 2 * n * n;
    const electronsInShell = Math.min(remaining, capacity);
    shells.push(electronsInShell);
    remaining -= electronsInShell;
    n++;
  }
  return shells;
};

// Simple atom scene for previews
const AtomScene = ({ protons, neutrons, electrons }: { protons: number, neutrons: number, electrons: number }) => {
  const shells = calculateShells(electrons);

  return (
    <>
      {/* Nucleus */}
      <group>
        {/* Protons */}
        {Array.from({ length: protons }).map((_, i) => (
          <Sphere key={`p-${i}`} args={[0.1, 8, 8]} position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5].map(p => p * 0.5) as [number, number, number]}>
            <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={1} />
          </Sphere>
        ))}
        {/* Neutrons */}
        {Array.from({ length: neutrons }).map((_, i) => (
          <Sphere key={`n-${i}`} args={[0.1, 8, 8]} position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5].map(p => p * 0.5) as [number, number, number]}>
            <meshStandardMaterial color="#AAAAAA" />
          </Sphere>
        ))}
      </group>

      {/* Electrons & Orbits */}
      {shells.map((count, shellIndex) => {
        const radius = 1.5 + shellIndex * 0.8;
        return Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * Math.PI * 2;
          return (
            <Sphere key={`e-${shellIndex}-${i}`} args={[0.05, 8, 8]} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
              <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={2} />
            </Sphere>
          );
        });
      })}
    </>
  );
};

// This is the main component to be exported
export default function AtomPreview({ p = 0, n = 0, e = 0 }: { p: number, n: number, e: number }) {
  return (
    <div className="w-full h-full cursor-pointer">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        dpr={[1, 2]} // Optimize for performance
        frameloop="demand" // Only render when needed
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <React.Suspense fallback={null}>
          <AtomScene protons={p} neutrons={n} electrons={e} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
