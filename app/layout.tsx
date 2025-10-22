import './globals.css';
import { Orbitron, Inter } from 'next/font/google';
import ClientLayoutWrapper from './ClientLayoutWrapper'; // <-- 1. Only import the wrapper

// Setup fonts (remains the same)
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Atom Builder by Arthuron',
  description: 'Build the universe, one atom at a time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="bg-gray-950 text-gray-200 font-inter">
        {/* 2. RENDER THE WRAPPER, which handles the rest */}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}

