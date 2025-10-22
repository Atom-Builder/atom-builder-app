'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/core/SettingsModal';
import ParticleBackground from '@/components/core/ParticleBackground';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <ParticleBackground />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onSettingsClick={() => setIsSettingsModalOpen(true)} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
