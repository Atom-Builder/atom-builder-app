'use client';

import { useState } from 'react';
import { GraphicsProvider } from '@/hooks/useGraphicsSettings';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/core/SettingsModal';
import ParticleBackground from '@/components/core/ParticleBackground';
import { Toaster } from 'react-hot-toast'; // <-- 1. IMPORT THE TOASTER

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <GraphicsProvider>
      <AuthProvider>
        {/* 2. ADD THE TOASTER COMPONENT HERE */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#334155', // bg-slate-700
              color: '#f1f5f9', // text-slate-100
            },
          }}
        />
        
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
      </AuthProvider>
    </GraphicsProvider>
  );
}

