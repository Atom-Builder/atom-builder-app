'use client';

import BuilderLayout from "@/components/layout/BuilderLayout";
import CreationsGallery from "@/components/sections/CreationsGallery";
import { BuilderProvider } from "@/hooks/useBuilder";

// This is the new page for /creations
// It will display the gallery of a user's saved atoms.
export default function CreationsPage() {
  return (
    // We wrap this in BuilderProvider so the "Load in Builder"
    // button in the gallery can set the atom state.
    <BuilderProvider>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold font-orbitron text-center mb-12">
          <span className="text-cyan-400">My</span> Creations
        </h1>
        
        {/* We render the main gallery component here */}
        <CreationsGallery />
      </div>
    </BuilderProvider>
  );
}
