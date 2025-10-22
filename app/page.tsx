'use client';

import BuilderLayout from "@/components/layout/BuilderLayout";
import { Suspense } from 'react'; // Import Suspense

// A simple loading fallback component
const BuilderLoading = () => (
  <div className="flex items-center justify-center h-full text-cyan-400 text-2xl">
    Loading Atom Builder...
  </div>
);

const BuilderPage = () => {
  return (
    // We must wrap the component that uses useSearchParams in a Suspense boundary
    // In our case, BuilderLayout -> BuilderProvider -> useSearchParams
    <Suspense fallback={<BuilderLoading />}>
      <BuilderLayout />
    </Suspense>
  );
};

export default BuilderPage;

