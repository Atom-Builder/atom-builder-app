'use client';

import { useAuth } from '@/hooks/useAuth';
import CreationsGallery from '@/components/sections/CreationsGallery';
import { LogIn } from 'lucide-react';

export default function CreationsPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  
  // We check if the user is authenticated (not loading and not anonymous)
  const isAuthenticated = !loading && user && !user.isAnonymous;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-orbitron">
          <span className="text-cyan-400">My</span> Creations
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Your private gallery of saved atoms. Only you can see these.
        </p>
      </div>

      {isAuthenticated ? (
        // If authenticated, show the real gallery
        <CreationsGallery />
      ) : (
        // If not, show a sign-in prompt
        <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-900/50 border border-gray-700 rounded-xl">
          <LogIn className="w-16 h-16 text-cyan-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            You must be signed in with a Google account to view your private creations.
          </p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center px-6 py-3 rounded-md bg-green-600 hover:bg-green-500 text-white text-lg font-semibold transition-all"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
}

