// FINAL VERSION - Enhanced visuals, correct structure, SMOOTHER animations
'use client';

// --- IMPORTS: Ensure all are present ---
import React, { useMemo, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Color, Vector3 } from 'three'; // Import Vector3 explicitly
import { useBuilder } from '@/hooks/useBuilder';
import { useGraphicsSettings } from '@/hooks/useGraphicsSettings';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
// --- END IMPORTS ---

// Constants
const bohrShells = [2, 8, 18, 32, 32, 18, 8];
const BASE_NUCLEUS_RADIUS = 0.15;
const NUCLEON_RADIUS_SCALE = 0.08;
const ELECTRON_RADIUS = 0.06;
const PARTICLE_SEGMENTS = 16;
const NUCLEON_RADIUS = 0.04;


// --- Sub-Components ---

// Represents a single electron sphere
interface ElectronProps {
    shellIndex: number;
    radius: number;
    speedFactor: number;
    offset: number;
    color: Color;
    vizMode: 'bohr' | 'cloud';
    electronIndex: number; // Add index for smoother cloud variations
}
function Electron({ shellIndex, radius, speedFactor, offset, color, vizMode, electronIndex }: ElectronProps) {
    const ref = useRef<THREE.Mesh>(null!);

    // Cloud specific properties (memoized) - Less random, more periodic
    const cloudProps = useMemo(() => ({
        // Base elliptical path variation (less extreme)
        xRadiusFactor: 0.9 + Math.random() * 0.2, // Between 0.9 and 1.1
        zRadiusFactor: 0.9 + Math.random() * 0.2,
        // Axis for slow, periodic wobble (based on electron index for variation)
        wobbleAxis: new Vector3(
             Math.sin(electronIndex * 0.5),
             Math.cos(electronIndex * 0.3),
             Math.sin(electronIndex * 0.7)
         ).normalize(),
        // Slightly randomized base speed (less extreme)
        speed: speedFactor * (0.9 + Math.random() * 0.2),
        // Phase offsets for wobble and pulse, based on index
        wobblePhase: electronIndex * 0.4,
        pulsePhase: electronIndex * 0.6,
    }), [radius, speedFactor, electronIndex]); // Recalculate if base props or index change

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (ref.current) {
            let angle: number, posX: number, posY: number, posZ: number;

            if (vizMode === 'bohr') {
                // Bohr: Faster speed for inner shells
                const speed = speedFactor / (shellIndex + 1);
                angle = time * speed + offset;
                posX = Math.cos(angle) * radius;
                posY = 0; // Flat orbit
                posZ = Math.sin(angle) * radius;
                ref.current.position.set(posX, posY, posZ);
            } else {
                // Cloud: Smoother variations
                angle = time * cloudProps.speed + offset;
                // Base ellipse
                posX = Math.cos(angle) * radius * cloudProps.xRadiusFactor;
                posY = 0;
                posZ = Math.sin(angle) * radius * cloudProps.zRadiusFactor;
                const basePos = new Vector3(posX, posY, posZ);

                // Apply a slow, periodic wobble instead of random tilt
                const wobbleAngle = Math.sin(time * 0.2 + cloudProps.wobblePhase) * 0.3; // Gentle wobble amplitude (0.3 radians)
                basePos.applyAxisAngle(cloudProps.wobbleAxis, wobbleAngle);

                // Add a gentle pulsing radius variation
                const pulse = Math.sin(time * 0.5 + cloudProps.pulsePhase) * radius * 0.05; // 5% radius pulse
                basePos.multiplyScalar(1 + pulse / radius);

                ref.current.position.copy(basePos);
            }
        }
    });

    return (
        <Sphere ref={ref} args={[ELECTRON_RADIUS, PARTICLE_SEGMENTS, PARTICLE_SEGMENTS]}>
            <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={3}
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.5}
                toneMapped={false}
            />
        </Sphere>
    );
}

// Nucleus: Slow down rotation
interface NucleusProps {
    protons: number;
    neutrons: number;
    protonColor: Color;
    neutronColor: Color;
}
function Nucleus({ protons, neutrons, protonColor, neutronColor }: NucleusProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const totalParticles = protons + neutrons;
    const radius = Math.max(BASE_NUCLEUS_RADIUS, Math.cbrt(totalParticles) * NUCLEON_RADIUS_SCALE);

    const particles = useMemo(() => {
        const arr = [];
        const packingFactor = 0.9;
        for (let i = 0; i < totalParticles; i++) {
            const point = new THREE.Vector3();
            const r = Math.random() * (radius - NUCLEON_RADIUS) * packingFactor;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            point.setFromSphericalCoords(r, phi, theta);
            arr.push({ position: point.toArray(), color: i < protons ? protonColor : neutronColor });
        }
        return arr;
    }, [protons, /* removed neutrons */ protonColor, neutronColor, radius, totalParticles]);

    useFrame(() => {
        if (groupRef.current) {
            // --- FIX: Slower rotation ---
            groupRef.current.rotation.y += 0.0005; // Halved speed
            groupRef.current.rotation.x += 0.00025; // Halved speed
            // --- END FIX ---
        }
     });

    return (
        <group ref={groupRef}>
            {/* Render each proton/neutron sphere */}
            {particles.map((p, i) => (
                <Sphere key={i} args={[NUCLEON_RADIUS, PARTICLE_SEGMENTS, PARTICLE_SEGMENTS]} position={p.position as [number, number, number]}>
                    <meshPhysicalMaterial
                        color={p.color}
                        emissive={p.color}
                        emissiveIntensity={0.2}
                        roughness={0.6}
                        metalness={0.1}
                        clearcoat={0.1}
                    />
                </Sphere>
            ))}
        </group>
    );
}

