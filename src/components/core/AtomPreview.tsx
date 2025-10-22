'use client';

import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three-fiber';
import { Sphere } from '@react-three/drei';
import { Color } from 'three'; // <-- 1. REMOVED UNUSED 'THREE' IMPORT

// ... (bohrShells, Shell, and Electron components remain the same) ...

const bohrShells = [2, 8, 18, 32, 32, 18, 8];

interface ShellProps {
  shellIndex: number;
  electronCount: number;
  electronColor: Color;
}

function Shell({ shellIndex, electronCount, electronColor }: ShellProps) {
  const radius = (shellIndex + 1) * 0.7;
  const electrons = Array.from({ length: electronCount });
  const speed = 0.5 / (shellIndex + 1);

  return (
    <group>
      {/* The orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius, 64]} />
        <meshBasicMaterial color="#00FFFF" transparent opacity={0.3} side={2} />
      </mesh>
      
      {/* Electrons in this shell */}
      {electrons.map((_, i) => (
        <Electron
          key={i}
          radius={radius}
          speed={speed}
          offset={(i / electronCount) * Math.PI * 2}
          color={electronColor}
        />
      ))}
    </group>
  );
}

interface ElectronProps {
  radius: number;
  speed: number;
  offset: number;
  color: Color;
}

function Electron({ radius, speed, offset, color }: ElectronProps) {
  const ref = React.useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    ref.current.position.x = Math.cos(time * speed + offset) * radius;
    ref.current.position.z = Math.sin(time * speed + offset) * radius;
  });

  return (
    <Sphere ref={ref} args={[0.1, 16, 16]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />
    </Sphere>
  );
}


function AtomScene({ protons, neutrons, electrons, isAntimatter }: {
  protons: number;
  neutrons: number;
  electrons: number;
  isAntimatter: boolean;
}) {
  const { shells, nucleusSize, colors } = useMemo(() => {
    let e = electrons;
    const shells = bohrShells.map(capacity => {
      const count = Math.min(e, capacity);
      e -= count;
      return count;
    }).filter(count => count > 0);

    const nucleusSize = Math.max(0.2, Math.cbrt(protons + neutrons) * 0.1);
    
    const colors = {
      proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'),
      neutron: new Color('#888888'),
      electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'),
    };

    return { shells, nucleusSize, colors };
  }, [protons, neutrons, electrons, isAntimatter]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      
      {/* Nucleus */}
      <group>
        {/* We can't easily show individual protons/neutrons in a preview */}
        <Sphere args={[nucleusSize, 32, 32]}>
          <meshStandardMaterial
            color={colors.proton}
            emissive={colors.proton}
            emissiveIntensity={0.5}
          />
        </Sphere>
      </group>

      {/* Electron Shells (Bohr Model) */}
      {shells.map((count, index) => (
        <Shell
          key={index}
          shellIndex={index}
          electronCount={count}
          electronColor={colors.electron}
        />
      ))}
    </>
  );
}

export default function AtomPreview({ protons, neutrons, electrons, isAntimatter }: {
  protons: number;
  neutrons: number;
  electrons: number;
  isAntimatter: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <React.Suspense fallback={null}>
        <AtomScene 
          protons={protons} 
          neutrons={neutrons} 
          electrons={electrons} 
          isAntimatter={isAntimatter} 
        />
      </React.Suspense>
    </Canvas>
  );
}

