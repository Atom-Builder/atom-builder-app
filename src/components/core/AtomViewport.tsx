// TEMPORARY SIMPLIFIED VERSION FOR DEBUGGING BUILD
'use client';

import React, { Suspense } from 'react'; // Basic React import
import { useBuilder } from '@/hooks/useBuilder'; // Import the hook
// No 3D imports needed for this test

// Dummy AtomScene that just accepts props (doesn't render anything complex)
interface AtomSceneProps {
    protons: number;
    // Add other props if needed for type checking, but keep it minimal
    neutrons: number;
    electrons: number;
    isAntimatter: boolean;
    vizMode: 'bohr' | 'cloud';
}
function AtomScene(props: AtomSceneProps) {
    // Does NOT call useBuilder()
    return (
        <mesh> {/* Simple placeholder mesh */}
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="orange" />
        </mesh>
    );
}

// Main Viewport Wrapper Component
export default function AtomViewport() {
    // Get builder state here in the parent - THIS IS THE CORRECT PATTERN
    const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();

    // Basic return structure without Canvas for simplicity during build test
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-950 text-gray-500">
            <p>Simplified Viewport (Build Test)</p>
            {/* Pass state down as props */}
            <AtomScene
                protons={protons}
                neutrons={neutrons}
                electrons={electrons}
                isAntimatter={isAntimatter}
                vizMode={vizMode}
            />
             {/* Intentionally omitting Canvas, OrbitControls etc. for this test */}
        </div>
    );
}