'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBuilder } from '@/hooks/useBuilder';
import { LogIn, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock data for saved creations
// In Phase 3, this data will be fetched from your API
const mockCreations = [
  {
    id: 'c1',
    name: 'My First Carbon',
    atom_config: { protons: 6, neutrons: 6, electrons: 6 },
    is_antimatter: false,
  },
  {
    id: 'c2',
    name: 'Strange Anti-Helium',
    atom_config: { protons: 2, neutrons: 2, electrons: 2 },
    is_antimatter: true,
  },
  {
    id: 'c3',
    name: 'Heavy Ion',
    atom_config: { protons: 10, neutrons: 10, electrons: 8 },
    is_antimatter: false,
  },
];

export default function CreationsGallery() {
  const { user, signIn } = useAuth();
  const { loadPreset } = useBuilder(); // We use this to load the atom

  // Mock fetch/delete functions
  // Replace these with your actual API calls
  const handleDelete = (id: string) => {
    alert(`(Mock) Deleting creation with id: ${id}`);
    // In a real app:
    // await fetch(`/api/creations/${id}`, { method: 'DELETE', headers: { ... } });
    // refetchCreations();
  };

  // If the user is not signed in, show a login prompt
  if (!user) {
    return (
      <div className="text-center bg-gray-900/50 border border-gray-700 rounded-lg p-12 max-w-lg mx-auto">
        <LogIn className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
        <h2 className="text-3xl font-orbitron mb-4">Please Sign In</h2>
        <p className="text-lg text-gray-400 mb-8">
          You need to be signed in to view your saved creations.
        </p>
        <button
          onClick={() => signIn()}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  // If the user is signed in, show their gallery
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockCreations.map((creation) => (
        <div 
          key={creation.id} 
          className="bg-gray-900/70 border border-gray-700/50 rounded-xl shadow-lg p-6
                     flex flex-col justify-between transition-all duration-300
                     hover:border-cyan-500/50 hover:shadow-cyan-500/10"
        >
          <div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
              {creation.name}
            </h3>
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              <p>Protons: <span className="font-bold text-red-400">{creation.atom_config.protons}</span></p>
              <p>Neutrons: <span className="font-bold text-purple-400">{creation.atom_config.neutrons}</span></p>
              <p>Electrons: <span className="font-bold text-cyan-400">{creation.atom_config.electrons}</span></p>
              {creation.is_antimatter && (
                <p className="font-bold text-yellow-400">Antimatter Atom</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link 
              href="/builder"
              onClick={() => loadPreset(creation.atom_config, creation.is_antimatter)}
              className="flex-1 flex items-center justify-center px-4 py-2 rounded-md bg-cyan-600/50 hover:bg-cyan-600/70 text-cyan-200 text-sm font-semibold transition-all"
            >
              <Eye className="w-4 h-4 mr-2" />
              Load in Builder
            </Link>
            <button
              onClick={() => handleDelete(creation.id)}
              className="px-3 py-2 rounded-md bg-red-600/50 hover:bg-red-600/70 text-red-200 transition-all"
              title="Delete Creation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
