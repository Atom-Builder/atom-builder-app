'use client';

import React, { useMemo, useRef } from 'react'; // Added useRef
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { Color } from 'three';
import * as THREE from 'three'; // <-- THE FIX: Import the THREE namespace

// Electron calculation/rendering constants
const bohrShells = [2, 8, 18, 32, 32, 18, 8]; // Max electrons per shell

interface ShellProps {
    shellIndex: number;
    electronCount: number;
    electronColor: Color;
}

function Shell({ shellIndex, electronCount, electronColor }: ShellProps) {
    const radius = (shellIndex + 1) * 0.7; // Increase shell radius
    const electrons = Array.from({ length: electronCount });
    // Make outer electrons orbit slower for visual effect
    const speed = 0.5 / (shellIndex + 1);

    return (
        <group>
            {/* The orbit line - thin ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.005, radius + 0.005, 64]} /> {/* Thinner ring */}
                {/* Use electronColor for the orbit line */}
                <meshBasicMaterial color={electronColor} transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Render electrons for this shell */}
            {electrons.map((_, i) => (
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

interface ElectronProps {
    radius: number;
    speed: number;
    offset: number;
    color: Color;
}

function Electron({ radius, speed, offset, color }: ElectronProps) {
    // Use THREE.Mesh type for the ref
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (ref.current) {
            // Calculate position on the circle
            ref.current.position.x = Math.cos(time * speed + offset) * radius;
            ref.current.position.z = Math.sin(time * speed + offset) * radius;
            // Keep y position at 0 (on the plane)
            ref.current.position.y = 0;
        }
    });

    return (
        // Smaller electron sphere
        <Sphere ref={ref} args={[0.08, 16, 16]}>
            <meshStandardMaterial
                color={color}
                emissive={color} // Make electron glow
                emissiveIntensity={3} // Increase glow intensity
                toneMapped={false} // Ensure glow isn't overly affected by scene lighting
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
    // Calculate shell distribution, nucleus size, and colors based on props
    const { shells, nucleusSize, colors } = useMemo(() => {
        let remainingElectrons = electrons;
        const calculatedShells = bohrShells.map(capacity => {
            const count = Math.min(remainingElectrons, capacity);
            remainingElectrons -= count;
            return count;
        }).filter(count => count > 0); // Only keep shells with electrons

        // Basic nucleus size scaling - adjust as needed
        const calculatedNucleusSize = Math.max(0.15, Math.cbrt(protons + neutrons) * 0.08);

        // Define colors based on normal/antimatter
        const calculatedColors = {
            proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'), // Cyan/Magenta swap
            neutron: new Color('#888888'), // Neutrons remain grey
            electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'), // Magenta/Cyan swap
        };

        return { shells: calculatedShells, nucleusSize: calculatedNucleusSize, colors: calculatedColors };
    }, [protons, neutrons, electrons, isAntimatter]);

    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[8, 8, 8]} intensity={1.5} />
            <pointLight position={[-8, -8, -8]} intensity={0.5} color={colors.proton} />

            {/* Nucleus */}
            <group>
                {/* Simplified nucleus representation for preview */}
                <Sphere args={[nucleusSize, 32, 32]}>
                    <meshStandardMaterial
                        color={colors.proton} // Use proton color for nucleus representation
                        emissive={colors.proton}
                        emissiveIntensity={0.6}
                        roughness={0.4}
                        metalness={0.2}
                    />
                </Sphere>
            </group>

            {/* Electron Shells (Bohr Model for Preview) */}
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

// Main Preview Component
export default function AtomPreview({ protons, neutrons, electrons, isAntimatter }: {
    protons: number;
    neutrons: number;
    electrons: number;
    isAntimatter: boolean;
}) {
    return (
        // Set a background color matching the theme
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
             <color attach="background" args={['#0a0a0a']} /> {/* Dark background */}
            <React.Suspense fallback={null}>
                <AtomScene
                    protons={protons}
                    neutrons={neutrons}
                    electrons={electrons}
                    isAntimatter={isAntimatter}
                />
                 {/* <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} /> */}
            </React.Suspense>
        </Canvas>
    );
}