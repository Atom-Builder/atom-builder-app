'use client';

import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Color } from 'three';
import { useBuilder } from '@/hooks/useBuilder';

// Constants
const bohrShells = [2, 8, 18, 32, 32, 18, 8]; // Max electrons per shell

// --- Components ---

// Represents a single electron sphere
interface ElectronProps {
    radius: number;
    speed: number;
    offset: number;
    color: Color;
    orbitAxis?: 'xy' | 'xz' | 'yz'; // For cloud model
    orbitRadius?: number;          // For cloud model eccentricity
}

function Electron({ radius, speed, offset, color, orbitAxis = 'xz', orbitRadius = 0 }: ElectronProps) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (ref.current) {
            const angle = time * speed + offset;
            const r = radius + Math.sin(time * speed * 2 + offset) * orbitRadius; // Varying radius for cloud

            switch (orbitAxis) {
                case 'xy':
                    ref.current.position.x = Math.cos(angle) * r;
                    ref.current.position.y = Math.sin(angle) * r;
                    ref.current.position.z = 0;
                    break;
                case 'yz':
                    ref.current.position.x = 0;
                    ref.current.position.y = Math.cos(angle) * r;
                    ref.current.position.z = Math.sin(angle) * r;
                    break;
                case 'xz':
                default:
                    ref.current.position.x = Math.cos(angle) * r;
                    ref.current.position.y = 0;
                    ref.current.position.z = Math.sin(angle) * r;
                    break;
            }
        }
    });

    return (
        <Sphere ref={ref} args={[0.08, 16, 16]}>
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={3}
                toneMapped={false}
            />
        </Sphere>
    );
}

// Represents the nucleus (protons + neutrons)
interface NucleusProps {
    protons: number;
    neutrons: number;
    protonColor: Color;
    neutronColor: Color;
}

function Nucleus({ protons, neutrons, protonColor, neutronColor }: NucleusProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const totalParticles = protons + neutrons;
    const radius = Math.max(0.15, Math.cbrt(totalParticles) * 0.08); // Scale nucleus size

    // Memoize particle positions for performance
    const particles = useMemo(() => {
        const arr = [];
        const particleRadius = 0.05; // Smaller radius for individual nucleons

        for (let i = 0; i < totalParticles; i++) {
            const point = new THREE.Vector3();
            // Distribute points somewhat randomly within the nucleus sphere
            point.set(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            );
            if (point.length() === 0) point.set(1, 0, 0); // Avoid center
            point.normalize().multiplyScalar(Math.random() * (radius - particleRadius));

            arr.push({
                position: point.toArray(), // Store as array [x, y, z]
                color: i < protons ? protonColor : neutronColor,
            });
        }
        return arr;
    }, [protons, neutrons, radius, protonColor, neutronColor, totalParticles]); // Added missing dependencies


    useFrame(() => {
        // Subtle rotation for visual interest
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
            groupRef.current.rotation.x += 0.0005;
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <Sphere key={i} args={[0.05, 16, 16]} position={p.position as [number, number, number]}>
                    <meshStandardMaterial
                        color={p.color}
                        emissive={p.color}
                        emissiveIntensity={0.3}
                        roughness={0.6}
                    />
                </Sphere>
            ))}
        </group>
    );
}


// Draws the orbit line for Bohr model using <primitive>
interface OrbitLineProps {
    radius: number;
    electronColor: Color; // Pass color for the line
}
function OrbitLine({ radius, electronColor }: OrbitLineProps) {
    // --- THIS IS THE CORRECTED CODE ---
    const line = useMemo(() => {
        const points = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: electronColor,
            transparent: true,
            opacity: 0.2
        });
        // Cleanup function for useMemo
        return () => {
             geometry.dispose();
             material.dispose();
        };
    }, [radius, electronColor]); // Recalculate if radius or color changes

    // Create the THREE.Line object outside useMemo
     const lineObject = useMemo(() => {
        const points = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: electronColor, transparent: true, opacity: 0.2 });
        return new THREE.Line(geometry, material);
    }, [radius, electronColor]);

    // Use <primitive> to render the THREE.Line object
    // Ensure dispose is null
    return <primitive object={lineObject} dispose={null} />;
    // --- END CORRECTION ---
}


// Main Scene Component
function AtomScene() {
    const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();

    const colors = useMemo(() => ({
        proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'),
        neutron: new Color('#888888'),
        electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'),
    }), [isAntimatter]);

    const shells = useMemo(() => {
        let remainingElectrons = electrons;
        return bohrShells.map(capacity => {
            const count = Math.min(remainingElectrons, capacity);
            remainingElectrons -= count;
            return count;
        }).filter(count => count > 0);
    }, [electrons]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color={colors.proton} />

            <Nucleus
                protons={protons}
                neutrons={neutrons}
                protonColor={colors.proton}
                neutronColor={colors.neutron}
            />

            {vizMode === 'bohr' && shells.map((count, index) => {
                const radius = (index + 1) * 0.7;
                return (
                    <group key={`shell-${index}`}>
                        {/* Ensure OrbitLine uses the electronColor */}
                        <OrbitLine radius={radius} electronColor={colors.electron} />
                        {Array.from({ length: count }).map((_, i) => (
                            <Electron
                                key={`electron-${index}-${i}`}
                                radius={radius}
                                speed={0.5 / (index + 1)}
                                offset={(i / count) * Math.PI * 2}
                                color={colors.electron}
                                orbitAxis="xz" // Bohr model orbits on XZ plane
                            />
                        ))}
                    </group>
                );
            })}

            {vizMode === 'cloud' && Array.from({ length: electrons }).map((_, i) => {
                const baseRadius = 1 + Math.random() * (shells.length || 1) * 0.5;
                const speed = 0.3 + Math.random() * 0.4;
                const offset = Math.random() * Math.PI * 2;
                const axis = ['xy', 'xz', 'yz'][Math.floor(Math.random() * 3)] as 'xy' | 'xz' | 'yz';
                const orbitEcc = Math.random() * baseRadius * 0.3;

                return (
                    <Electron
                        key={`cloud-electron-${i}`}
                        radius={baseRadius}
                        speed={speed}
                        offset={offset}
                        color={colors.electron}
                        orbitAxis={axis}
                        orbitRadius={orbitEcc}
                    />
                );
            })}
        </>
    );
}

// Viewport Wrapper Component
export default function AtomViewport() {
    return (
        <Canvas camera={{ position: [0, 5, 12], fov: 50 }} className="bg-gray-950 rounded-lg">
             <color attach="background" args={['#050505']} />
            <Suspense fallback={null}>
                <AtomScene />
                <OrbitControls />
            </Suspense>
        </Canvas>
    );
}

