'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/hooks/useAuth'; // Import db instance
import { collection, getDocs, limit, query, where, orderBy } from 'firebase/firestore';
import { Loader2, Search } from 'lucide-react';
import AtomPreview from '@/components/core/AtomPreview'; // <-- 1. IMPORT THE NEW PREVIEW
import { AtomConfig } from '@/hooks/useBuilder'; // We can still use the type

// Define the shape of the saved creation
interface Creation extends AtomConfig {
  id: string;
  userId: string;
  userName: string;
  publishedAt: any; // Firestore timestamp
}

// Re-usable Atom Card for galleries
const AtomCard = ({ creation }: { creation: Creation }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20">
      <div className="w-full h-48">
        {/* 2. USE THE NEW PREVIEW COMPONENT */}
        <AtomPreview p={creation.protons} n={creation.neutrons} e={creation.electrons} />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold font-orbitron text-white truncate">
          {creation.atomName || `Element-${creation.protons}`}
        </h3>
        <p className="text-sm text-gray-400">
          By {creation.userName || 'Anonymous'}
        </p>
        <div className="flex justify-between text-xs mt-3 text-gray-300">
          <span>{creation.protons} P</span>
          <span>{creation.neutrons} N</span>
          <span>{creation.electrons} E</span>
        </div>
      </div>
    </div>
  );
};

export default function CommunityGallerySection() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 3. THIS FETCH LOGIC IS NOW SELF-CONTAINED ---
  // It no longer needs useBuilder()
  useEffect(() => {
    const fetchCreations = async () => {
      setLoading(true);
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const creationsCol = collection(db, `artifacts/${appId}/public/data/creations`);
        
        // Query for public creations, order by newness, limit to 12
        const q = query(
          creationsCol, 
          where("isPublic", "==", true),
          orderBy("publishedAt", "desc"),
          limit(12)
        );

        const snapshot = await getDocs(q);
        const creationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Creation));
        
        setCreations(creationsData);
      } catch (error) {
        console.error("Error fetching public creations: ", error);
      }
      setLoading(false);
    };

    fetchCreations();
  }, []);

  return (
    <section id="community" className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron">
            <span className="text-cyan-400">🌐 Community</span> Gallery
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Discover, remix, and share creations from builders around the world.
          </p>
        </div>

        {/* Search/Filter (Visual Placeholder) */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search atoms by name or element..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-3 px-4 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-md transition-all">
            Search
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map((creation) => (
              <AtomCard key={creation.id} creation={creation} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

