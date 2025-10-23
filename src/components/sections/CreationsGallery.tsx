'use client';

import { useState, useEffect } from 'react';
import { useAuth, db } from '@/hooks/useAuth';
// ***** FIX 1: Removed unused 'where' import *****
import { collection, query, onSnapshot, orderBy, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import AtomPreview from '@/components/core/AtomPreview';
import { AtomCreation } from '@/types'; // Import our type

export default function CreationsGallery() {
    const { user, loading: authLoading } = useAuth();
    const [creations, setCreations] = useState<AtomCreation[]>([]); // Use our type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return; // Wait for auth to be ready
        if (!user || user.isAnonymous) {
            setLoading(false);
            setCreations([]); // Clear creations if user logs out or is anonymous
            return;
        }

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const userCreationsCol = collection(db, `artifacts/${appId}/users/${user.uid}/creations`);
        // Use orderBy for sorting, remove where clause if not filtering
        const q = query(userCreationsCol, orderBy('publishedAt', 'desc'));

        setLoading(true);
        // ***** FIX 2: Explicitly type the snapshot *****
        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const newCreations = snapshot.docs.map((doc) => {
                // Cast data to our type, ensuring ID is included
                return { ...doc.data(), id: doc.id } as AtomCreation;
            });
            setCreations(newCreations);
            setLoading(false);
        }, (error: Error) => { // Type the error
            console.error("Error fetching user creations: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-60">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (!user || user.isAnonymous) {
        return (
            <div className="text-center text-gray-400 py-10">
                <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
                <p>Sign in with Google to save and view your private creations.</p>
            </div>
        );
    }

    return (
        <div className="py-10">
            {creations.length === 0 ? (
                <div className="text-center text-gray-500">
                    <h3 className="text-xl font-semibold">No creations yet!</h3>
                     {/* ***** FIX 3: Replaced ' with &quot; or &apos; ***** */}
                    <p className="mt-2">Go to the Builder, create an atom, and click &quot;Save&quot; to see it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creations.map((creation) => (
                        <div
                            key={creation.id}
                            className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-lg shadow-lg overflow-hidden
                         transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20"
                        >
                            <div className="h-48 w-full">
                                <AtomPreview
                                    protons={creation.protons}
                                    neutrons={creation.neutrons}
                                    electrons={creation.electrons}
                                    isAntimatter={creation.isAntimatter}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold font-orbitron text-white truncate" title={creation.atomName}>
                                    {creation.atomName || 'Untitled Atom'}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Status: {creation.isPublic ? 'Public' : 'Private (Not Published)'}
                                </p>
                                <div className="text-xs text-gray-500 mt-2">
                                    <span className="font-semibold">P:</span> {creation.protons} |
                                    <span className="font-semibold"> N:</span> {creation.neutrons} |
                                    <span className="font-semibold"> E:</span> {creation.electrons}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

