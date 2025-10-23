'use client';

import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Color } from 'three';
import { useBuilder } from '@/hooks/useBuilder'; // Keep this for the main component

// Constants
const bohrShells = [2, 8, 18, 32, 32, 18, 8];

// --- Sub-Components ---

// ... (Electron, Nucleus, OrbitLine components remain the same correct version) ...
interface ElectronProps { /* ... */
    radius: number; speed: number; offset: number; color: Color; orbitAxis?: 'xy' | 'xz' | 'yz'; orbitRadius?: number;
}
function Electron({ radius, speed, offset, color, orbitAxis = 'xz', orbitRadius = 0 }: ElectronProps) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => { /* ... movement logic ... */
        const time = clock.getElapsedTime();
        if (ref.current) {
            const angle = time * speed + offset;
            const r = radius + Math.sin(time * speed * 2 + offset) * orbitRadius;
            switch (orbitAxis) {
                case 'xy': ref.current.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0); break;
                case 'yz': ref.current.position.set(0, Math.cos(angle) * r, Math.sin(angle) * r); break;
                case 'xz': default: ref.current.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r); break;
            }
        }
     });
    return (
        <Sphere ref={ref} args={[0.08, 16, 16]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false}/>
        </Sphere>
    );
}

interface NucleusProps { /* ... */
    protons: number; neutrons: number; protonColor: Color; neutronColor: Color;
}
function Nucleus({ protons, neutrons, protonColor, neutronColor }: NucleusProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const totalParticles = protons + neutrons;
    const radius = Math.max(0.15, Math.cbrt(totalParticles) * 0.08);
    const particles = useMemo(() => { /* ... particle distribution logic ... */
        const arr = [];
        const particleRadius = 0.05;
        for (let i = 0; i < totalParticles; i++) {
            const point = new THREE.Vector3();
            point.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
            if (point.length() === 0) point.set(1, 0, 0);
            point.normalize().multiplyScalar(Math.random() * (radius - particleRadius));
            arr.push({ position: point.toArray(), color: i < protons ? protonColor : neutronColor });
        }
        return arr;
    }, [protons, neutrons, protonColor, neutronColor, radius, totalParticles]);
    useFrame(() => { /* ... rotation logic ... */
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
            groupRef.current.rotation.x += 0.0005;
        }
     });
    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <Sphere key={i} args={[0.05, 16, 16]} position={p.position as [number, number, number]}>
                    <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.3} roughness={0.6}/>
                </Sphere>
            ))}
        </group>
    );
}

interface OrbitLineProps { /* ... */
    radius: number; electronColor: Color;
}
function OrbitLine({ radius, electronColor }: OrbitLineProps) {
    const lineObject = useMemo(() => { /* ... <primitive> logic ... */
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

    // Ensure dispose is null so R3F doesn't double-dispose when dependencies change
    // Also add key based on radius/color to force re-creation if needed, though useMemo should handle this
    return <primitive object={lineObject} dispose={null} key={`${radius}-${electronColor.getHexString()}`} />;
}


// --- REFACTORED AtomScene ---
// Accepts props, does NOT use useBuilder()
interface AtomSceneProps {
    protons: number;
    neutrons: number;
    electrons: number;
    isAntimatter: boolean;
    vizMode: 'bohr' | 'cloud';
}

function AtomScene({ protons, neutrons, electrons, isAntimatter, vizMode }: AtomSceneProps) {
    // NO useBuilder() call here
    const colors = useMemo(() => ({ /* ... color logic ... */
        proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'),
        neutron: new Color('#888888'),
        electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'),
    }), [isAntimatter]);

    const shells = useMemo(() => { /* ... shell logic ... */
        let remainingElectrons = electrons;
        return bohrShells.map(capacity => {
            const count = Math.min(remainingElectrons, capacity);
            remainingElectrons -= count;
            return count;
        }).filter(count => count > 0);
    }, [electrons]);

    return (
        <>
            {/* ... Lights ... */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color={colors.proton} />

            <Nucleus /* ... pass props ... */
                protons={protons}
                neutrons={neutrons}
                protonColor={colors.proton}
                neutronColor={colors.neutron}
            />

            {/* Use vizMode prop */}
            {vizMode === 'bohr' && shells.map((count, index) => { /* ... Bohr rendering ... */
                const radius = (index + 1) * 0.7;
                return (
                    <group key={`shell-${index}`}>
                        <OrbitLine radius={radius} electronColor={colors.electron} />
                        {Array.from({ length: count }).map((_, i) => (
                            <Electron
                                key={`electron-${index}-${i}`}
                                radius={radius}
                                speed={0.5 / (index + 1)}
                                offset={(i / count) * Math.PI * 2}
                                color={colors.electron}
                                orbitAxis="xz"
                            />
                        ))}
                    </group>
                );
             })}

            {vizMode === 'cloud' && Array.from({ length: electrons }).map((_, i) => { /* ... Cloud rendering ... */
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
// --- END REFACTOR ---


// --- Main Viewport Wrapper Component ---
export default function AtomViewport() {
    // Get builder state here in the parent
    const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();

    return (
        <Canvas camera={{ position: [0, 5, 12], fov: 50 }} className="bg-gray-950 rounded-lg">
             <color attach="background" args={['#050505']} />
            <Suspense fallback={null}>
                {/* Pass state down as props */}
                <AtomScene
                    protons={protons}
                    neutrons={neutrons}
                    electrons={electrons}
                    isAntimatter={isAntimatter}
                    vizMode={vizMode}
                />
                <OrbitControls />
            </Suspense>
        </Canvas>
    );
}