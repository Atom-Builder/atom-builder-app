'use client';

// This is the correct code for your HOMEPAGE.
// It contains all the sections for the landing page.

import Hero from '@/components/sections/Hero';
import BuilderSection from '@/components/sections/BuilderSection';
import PeriodicTableSection from '@/components/sections/PeriodicTableSection';
import AntimatterHubSection from '@/components/sections/AntimatterHubSection';
import CommunityGallerySection from '@/components/sections/CommunityGallerySection';

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* This radial gradient creates the "glow" background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <Hero />
      <BuilderSection />
      <PeriodicTableSection />
      <AntimatterHubSection />
      <CommunityGallerySection />

    </main>
  );
}

