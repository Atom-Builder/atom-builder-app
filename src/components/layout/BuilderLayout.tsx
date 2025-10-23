'use client';

import { BuilderProvider } from '@/hooks/useBuilder';
import ControlsPanel from '@/components/core/ControlsPanel';
import AtomViewport from '@/components/core/AtomViewport';

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    // Wrap the entire layout with the provider
    <BuilderProvider>
      <div className="flex flex-col h-full"> {/* Ensure layout takes height */}
        {/* Optional: Add a header specific to the builder page if needed */}
        {/* <header className="p-4 bg-gray-800 text-white">Builder Header</header> */}

        <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 p-4 h-[calc(100vh-theme(spacing.16))]"> {/* Adjust calc based on nav height */}

          {/* Controls Panel (Smaller Column) */}
          {/* --- FIX: Make controls column smaller (e.g., 1/3 width on md+) --- */}
          <div className="md:col-span-4 h-full">
            <ControlsPanel />
          </div>
          {/* --- END FIX --- */}


          {/* Atom Viewport (Larger Column) */}
          {/* --- FIX: Make viewport column larger (e.g., 2/3 width on md+) --- */}
          <div className="md:col-span-8 h-full rounded-lg overflow-hidden border border-gray-700/50 shadow-xl shadow-black/30">
             {/* Ensure AtomViewport fills this container */}
             <AtomViewport />
          </div>
           {/* --- END FIX --- */}

        </div>
         {/* Render children if any are passed */}
         {children}
      </div>
    </BuilderProvider>
  );
}

