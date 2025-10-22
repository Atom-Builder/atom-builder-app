import React, { Suspense } from 'react';
import BuilderLayout from '@/components/layout/BuilderLayout';
import { BuilderProvider } from '@/hooks/useBuilder';

// This is a simple wrapper component that ensures we are a 'use client'
// context, which is required for the BuilderProvider.
const BuilderClientWrapper = () => {
  'use client'; // This component and its children are client-side
  return (
    <BuilderProvider>
      <BuilderLayout />
    </BuilderProvider>
  );
};

// We wrap the client component in a Suspense boundary
// This is required for components that use useSearchParams()
export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-white bg-slate-950">Loading Atom...</div>}>
      <BuilderClientWrapper />
    </Suspense>
  );
}

