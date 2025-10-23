'use client';

import React from 'react'; // Import React
import { BuilderProvider } from '@/hooks/useBuilder';
import ControlsPanel from '@/components/core/ControlsPanel';
import AtomViewport from '@/components/core/AtomViewport';

// --- FIX: Make children optional ---
export default function BuilderLayout({ children }: { children?: React.ReactNode }) {
// --- END FIX ---
  return (
    <BuilderProvider>
      <div className="flex flex-col h-full">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 p-4 h-[calc(100vh-theme(spacing.16))]">
          {/* Controls Panel */}
          <div className="md:col-span-4 h-full">
            <ControlsPanel />
          </div>
          {/* Atom Viewport */}
          <div className="md:col-span-8 h-full rounded-lg overflow-hidden border border-gray-700/50 shadow-xl shadow-black/30">
             <AtomViewport />
          </div>
        </div>
         {/* Render children if any are passed (though currently unused) */}
         {children}
      </div>
    </BuilderProvider>
  );
}

