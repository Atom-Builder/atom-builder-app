'use client';

import React from 'react';
import { BuilderProvider } from '@/hooks/useBuilder';
import ControlsPanel from '@/components/core/ControlsPanel';
import AtomViewport from '@/components/core/AtomViewport';

export default function BuilderLayout() {
  return (
    // Wrap the entire layout in the BuilderProvider
    // This makes the atom state available to all children
    <BuilderProvider>
      <div className="flex flex-col md:flex-row h-full p-4 gap-4">
        
        {/* Main 3D Viewport */}
        <AtomViewport />
        
        {/* Controls Panel */}
        <ControlsPanel />

      </div>
    </BuilderProvider>
  );
}

