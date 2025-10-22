'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBuilder } from '@/hooks/useBuilder';
import { collection, onSnapshot, query, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Loader2, Eye, User, Zap, Frown } from 'lucide-react';
import Link from 'next/link';

// --- 1. Define the shape of the public data from Firestore ---
interface PublicCreation extends DocumentData {
  id: string; // The Firestore document ID
  name: string;
  username: string; // Added by our save function
  atom_config: {
    protons: number;
    neutrons: number;
    electrons: number;
  };
  is_antimatter: boolean;
  // We know is_public is true because it's in this collection
}

export default function CommunityGallerySection() {
  const { db, appId, loading: authLoading } = useAuth();
  const { loadPreset } = useBuilder(); // We use this to load the atom
  
  const [creations, setCreations] = useState<PublicCreation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 2. REAL-TIME PUBLIC LISTENER ---
  useEffect(() => {
    if (!db || !appId) {
      if (!authLoading) setLoading(false);
      return; // Not ready to fetch
    }

    setLoading(true);
    // Path to the PUBLIC creations
    const collectionPath = `artifacts/${appId}/public/data/creations`;
    const q = query(collection(db, collectionPath));

    // onSnapshot creates a real-time subscription
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const creationsData: PublicCreation[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        creationsData.push({ id: doc.id, ...doc.data() } as PublicCreation);
      });
      // Sort by username or a timestamp if we add one later
      setCreations(creationsData.sort((a, b) => (a.username || '').localeCompare(b.username || '')));
      setLoading(false);
    }, (error) => {
      console.error("Error listening to public creations:", error);
      setLoading(false);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();

  }, [db, appId, authLoading]); // Re-run if auth state changes

  return (
    <section id="community-gallery" className="py-20 bg-gray-950/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron">
            <span className="text-cyan-400">🌐 Community</span> Creations
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Discover atoms designed by other creators. View, remix, and share your own.
          </p>
        </div>

        {/* Filters (Mock) */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search creations..." 
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" 
          />
          <button className="px-4 py-2 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700/70">Popular</button>
          <button className="px-4 py-2 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700/70">Newest</button>
          <button className="px-4 py-2 bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700/70">Antimatter</button>
        </div>

        {/* --- 3. GALLERY GRID --- */}
        {loading ? (
          <div className="flex items-center justify-center text-cyan-400 p-10">
            <Loader2 className="w-10 h-10 animate-spin mr-3" />
            <span className="text-xl">Loading Public Gallery...</span>
          </div>
        ) : creations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-900/50 border border-gray-700 rounded-xl">
            <Frown className="w-16 h-16 text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Gallery is Empty</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              No one has published a creation yet. Be the first!
            </p>
            <Link 
              href="/builder"
              className="flex items-center justify-center px-6 py-3 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-semibold transition-all"
            >
              Go to Builder
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creations.map((creation) => (
              <div 
                key={creation.id} 
                className="bg-gray-900/70 border border-gray-700/50 rounded-xl shadow-lg p-6
                          flex flex-col justify-between transition-all duration-300
                          hover:border-cyan-500/50 hover:shadow-cyan-500/10"
              >
                <div>
                  {/* Header with Name and User */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-orbitron font-bold text-white truncate">
                      {creation.name}
                    </h3>
                    <div className="flex items-center text-sm text-cyan-300">
                      <User className="w-4 h-4 mr-2" />
                      <span>{creation.username || 'Anonymous'}</span>
                    </div>
                  </div>
                  
                  {/* Atom Info */}
                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    <p>Protons: <span className="font-bold text-red-400">{creation.atom_config.protons}</span></p>
                    <p>Neutrons: <span className="font-bold text-purple-400">{creation.atom_config.neutrons}</span></p>
                    <p>Electrons: <span className="font-bold text-cyan-400">{creation.atom_config.electrons}</span></p>
                    {creation.is_antimatter && (
                      <p className="font-bold text-yellow-400 flex items-center">
                        <Zap className="w-4 h-4 mr-1"/> Antimatter Atom
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Action Button */}
                <Link 
                  href={{
                    pathname: '/builder',
                    query: { 
                      p: creation.atom_config.protons, 
                      n: creation.atom_config.neutrons,
                      e: creation.atom_config.electrons,
                    }
                  }}
                  onClick={() => loadPreset(creation.atom_config, creation.is_antimatter)}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-cyan-600/50 hover:bg-cyan-600/70 text-cyan-200 text-sm font-semibold transition-all"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View & Remix in Builder
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

