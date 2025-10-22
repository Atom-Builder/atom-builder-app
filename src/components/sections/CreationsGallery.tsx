'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBuilder } from '@/hooks/useBuilder';
import { collection, onSnapshot, query, deleteDoc, doc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { LogIn, Trash2, Eye, Loader2, Frown } from 'lucide-react';
import Link from 'next/link';

// --- 1. Define the shape of the data from Firestore ---
interface Creation extends DocumentData {
  id: string; // The Firestore document ID
  name: string;
  atom_config: {
    protons: number;
    neutrons: number;
    electrons: number;
  };
  is_antimatter: boolean;
  // is_public is not needed here, as this is the private gallery
}

export default function CreationsGallery() {
  const { db, userId, appId, user, loading: authLoading } = useAuth();
  const { loadPreset } = useBuilder();
  
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 2. REAL-TIME FIRESTORE LISTENER ---
  useEffect(() => {
    if (!db || !userId || !appId || !user || user.isAnonymous) {
      setLoading(false);
      return; // Not ready to fetch or user is anonymous
    }

    setLoading(true);
    // Path to the user's private creations
    const collectionPath = `artifacts/${appId}/users/${userId}/creations`;
    const q = query(collection(db, collectionPath));

    // onSnapshot creates a real-time subscription
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const creationsData: Creation[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        creationsData.push({ id: doc.id, ...doc.data() } as Creation);
      });
      setCreations(creationsData);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to creations:", error);
      setLoading(false);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();

  }, [db, userId, appId, user]); // Re-run if auth state changes

  // --- 3. REAL DELETE FUNCTION ---
  const handleDelete = async (id: string, name: string) => {
    if (!db || !userId || !appId) return;

    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      try {
        const docPath = `artifacts/${appId}/users/${userId}/creations/${id}`;
        await deleteDoc(doc(db, docPath));
        console.log(`Document ${id} deleted.`);
      } catch (error) {
        console.error("Error deleting document:", error);
        alert('Error: Could not delete creation.');
      }
    }
  };

  // --- 4. RENDER STATES ---
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center text-cyan-400 p-10">
        <Loader2 className="w-10 h-10 animate-spin mr-3" />
        <span className="text-xl">Loading Your Creations...</span>
      </div>
    );
  }

  if (creations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-900/50 border border-gray-700 rounded-xl">
        <Frown className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Creations Found</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          You haven't saved any private atoms yet. Go to the builder to create one!
        </p>
        <Link 
          href="/builder"
          className="flex items-center justify-center px-6 py-3 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-semibold transition-all"
        >
          Go to Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creations.map((creation) => (
        <div 
          key={creation.id} 
          className="bg-gray-900/70 border border-gray-700/50 rounded-xl shadow-lg p-6
                    flex flex-col justify-between transition-all duration-300
                    hover:border-cyan-500/50 hover:shadow-cyan-500/10"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-orbitron font-bold text-white truncate pr-2">
                {creation.name}
              </h3>
              <button 
                onClick={() => handleDelete(creation.id, creation.name)}
                className="text-gray-500 hover:text-red-400 transition-colors"
                title="Delete Creation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Atom Info */}
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              <p>Protons: <span className="font-bold text-red-400">{creation.atom_config.protons}</span></p>
              <p>Neutrons: <span className="font-bold text-purple-400">{creation.atom_config.neutrons}</span></p>
              <p>Electrons: <span className="font-bold text-cyan-400">{creation.atom_config.electrons}</span></p>
              {creation.is_antimatter && (
                <p className="font-bold text-yellow-400">Antimatter Atom</p>
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
            Load in Builder
          </Link>
        </div>
      ))}
    </div>
  );
}

