'use client';

import React, { useState, useEffect } from 'react';
import { db, useAuth } from '@/hooks/useAuth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { AtomConfig } from '@/hooks/useBuilder';
import AtomPreview from '@/components/core/AtomPreview'; // <-- 1. IMPORT THE NEW PREVIEW
import Link from 'next/link';

// Define the shape of the saved creation
interface Creation extends AtomConfig {
  id: string;
  userId: string;
  userName: string;
  publishedAt: any; // Firestore timestamp
  isPublic: boolean;
}

// Re-usable Atom Card
const AtomCard = ({ creation }: { creation: Creation }) => {
  const queryParams = {
    p: creation.protons,
    n: creation.neutrons,
    e: creation.electrons,
  };

  return (
    <Link href={{ pathname: '/builder', query: queryParams }}>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 h-full flex flex-col">
        <div className="w-full h-48 flex-shrink-0">
           {/* 2. USE THE NEW PREVIEW COMPONENT */}
          <AtomPreview p={creation.protons} n={creation.neutrons} e={creation.electrons} />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold font-orbitron text-white truncate">
            {creation.atomName || `Element-${creation.protons}`}
          </h3>
          <p className="text-sm text-gray-400">
            {creation.isPublic ? 'Public' : 'Private'}
          </p>
          <div className="flex-grow"></div>
          <div className="flex justify-between text-xs mt-3 text-gray-300 pt-3 border-t border-gray-700">
            <span>{creation.protons} P</span>
            <span>{creation.neutrons} N</span>
            <span>{creation.electrons} E</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function CreationsGallery() {
  const { user } = useAuth();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 3. THIS FETCH LOGIC IS NOW SELF-CONTAINED ---
  // It no longer needs useBuilder()
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setLoading(false);
      return; // Don't fetch if user isn't logged in
    }

    setLoading(true);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const creationsCol = collection(db, `artifacts/${appId}/users/${user.uid}/creations`);
    
    // Query for this user's creations, order by newness
    const q = query(
      creationsCol,
      orderBy("publishedAt", "desc")
    );

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const creationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Creation));
      setCreations(creationsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user creations: ", error);
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();

  }, [user]); // Re-run when user changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-400">Please sign in to view your saved creations.</p>
      </div>
    );
  }

  if (creations.length === 0) {
     return (
      <div className="text-center">
        <p className="text-xl text-gray-400">You haven't saved any creations yet.</p>
         <Link href="/builder">
            <span className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-md transition-all">
                Start Building
            </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {creations.map((creation) => (
        <AtomCard key={creation.id} creation={creation} />
      ))}
    </div>
  );
}

