'use client';

import { useState } from 'react';
import { GraphicsProvider } from '@/hooks/useGraphicsSettings';
import { AuthProvider } from '@/hooks/useAuth';
// --- 1. MOVED IMPORTS HERE ---
import Navbar from '@/components/layout/Navbar'; 
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/core/SettingsModal';
import ParticleBackground from '@/components/core/ParticleBackground';
// --- END MOVED IMPORTS ---
import { Toaster } from 'react-hot-toast';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <GraphicsProvider>
      <AuthProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#334155', // bg-slate-700
              color: '#f1f5f9', // text-slate-100
            },
          }}
        />
        
        {/* --- 2. RENDER COMPONENTS HERE --- */}
        <ParticleBackground /> 
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        <div className="flex flex-col min-h-screen">
          <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
         {/* --- END RENDER COMPONENTS --- */}
      </AuthProvider>
    </GraphicsProvider>
  );
}

