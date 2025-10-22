import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { GraphicsProvider } from '@/hooks/useGraphicsSettings';
import { AuthProvider } from '@/hooks/useAuth'; // <-- 1. IMPORT REAL PROVIDER
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SettingsModal from '@/components/core/SettingsModal';
import ParticleBackground from '@/components/core/ParticleBackground';
import ClientLayoutWrapper from './ClientLayoutWrapper';

// ... (font setup is the same)
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
});

const orbitron = Orbitron({ 
  subsets: ['latin'], 
  weight: ['400', '700', '900'], 
  variable: '--font-orbitron' 
});

export const metadata: Metadata = {
  title: 'Atom Builder',
  description: 'Build the universe, one atom at a time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="bg-gray-950 font-inter text-gray-300">
        <GraphicsProvider>
          <AuthProvider> {/* <-- 2. WRAP WITH AUTH PROVIDER */}
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </AuthProvider>
        </GraphicsProvider>
      </body>
    </html>
  );
}

