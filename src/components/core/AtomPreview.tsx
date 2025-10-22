'use client';

import React, { useMemo } from 'react';
// --- FIX: CORRECT IMPORT PATH ---
import { Canvas, useFrame } from '@react-three/fiber'; // Was '@react-three-fiber'
// --- END FIX ---
import { Sphere } from '@react-three/drei';
import { Color } from 'three'; 

// Bohr model constants
const bohrShells = [2, 8, 18, 32, 32, 18, 8]; // Electron capacity per shell

// --- Shell Component ---
interface ShellProps {
  shellIndex: number; // 0-based index
  electronCount: number; // Electrons specifically in this shell
  electronColor: Color;
}

function Shell({ shellIndex, electronCount, electronColor }: ShellProps) {
  const radius = (shellIndex + 1) * 0.7; // Increase radius for each shell
  const electronsInShell = Array.from({ length: electronCount });
  const speed = 0.5 / (shellIndex + 1); // Electrons move slower in outer shells

  return (
    <group>
      {/* Optional: Render the orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.005, radius + 0.005, 64]} /> {/* Thinner ring */}
        <meshBasicMaterial color={electronColor} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Render electrons for this shell */}
      {electronsInShell.map((_, i) => (
        <Electron
          key={i}
          radius={radius}
          speed={speed}
          // Distribute electrons evenly around the orbit
          offset={(i / electronCount) * Math.PI * 2} 
          color={electronColor}
        />
      ))}
    </group>
  );
}

// --- Electron Component ---
interface ElectronProps {
  radius: number; // Orbit radius
  speed: number;  // Orbit speed
  offset: number; // Starting angle offset
  color: Color;   // Color for this electron
}

function Electron({ radius, speed, offset, color }: ElectronProps) {
  // useRef to access the mesh object
  const ref = React.useRef<THREE.Mesh>(null!); 
  
  // useFrame runs on every rendered frame
  useFrame(({ clock }) => {
    if (!ref.current) return; // Guard clause
    const time = clock.getElapsedTime();
    // Calculate position using cosine and sine for circular motion
    ref.current.position.x = Math.cos(time * speed + offset) * radius;
    ref.current.position.z = Math.sin(time * speed + offset) * radius; 
    // Keep y position at 0 for planar Bohr model
    ref.current.position.y = 0; 
  });

  return (
    // Render the electron as a small sphere
    <Sphere ref={ref} args={[0.08, 16, 16]}> {/* Slightly smaller electron */}
      <meshStandardMaterial
        color={color}
        emissive={color} // Make it glow
        emissiveIntensity={3} // Increase glow intensity
        roughness={0.5}
        metalness={0.1}
      />
    </Sphere>
  );
}

// --- Atom Scene Component (Contains Nucleus and Shells) ---
interface AtomSceneProps {
  protons: number;
  neutrons: number;
  electrons: number;
  isAntimatter: boolean;
}

function AtomScene({ protons, neutrons, electrons, isAntimatter }: AtomSceneProps) {
  // useMemo recalculates only when dependencies change
  const { shellsData, nucleusSize, colors } = useMemo(() => {
    let remainingElectrons = electrons;
    // Calculate how many electrons are in each shell
    const shellsData = bohrShells.map(capacity => {
      const count = Math.min(remainingElectrons, capacity);
      remainingElectrons -= count;
      return count;
    }).filter(count => count > 0); // Only include shells with electrons

    // Basic nucleus size calculation (adjust multiplier as needed)
    const nucleusSize = Math.max(0.15, Math.cbrt(protons + neutrons) * 0.08); 
    
    // Define colors based on matter/antimatter state
    const colors = {
      proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'), // Cyan (anti), Magenta (matter)
      neutron: new Color('#888888'), // Gray
      electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'), // Magenta (anti), Cyan (matter)
    };

    return { shellsData, nucleusSize, colors };
  }, [protons, neutrons, electrons, isAntimatter]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} /> 
      <pointLight position={[5, 5, 10]} intensity={1.5} /> 
      <pointLight position={[-5, -5, -10]} intensity={0.5} color={colors.electron} />

      {/* Nucleus */}
      <group>
        <Sphere args={[nucleusSize, 32, 32]}>
          <meshStandardMaterial
            color={colors.proton} 
            emissive={colors.proton}
            emissiveIntensity={0.8} 
            roughness={0.4}
            metalness={0.2}
          />
        </Sphere>
      </group>

      {/* Electron Shells */}
      {shellsData.map((count, index) => (
        <Shell
          key={`shell-${index}`}
          shellIndex={index}
          electronCount={count}
          electronColor={colors.electron}
        />
      ))}
    </>
  );
}

// --- Main Exported AtomPreview Component ---
interface AtomPreviewProps {
  protons?: number;
  neutrons?: number;
  electrons?: number;
  isAntimatter?: boolean;
}

export default function AtomPreview({ 
  protons = 0, 
  neutrons = 0, 
  electrons = 0, 
  isAntimatter = false 
}: AtomPreviewProps) {
  
  // Ensure props are valid numbers, default to 0 if not
  const validProtons = Number.isFinite(protons) ? protons : 0;
  const validNeutrons = Number.isFinite(neutrons) ? neutrons : 0;
  const validElectrons = Number.isFinite(electrons) ? electrons : 0;
  
  // Calculate dynamic camera distance based on the number of shells needed
  const shellsNeeded = bohrShells.reduce((acc, capacity, index) => {
      if (acc.remaining <= 0) return acc;
      const countInShell = Math.min(acc.remaining, capacity);
      acc.remaining -= countInShell;
      if (countInShell > 0) acc.maxShellIndex = index;
      return acc;
  }, { remaining: validElectrons, maxShellIndex: -1 }).maxShellIndex;
  
  // Base distance + increase for each shell
  const cameraDistance = 8 + (shellsNeeded + 1) * 1.5; 

  return (
    <div className="w-full h-full bg-black rounded-lg"> {/* Ensure bg color */}
      <Canvas camera={{ position: [0, cameraDistance / 2 , cameraDistance], fov: 50 }}> 
       {/* Adjust camera Z based on calculated distance, slight upward angle */}
        <React.Suspense fallback={null}> {/* Suspense for potential async operations */}
          <AtomScene 
            protons={validProtons} 
            neutrons={validNeutrons} 
            electrons={validElectrons} 
            isAntimatter={isAntimatter} 
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

