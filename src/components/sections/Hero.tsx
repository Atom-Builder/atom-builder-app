'use client';

import { useGraphicsSettings } from '@/hooks/useGraphicsSettings';
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the AnimatedAtom component.
// This is CRITICAL for performance. It ensures the heavy 3D code
// is only loaded by the browser when it's actually needed.
const AnimatedAtom = dynamic(() => import('@/components/3d/AnimatedAtom'), {
  // We don't want this to render on the server
  ssr: false, 
  // A fallback component to show while the 3D model is loading
  loading: () => <div className="w-full h-full flex items-center justify-center text-cyan-400">Loading 3D model...</div>
});

export default function Hero() {
    const { settings } = useGraphicsSettings();

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
             {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black z-0"></div>
            
            {/* Conditional 3D Model */}
            {settings === 'high' && (
                <div className="absolute inset-0 z-0 opacity-50">
                    <AnimatedAtom />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 px-6">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-orbitron text-white leading-tight">
                    <span className="text-cyan-400 animate-pulse">Atom</span> Builder
                </h1>
                <p className="mt-4 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto">
                    Build the universe, <span className="text-purple-400">one atom at a time.</span>
                </p>
                <p className="mt-6 text-md md:text-lg text-gray-500 max-w-2xl mx-auto">
                    A futuristic educational web app that lets you create atoms, explore the periodic table, and understand antimatter.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <a href="#builder" className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105">
                        Start Building
                    </a>
                </div>
            </div>
        </section>
    );
}

