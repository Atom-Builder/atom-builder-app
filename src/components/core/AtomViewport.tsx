'use client';

import React from 'react'; // <-- THIS IS THE FIX. Add this line.
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useBuilder } from '@/hooks/useBuilder';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

// Helper function to calculate electron shell distribution
const calculateElectronShells = (electronCount: number): number[] => {
  const shells: number[] = [];
  let remainingElectrons = electronCount;
  // Simplified shell capacities for visual balance
  const capacities = [2, 8, 8, 18, 18, 32, 32]; 
  
  for (const capacity of capacities) {
    if (remainingElectrons <= 0) break;
    const electronsInShell = Math.min(remainingElectrons, capacity);
    shells.push(electronsInShell);
    remainingElectrons -= electronsInShell;
  }
  
  // If there are still electrons left (more than 118), dump them in the last shell
  if (remainingElectrons > 0) {
    if (shells.length < capacities.length) {
       shells.push(remainingElectrons);
    } else {
       shells[shells.length - 1] += remainingElectrons;
    }
  }
  return shells;
};

// --- UPDATED ELECTRON COMPONENT ---
const Electron = ({ shellRadius, index, totalInShell, vizMode }: {
  shellRadius: number;
  index: number;
  totalInShell: number;
  vizMode: 'bohr' | 'cloud';
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  
  // useMemo to create stable random values for the cloud model
  const { angleOffset, speed, orbitalPlane } = useMemo(() => {
    // This creates a random 3D rotation axis
    const randomAxis = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    
    // This creates a random angle to rotate around that axis
    const randomAngle = Math.random() * Math.PI;

    // This is the quaternion that defines the random orbital plane
    const plane = new THREE.Quaternion().setFromAxisAngle(randomAxis, randomAngle);

    return {
      angleOffset: (index / totalInShell) * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.2, // Each electron has a slightly different speed
      orbitalPlane: plane,
    };
  }, [index, totalInShell]); // These values are stable per electron

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const x = shellRadius * Math.cos(time * speed + angleOffset);
    const z = shellRadius * Math.sin(time * speed + angleOffset);

    // Start with a basic orbit on the XZ plane
    const position = new THREE.Vector3(x, 0, z);

    // --- VIZ MODE LOGIC ---
    if (vizMode === 'cloud') {
      // If "cloud", apply the random orbital plane rotation
      position.applyQuaternion(orbitalPlane);
    }
    // If "bohr", we don't apply the rotation, so it stays flat

    ref.current.position.copy(position);
  });

  const { isAntimatter } = useBuilder();
  // --- ANTIMATTER LOGIC: Flipped color ---
  const electronColor = isAntimatter ? "#FF0066" : "#00FFFF"; // Positron = red/pink

  return (
    <Sphere ref={ref} args={[0.08, 16, 16]}>
      {/* A material that glows */}
      <meshStandardMaterial color={electronColor} emissive={electronColor} emissiveIntensity={2} />
    </Sphere>
  );
};

// Component for a single Electron Shell (the orbit line)
const ElectronShell = ({ radius, vizMode }: { radius: number, vizMode: 'bohr' | 'cloud' }) => {
  const points = useMemo(() => {
    const p = [];
    // Create a circle from 64 points
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      p.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }
    return p;
  }, [radius]);

  // --- VIZ MODE LOGIC: Hide shells in cloud mode ---
  if (vizMode === 'cloud') {
    return null;
  }

  return (
    <line loop args={[new THREE.BufferGeometry().setFromPoints(points)]}>
      <lineBasicMaterial color="#0FF" transparent opacity={0.3} />
    </line>
  );
};

// Main Scene
const AtomScene = () => {
  const { atom, vizMode, isAntimatter } = useBuilder();
  
  // Calculate a dynamic nucleus size based on particle count
  const nucleusRadius = Math.max(0.2, 1 + (atom.protons + atom.neutrons - 1) * 0.02);

  const shells = useMemo(() => calculateElectronShells(atom.electrons), [atom.electrons]);

  // --- ANTIMATTER LOGIC: Flipped colors ---
  const protonColor = isAntimatter ? "#00FFFF" : "#FF0066"; // Anti-proton = blue
  const neutronColor = isAntimatter ? "#AA00FF" : "#9F00FF"; // Anti-neutron = slightly different purple

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      
      {/* Nucleus Group */}
      <group>
        {/* Protons */}
        {Array.from({ length: atom.protons }).map((_, i) => (
          // We give each particle a random position within the nucleus radius
          <Sphere key={`p-${i}`} args={[0.2, 16, 16]} position={[(Math.random() - 0.5) * nucleusRadius, (Math.random() - 0.5) * nucleusRadius, (Math.random() - 0.5) * nucleusRadius]}>
            <meshStandardMaterial color={protonColor} emissive={protonColor} emissiveIntensity={1} />
          </Sphere>
        ))}
        {/* Neutrons */}
        {Array.from({ length: atom.neutrons }).map((_, i) => (
          <Sphere key={`n-${i}`} args={[0.2, 16, 16]} position={[(Math.random() - 0.5) * nucleusRadius, (Math.random() - 0.5) * nucleusRadius, (Math.random() - 0.5) * nucleusRadius]}>
            <meshStandardMaterial color={neutronColor} emissive={neutronColor} emissiveIntensity={1} />
          </Sphere>
        ))}
      </group>

      {/* Electron Shells and Electrons */}
      {shells.map((electronCount, shellIndex) => {
        // Each shell is progressively further out
        const shellRadius = nucleusRadius + 1.5 + shellIndex * 1.5;
        return (
          <group key={`shell-${shellIndex}`}>
            <ElectronShell radius={shellRadius} vizMode={vizMode} />
            {Array.from({ length: electronCount }).map((_, electronIndex) => (
              <Electron
                key={`e-${shellIndex}-${electronIndex}`}
                shellRadius={shellRadius}
                index={electronIndex}
                totalInShell={electronCount}
                vizMode={vizMode} // Pass vizMode to electron
              />
            ))}
          </group>
        );
      })}
      
      {/* Camera controls */}
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
};

export default function AtomViewport() {
  return (
    <div className="w-full h-full rounded-2xl bg-black">
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
        {/* We wrap the scene in React Suspense in case 3D models need to load */}
        <React.Suspense fallback={null}>
          <AtomScene />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

