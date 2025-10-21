'use client';

import { useGraphicsSettings } from '@/hooks/useGraphicsSettings';
import React from 'react';

// This is a placeholder for our future 3D atom component.
// It will only be loaded when graphics settings are 'high'.
const AtomAnimationPlaceholder = () => (
  <div className="w-full h-96 bg-gray-900/50 rounded-lg border border-cyan-500/20 flex items-center justify-center">
    <div className="text-center text-cyan-400">
      <p className="text-2xl font-bold">3D Atom Animation</p>
      <p className="text-sm text-gray-500">(Visible on 'High' graphics setting)</p>
    </div>
  </div>
);

export default function Hero() {
  const { settings } = useGraphicsSettings();

  return (
    <section 
      id="hero" 
      className="relative container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
      
      {/* Left Content */}
      <div className="lg:w-1/2 z-10">
        <h1 className="text-5xl md:text-7xl font-bold font-orbitron leading-tight">
          <span className="text-cyan-400">Build</span> the Universe,
          <br />
          one <span className="text-purple-400">Atom</span> at a time.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
          A futuristic educational web app that lets you create atoms, explore the periodic table, and understand antimatter.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-md hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20">
            Start Building
          </button>
          <button className="px-8 py-3 bg-gray-700/50 border border-gray-600 text-gray-300 font-bold rounded-md hover:bg-gray-700 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Right Content (3D Atom) */}
      <div className="lg:w-1/2 mt-12 lg:mt-0 z-10">
        {/* We use the settings to decide what to render */}
        {settings === 'high' ? (
          <AtomAnimationPlaceholder />
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
             <p className="text-gray-500">Set graphics to 'High' to view 3D animation.</p>
          </div>
        )}
      </div>
    </section>
  );
}
