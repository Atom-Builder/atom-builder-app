'use client';

import { useState, useEffect } from 'react';
import { db } from '@/hooks/useAuth'; // Assuming db is exported
import { collection, query, orderBy, limit, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore'; // 1. Import necessary types
import { Loader2 } from 'lucide-react';
import AtomPreview from '@/components/core/AtomPreview';
import { AtomCreation } from '@/types'; // 2. Import our type

export default function CommunityGallerySection() {
  const [creations, setCreations] = useState<AtomCreation[]>([]); // 3. Use our type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const publicCreationsCol = collection(db, `artifacts/${appId}/public/data/creations`);
    // Ensure publishedAt exists and is descending, limit results
    const q = query(publicCreationsCol, orderBy('publishedAt', 'desc'), limit(12)); 

    const unsubscribe = onSnapshot(q, 
      (snapshot: QuerySnapshot<DocumentData>) => { // 4. Type the snapshot
        // 5. Use map and type assertion correctly
        const newCreations = snapshot.docs.map((doc): AtomCreation => { 
          // Assert data conforms to Omit<AtomCreation, 'id'>, as id comes separately
          const data = doc.data() as Omit<AtomCreation, 'id'>; 
          return { 
            ...data, 
            id: doc.id 
          };
        });
        setCreations(newCreations);
        setLoading(false);
      }, 
      (error) => { // Handle errors
        console.error("Error fetching public creations: ", error);
        toast.error("Could not load community creations."); // Inform user
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe(); 
  }, []); // Empty dependency array means this runs once on mount

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

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : creations.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No community creations yet.</p>
            <p className="text-sm">Be the first to build an atom and publish it!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {creations.map((creation) => (
              <div 
                key={creation.id}
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-lg shadow-lg overflow-hidden
                           transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20 group" // Added group for potential future hover effects within card
              >
                {/* Ensure AtomPreview receives valid numbers, default to 0 if undefined */}
                <div className="h-48 w-full bg-black"> {/* Added bg-black for fallback */}
                  <AtomPreview 
                    protons={creation.protons ?? 0} 
                    neutrons={creation.neutrons ?? 0} 
                    electrons={creation.electrons ?? 0}
                    isAntimatter={creation.isAntimatter ?? false}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold font-orbitron text-white truncate" title={creation.atomName}>
                    {creation.atomName || 'Untitled Atom'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    By {creation.userName || 'Anonymous'}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="font-semibold">P:</span> {creation.protons ?? '?'} | 
                    <span className="font-semibold"> N:</span> {creation.neutrons ?? '?'} | 
                    <span className="font-semibold"> E:</span> {creation.electrons ?? '?'}
                  </div>
                   {/* Optional: Add stability info if useful */}
                   <p className={`text-xs mt-1 ${
                     creation.stability === 'Stable' ? 'text-green-400' :
                     creation.stability === 'Unstable' ? 'text-yellow-400' :
                     creation.stability === 'Predicted' ? 'text-purple-400' : 'text-gray-500'
                   }`}>
                     {creation.stability || 'Unknown'} {creation.predicted ? '(Predicted)' : ''}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

