'use client';

import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Color } from 'three';

// ... (Electron component remains the same) ...
const bohrShells = [2, 8, 18, 32, 32, 18, 8];

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


interface NucleusProps {
    protons: number;
    neutrons: number;
    protonColor: Color;
    neutronColor: Color;
}
function Nucleus({ protons, neutrons, protonColor, neutronColor }: NucleusProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const totalParticles = protons + neutrons;
    const radius = Math.max(0.15, Math.cbrt(totalParticles) * 0.08);

    const particles = useMemo(() => {
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
    // --- FIX: Removed unnecessary 'neutrons' dependency ---
    }, [protons, protonColor, neutronColor, radius, totalParticles]);
    // --- END FIX ---

    useFrame(() => {
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

// ... (OrbitLine, AtomScene, AtomPreview components remain the same) ...
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
     React.useEffect(() => { // Cleanup effect
         return () => {
             lineObject.geometry.dispose();
             lineObject.material.dispose();
         }
     }, [lineObject]);
    return <primitive object={lineObject} dispose={null} />;
}

interface AtomSceneProps { /* ... */
    protons: number; neutrons: number; electrons: number; isAntimatter: boolean;
}
function AtomScene({ protons, neutrons, electrons, isAntimatter }: AtomSceneProps) {
    const colors = useMemo(() => ({ /* ... */
        proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'),
        neutron: new Color('#888888'),
        electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'),
     }), [isAntimatter]);
    const shells = useMemo(() => { /* ... */
        let remainingElectrons = electrons;
        return bohrShells.map(capacity => {
            const count = Math.min(remainingElectrons, capacity);
            remainingElectrons -= count;
            return count;
        }).filter(count => count > 0);
     }, [electrons]);
    return (
        <> /* ... Scene content ... */
            <ambientLight intensity={0.6} />
            <pointLight position={[8, 8, 8]} intensity={1.5} />
            <pointLight position={[-8, -8, -8]} intensity={0.5} color={colors.proton} />
            <Nucleus protons={protons} neutrons={neutrons} protonColor={colors.proton} neutronColor={colors.neutron}/>
            {shells.map((count, index) => {
                 const radius = (index + 1) * 0.7;
                 return (
                    <group key={`shell-${index}`}>
                        <OrbitLine radius={radius} electronColor={colors.electron} />
                        {Array.from({ length: count }).map((_, i) => (
                            <Electron key={`electron-${index}-${i}`} radius={radius} speed={0.5 / (index + 1)} offset={(i / count) * Math.PI * 2} color={colors.electron} orbitAxis="xz"/>
                        ))}
                    </group>
                 );
            })}
        </>
    );
}

interface AtomPreviewProps { /* ... */
    protons: number; neutrons: number; electrons: number; isAntimatter: boolean;
}
export default function AtomPreview({ protons, neutrons, electrons, isAntimatter }: AtomPreviewProps) {
    return (
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
             <color attach="background" args={['#0a0a0a']} />
            <Suspense fallback={null}>
                <AtomScene protons={protons} neutrons={neutrons} electrons={electrons} isAntimatter={isAntimatter}/>
            </Suspense>
        </Canvas>
    );
}

