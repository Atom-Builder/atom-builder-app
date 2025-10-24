// FINAL VERSION - Enhanced visuals and correct structure
'use client';

// --- IMPORTS: Ensure all are present ---
import React, { useMemo, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Color } from 'three';
import { useBuilder } from '@/hooks/useBuilder'; // Keep this for the main component
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
    shellIndex: number; // Used for Bohr speed calculation
    radius: number;
    speedFactor: number; // Base speed multiplier
    offset: number;
    color: Color;
    vizMode: 'bohr' | 'cloud';
}
function Electron({ shellIndex, radius, speedFactor, offset, color, vizMode }: ElectronProps) {
    const ref = useRef<THREE.Mesh>(null!);

    // Cloud specific random properties (memoized)
    const cloudProps = useMemo(() => ({
        // Elliptical path: randomize x/z radius slightly
        xRadius: radius * (0.8 + Math.random() * 0.4),
        zRadius: radius * (0.8 + Math.random() * 0.4),
        // Random tilt axis for 3D cloud effect
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        // Slightly randomized speed for cloud
        speed: speedFactor * (0.8 + Math.random() * 0.4),
    }), [radius, speedFactor]); // Only recalculate if radius/speedFactor changes

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (ref.current) {
            let angle: number, posX: number, posY: number, posZ: number;

            if (vizMode === 'bohr') {
                // Bohr: Faster speed for inner shells (inverse relationship with radius/index)
                const speed = speedFactor / (shellIndex + 1);
                angle = time * speed + offset;
                posX = Math.cos(angle) * radius;
                posY = 0; // Flat orbit
                posZ = Math.sin(angle) * radius;
                ref.current.position.set(posX, posY, posZ);
            } else {
                // Cloud: Use elliptical path and random axis
                angle = time * cloudProps.speed + offset;
                const basePos = new THREE.Vector3(
                    Math.cos(angle) * cloudProps.xRadius,
                    0,
                    Math.sin(angle) * cloudProps.zRadius
                );
                // Apply random tilt
                basePos.applyAxisAngle(cloudProps.axis, Math.PI / 4 + Math.random() * Math.PI / 2); // Vary tilt
                ref.current.position.copy(basePos);
            }
        }
    });

    return (
        <Sphere ref={ref} args={[ELECTRON_RADIUS, PARTICLE_SEGMENTS, PARTICLE_SEGMENTS]}>
            {/* Using physical material for better light interaction */}
            <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={3} // Stronger glow
                roughness={0.2}
                metalness={0.1}
                clearcoat={0.5} // Slight glossy coat
                toneMapped={false} // Ensure glow isn't overly dimmed
            />
        </Sphere>
    );
}

// Nucleus: Using MeshPhysicalMaterial and subtle nucleon offsets
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
    // Correct dependency array
    }, [protons, /* removed neutrons */ protonColor, neutronColor, radius, totalParticles]);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
            groupRef.current.rotation.x += 0.0005;
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

// OrbitLine: Using <primitive> for reliability, thinner line
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

    useEffect(() => { // Changed from React.useEffect to useEffect
        // Cleanup function for geometry and material
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
    }, [lineObject]); // Rerun effect if lineObject instance changes


    return <primitive object={lineObject} dispose={null} />;
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
    // ## VERIFY: NO useBuilder() call should be here ##
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
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

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
                                    speedFactor={1.5}
                                    offset={(i / count) * Math.PI * 2}
                                    color={colors.electron}
                                    vizMode="bohr"
                                />
                            ))}
                        </group>
                    );
                })}

                {vizMode === 'cloud' && Array.from({ length: electrons }).map((_, i) => {
                    let estimatedShell = 0;
                    let countInShells = 0;
                    for(let s=0; s < bohrShells.length; s++) {
                        countInShells += bohrShells[s];
                        if(i < countInShells) { estimatedShell = s; break; }
                    }
                    const baseRadius = (estimatedShell + 1) * 0.7 + (Math.random() - 0.5) * 0.4;
                    const speedFactor = 1.0;
                    return (
                        <Electron
                            key={`cloud-electron-${i}`}
                            shellIndex={estimatedShell}
                            radius={baseRadius}
                            speedFactor={speedFactor}
                            offset={Math.random() * Math.PI * 2}
                            color={colors.electron}
                            vizMode="cloud"
                        />
                    );
                })}
            </group>
        </Suspense>
    );
}
// --- END REFACTOR ---


// --- Main Viewport Wrapper Component ---
export default function AtomViewport() {
    // Get builder state here in the parent - THIS IS CORRECT
    const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();
    const { settings: graphicsSetting } = useGraphicsSettings();

    return (
        // Use Suspense here to wrap the potentially heavy AtomScene
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-950"><p className="text-gray-500">Loading 3D Viewport...</p></div>}>
            <Canvas camera={{ position: [0, 5, 12], fov: 50 }} className="w-full h-full bg-black">
                 {/* Pass state down as props */}
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
                        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.8}/>
                    </EffectComposer>
                )}
            </Canvas>
        </Suspense>
    );
}