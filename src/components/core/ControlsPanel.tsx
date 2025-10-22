'use client';

import { useState, useEffect } from 'react';
import { useBuilder } from '@/hooks/useBuilder';
// --- VERIFY THESE IMPORTS ---
import { Slider } from '@/components/ui/slider'; 
import { Switch } from '@/components/ui/switch'; 
import { Button } from '@/components/ui/button'; 
// --- END VERIFY ---
import { 
  Rocket, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  FlaskConical,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/hooks/useAuth'; // Assuming db is exported from useAuth
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { AtomCreation } from '@/types'; 

export default function ControlsPanel() {
  const { 
    protons, setProtons,
    neutrons, setNeutrons,
    electrons, setElectrons,
    atomInfo,
    isAntimatter, setIsAntimatter,
    vizMode, setVizMode,
    isStableMode, setIsStableMode,
    resetAtom
  } = useBuilder();

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [atomName, setAtomName] = useState("");

  useEffect(() => {
    // Set initial custom name when atomInfo loads or changes externally
    setAtomName(atomInfo.name); 
  }, [atomInfo.name]);

  const handleSave = async () => {
    if (!user || user.isAnonymous) {
      toast.error("Please sign in to save your creations.");
      return;
    }

    setIsSaving(true);
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      
      const creationData: Omit<AtomCreation, 'id' | 'publishedAt'> & { publishedAt: any } = { 
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        protons,
        neutrons,
        electrons,
        atomName: atomName || atomInfo.name, // Use custom name if set, else default
        isPublic, 
        isAntimatter,
        stability: atomInfo.stability as AtomCreation['stability'], // Assert type
        predicted: atomInfo.predicted,
        publishedAt: serverTimestamp() 
      };

      // Save to user's private collection
      const userCreationsCol = collection(db, `artifacts/${appId}/users/${user.uid}/creations`);
      await addDoc(userCreationsCol, creationData); 

      // If public, also save to public collection
      if (isPublic) {
        const publicCreationsCol = collection(db, `artifacts/${appId}/public/data/creations`);
        await addDoc(publicCreationsCol, { ...creationData, isPublic: true }); 
      }
      
      toast.success("Creation saved successfully!");

    } catch (error) { 
      console.error("Error saving creation: ", error);
      if (error instanceof Error) {
        toast.error(`Save failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while saving.");
      }
    }
    setIsSaving(false);
  };
  
  // Type predicate remains the same
  const isValidStability = (s: string): s is AtomCreation['stability'] => {
    return ['Stable', 'Unstable', 'Predicted', 'Unknown'].includes(s);
  };

  const getStabilityInfo = () => {
    // Use the type predicate for safety
    const stability = isValidStability(atomInfo.stability) ? atomInfo.stability : 'Unknown'; 
    switch(stability) {
      case 'Stable':
        return { icon: CheckCircle, color: 'text-green-400', text: 'Stable Isotope' };
      case 'Unstable':
        return { icon: AlertTriangle, color: 'text-yellow-400', text: 'Unstable Isotope' };
      case 'Predicted':
        return { icon: FlaskConical, color: 'text-purple-400', text: 'Predicted Stability' }; // Slightly changed text
      default: // Handles 'Unknown'
        return { icon: AlertTriangle, color: 'text-gray-400', text: 'Unknown Stability' };
    }
  };
  const stabilityInfo = getStabilityInfo();

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 sm:p-6 text-gray-200 h-full overflow-y-auto shadow-2xl shadow-black/50 flex flex-col">
      
      {/* Atom Info Display */}
      <div className="text-center mb-4 sm:mb-6">
        <input 
          type="text"
          value={atomName}
          onChange={(e) => setAtomName(e.target.value)}
          placeholder="Enter Custom Name"
          className="text-2xl sm:text-3xl font-bold font-orbitron text-white bg-transparent border-b-2 border-gray-700 focus:border-cyan-400 text-center outline-none w-full pb-1 sm:pb-2 mb-1 sm:mb-2"
          aria-label="Custom atom name"
        />
         {/* Show default name subtly */}
         <p className="text-sm sm:text-base text-gray-400 mb-1 truncate" title={atomInfo.name}>
             ({atomInfo.name || '...'}) 
         </p>
        <div className="flex items-center justify-center space-x-2">
          <stabilityInfo.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stabilityInfo.color}`} />
          <span className={`text-base sm:text-lg font-medium ${stabilityInfo.color}`}>
            {stabilityInfo.text}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Symbol: {atomInfo.symbol || '?'} | Charge: {atomInfo.charge > 0 ? '+' : ''}{atomInfo.charge}
        </p>
      </div>

      {/* Particle Sliders */}
      <div className="space-y-4 sm:space-y-6 flex-grow">
        {/* Protons */}
        <div>
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-base sm:text-lg font-semibold">Protons (Z)</label>
            <span className="text-lg sm:text-xl font-bold font-orbitron text-cyan-400">{protons}</span>
          </div>
          <Slider 
            value={[protons]} 
            onValueChange={([val]) => setProtons(val)} 
            max={120} 
            step={1} 
            disabled={isStableMode}
            aria-label="Protons"
          />
        </div>
        
        {/* Neutrons */}
        <div>
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-base sm:text-lg font-semibold">Neutrons (N)</label>
            <span className="text-lg sm:text-xl font-bold font-orbitron text-gray-400">{neutrons}</span>
          </div>
          <Slider 
            value={[neutrons]} 
            onValueChange={([val]) => setNeutrons(val)} 
            max={180} 
            step={1} 
            disabled={isStableMode}
            aria-label="Neutrons"
          />
        </div>
        
        {/* Electrons */}
        <div>
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-base sm:text-lg font-semibold">Electrons</label>
            <span className="text-lg sm:text-xl font-bold font-orbitron text-yellow-400">{electrons}</span>
          </div>
          <Slider 
            value={[electrons]} 
            onValueChange={([val]) => setElectrons(val)} 
            max={120} 
            step={1} 
            aria-label="Electrons"
          />
        </div>
      </div>

      {/* Toggles & Controls */}
      <div className="my-4 sm:my-8 space-y-3 sm:space-y-4">
        {/* Reduced padding and font size slightly */}
        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-md">
          <label htmlFor="stable-mode" className="text-sm sm:text-base font-medium flex-grow mr-2 cursor-pointer">Stable Mode</label>
          <Switch 
            id="stable-mode"
            checked={isStableMode}
            onCheckedChange={setIsStableMode}
          />
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-md">
          <label htmlFor="viz-mode-button" className="text-sm sm:text-base font-medium flex-grow mr-2">
            Viz: {vizMode === 'bohr' ? 'Bohr' : 'Cloud'} {/* Shorter label */}
          </label>
          <button 
            id="viz-mode-button"
            onClick={() => setVizMode(vizMode === 'bohr' ? 'cloud' : 'bohr')}
            className="p-1.5 sm:p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${vizMode === 'bohr' ? 'Quantum Cloud' : 'Bohr Model'} visualization`}
          >
            {vizMode === 'bohr' ? <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5" /> : <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-md">
          <label htmlFor="antimatter-mode" className="text-sm sm:text-base font-medium flex-grow mr-2 cursor-pointer">
            Antimatter
          </label>
          <Switch
            id="antimatter-mode"
            checked={isAntimatter}
            onCheckedChange={setIsAntimatter}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 sm:space-y-4 mt-auto pt-4 border-t border-gray-700/50"> {/* Added border */}
        <Button 
          onClick={handleSave} 
          className="w-full h-10 sm:h-12 text-base sm:text-lg" // Adjusted size
          disabled={isSaving || !user || user.isAnonymous} // Also disable for anonymous
          aria-live="polite" 
        >
          {isSaving ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" /> : <Save className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />}
          {isSaving ? 'Saving...' : 'Save Atom'}
        </Button>
        
        {(!user || user.isAnonymous) && (
          <p className="text-xs text-center text-yellow-400">Sign in to save and publish.</p> // Shorter text
        )}

        {/* Publish Toggle - only show if user is signed in and NOT anonymous */}
        {user && !user.isAnonymous && (
           <div className="flex items-center justify-center space-x-2 pt-1 sm:pt-2">
            <Switch
              id="publish-toggle"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              aria-label="Publish to Community Gallery"
            />
            <label htmlFor="publish-toggle" className="text-xs sm:text-sm text-gray-400 cursor-pointer">
              Publish to Gallery
            </label>
          </div>
        )}
        
        <Button 
          onClick={resetAtom} 
          variant="outline" 
          className="w-full h-10 sm:h-12 text-base sm:text-lg" // Adjusted size
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Reset Atom
        </Button>
      </div>
    </div>
  );
}

