'use client';
import { Settings } from 'lucide-react';
import React from 'react';

interface NavbarProps {
    onSettingsClick: () => void;
}

export default function Navbar({ onSettingsClick }: NavbarProps) {
    const navLinks = ['Builder', 'Periodic Table', 'Community', 'Antimatter Hub'];

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-lg border-b border-cyan-500/20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl font-bold font-orbitron text-white">
                    <span className="text-cyan-400">Atom</span>Builder
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-300 hover:text-cyan-400 transition-colors">
                            {link}
                        </a>
                    ))}
                </nav>
                
                {/* Settings Button */}
                <button 
                    onClick={onSettingsClick}
                    className="text-gray-300 hover:text-cyan-400 transition-colors p-2 rounded-md hover:bg-cyan-500/10"
                    aria-label="Open graphics settings"
                >
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}