// OrbitLine: Remains the same (<primitive> fix)
interface OrbitLineProps {
    radius: number;
    electronColor: Color;
}
function OrbitLine({ radius, electronColor }: OrbitLineProps) {
    const lineObject = useMemo(() => {
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
            opacity: 0.15,
            linewidth: 0.5,
        });
        return new THREE.Line(geometry, material);
    }, [radius, electronColor]);

    useEffect(() => {
        return () => {
            if (lineObject) {
                lineObject.geometry?.dispose();
                if (Array.isArray(lineObject.material)) {
                    lineObject.material.forEach(m => m?.dispose());
                } else {
                    lineObject.material?.dispose();
                }
            }
        }
    }, [lineObject]);

    return <primitive object={lineObject} dispose={null} />;
}


// Refactored AtomScene: Pass electronIndex to Electron
interface AtomSceneProps {
    protons: number;
    neutrons: number;
    electrons: number;
    isAntimatter: boolean;
    vizMode: 'bohr' | 'cloud';
}
function AtomScene({ protons, neutrons, electrons, isAntimatter, vizMode }: AtomSceneProps) {
    const colors = useMemo(() => ({
        proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'),
        neutron: new Color('#666666'),
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

    const atomKey = `${protons}-${neutrons}-${electrons}-${isAntimatter}-${vizMode}`;

    return (
        <Suspense fallback={null}>
            {/* Lighting */}
            <hemisphereLight intensity={0.3} groundColor="black" />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} distance={30} decay={1}/>
            <pointLight position={[-10, -10, -5]} intensity={0.8} color={colors.proton} distance={30} decay={1}/>
            <directionalLight position={[0, -5, 5]} intensity={0.3} color={colors.electron} />

            {/* Background */}
            {/* --- FIX: Slower stars --- */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
            {/* --- END FIX --- */}


            <group key={atomKey}>
                <Nucleus
                    protons={protons}
                    neutrons={neutrons}
                    protonColor={colors.proton}
                    neutronColor={colors.neutron}
                />

                {vizMode === 'bohr' && shells.map((count, index) => {
                    const radius = (index + 1) * 0.9;
                    return (
                        <group key={`shell-${index}`}>
                            <OrbitLine radius={radius} electronColor={colors.electron} />
                            {Array.from({ length: count }).map((_, i) => (
                                <Electron
                                    key={`electron-${index}-${i}`}
                                    shellIndex={index}
                                    radius={radius}
                                    speedFactor={1.5} // Base speed factor
                                    offset={(i / count) * Math.PI * 2}
                                    color={colors.electron}
                                    vizMode="bohr"
                                    electronIndex={i} // Pass index
                                />
                            ))}
                        </group>
                    );
                })}

                {vizMode === 'cloud' && Array.from({ length: electrons }).map((_, i) => {
                    let estimatedShell = 0; let countInShells = 0;
                    for(let s=0; s < bohrShells.length; s++) { countInShells += bohrShells[s]; if(i < countInShells) { estimatedShell = s; break; } }
                    const baseRadius = (estimatedShell + 1) * 0.7 + Math.random() * 0.4; // Slightly different randomness
                    const speedFactor = 0.8; // Slower base speed for cloud

                    return (
                        <Electron
                            key={`cloud-electron-${i}`}
                            shellIndex={estimatedShell}
                            radius={baseRadius}
                            speedFactor={speedFactor}
                            offset={Math.random() * Math.PI * 2} // Keep random start phase
                            color={colors.electron}
                            vizMode="cloud"
                            electronIndex={i} // Pass index
                        />
                    );
                })}
            </group>
        </Suspense>
    );
}

// --- Main Viewport Wrapper Component ---
export default function AtomViewport() {
    const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();
    const { settings: graphicsSetting } = useGraphicsSettings();

    return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-950"><p className="text-gray-500">Loading 3D Viewport...</p></div>}>
            <Canvas camera={{ position: [0, 5, 12], fov: 50 }} className="w-full h-full bg-black">
                <AtomScene
                    protons={protons}
                    neutrons={neutrons}
                    electrons={electrons}
                    isAntimatter={isAntimatter}
                    vizMode={vizMode}
                />
                <OrbitControls />
                {graphicsSetting === 'high' && (
                    <EffectComposer>
                        {/* --- FIX: Softer Bloom --- */}
                        <Bloom
                            luminanceThreshold={0.4} // Slightly higher threshold
                            luminanceSmoothing={0.95} // More smoothing
                            height={300}
                            intensity={0.6} // Reduced intensity
                        />
                        {/* --- END FIX --- */}
                    </EffectComposer>
                )}
            </Canvas>
        </Suspense>
    );
}

