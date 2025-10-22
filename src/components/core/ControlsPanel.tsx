'use client';

import { useState, useEffect } from 'react';
import { useBuilder } from '@/hooks/useBuilder';
import { Slider } from '@/components/ui/slider'; // Assuming shadcn/ui installed
import { Switch } from '@/components/ui/switch'; // Assuming shadcn/ui installed
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui installed
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
import { AtomCreation } from '@/types'; // <-- 1. IMPORT TYPE

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
    if (atomInfo.name) {
      setAtomName(atomInfo.name);
    }
  }, [atomInfo.name]);

  const handleSave = async () => {
    if (!user || user.isAnonymous) {
      toast.error("Please sign in to save your creations.");
      return;
    }

    setIsSaving(true);
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      
      // 2. FIX: Explicitly type the creationData object using Omit<...>
      // We omit 'id' because Firestore generates it
      const creationData: Omit<AtomCreation, 'id' | 'publishedAt'> & { publishedAt: any } = { 
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        protons,
        neutrons,
        electrons,
        atomName: atomName || atomInfo.name,
        isPublic, // Will be overridden for public collection
        isAntimatter,
        stability: atomInfo.stability, 
        predicted: atomInfo.predicted,
        publishedAt: serverTimestamp() // Firestore special value
      };

      // Save to user's private collection
      const userCreationsCol = collection(db, `artifacts/${appId}/users/${user.uid}/creations`);
      await addDoc(userCreationsCol, creationData); 

      // If public, also save to public collection
      if (isPublic) {
        const publicCreationsCol = collection(db, `artifacts/${appId}/public/data/creations`);
        // 3. FIX: Use the typed object and correctly set isPublic
        await addDoc(publicCreationsCol, { ...creationData, isPublic: true }); 
      }
      
      toast.success("Creation saved successfully!");

    } catch (error) { // 4. FIX: Use 'unknown' for better type safety
      console.error("Error saving creation: ", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred while saving.");
      }
    }
    setIsSaving(false);
  };
  
  // Type predicate to narrow down stability type
  const isValidStability = (s: string): s is AtomCreation['stability'] => {
    return ['Stable', 'Unstable', 'Predicted', 'Unknown'].includes(s);
  };

  const getStabilityInfo = () => {
    const stability = isValidStability(atomInfo.stability) ? atomInfo.stability : 'Unknown';
    switch(stability) {
      case 'Stable':
        return { icon: CheckCircle, color: 'text-green-400', text: 'Stable Isotope' };
      case 'Unstable':
        return { icon: AlertTriangle, color: 'text-yellow-400', text: 'Unstable Isotope' };
      case 'Predicted':
        return { icon: FlaskConical, color: 'text-purple-400', text: 'Predicted (Unknown Stability)' };
      default: // Handles 'Unknown'
        return { icon: AlertTriangle, color: 'text-gray-400', text: 'Unknown' };
    }
  };
  const stabilityInfo = getStabilityInfo();

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-lg p-6 text-gray-200 h-full overflow-y-auto shadow-2xl shadow-black/50">
      
      {/* Atom Info Display */}
      <div className="text-center mb-6">
        <input 
          type="text"
          value={atomName}
          onChange={(e) => setAtomName(e.target.value)}
          placeholder="Enter Custom Name"
          className="text-3xl font-bold font-orbitron text-white bg-transparent border-b-2 border-gray-700 focus:border-cyan-400 text-center outline-none w-full pb-2 mb-2"
        />
         <p className="text-lg text-gray-400 mb-1">({atomInfo.name})</p> {/* Show default name */}
        <div className="flex items-center justify-center space-x-2">
          <stabilityInfo.icon className={`w-5 h-5 ${stabilityInfo.color}`} />
          <span className={`text-lg font-medium ${stabilityInfo.color}`}>
            {stabilityInfo.text}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Symbol: {atomInfo.symbol} | Charge: {atomInfo.charge > 0 ? '+' : ''}{atomInfo.charge}
        </p>
      </div>

      {/* Particle Sliders */}
      <div className="space-y-6">
        {/* Protons */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-semibold">Protons (Z)</label>
            <span className="text-xl font-bold font-orbitron text-cyan-400">{protons}</span>
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
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-semibold">Neutrons (N)</label>
            <span className="text-xl font-bold font-orbitron text-gray-400">{neutrons}</span>
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
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-semibold">Electrons</label>
            <span className="text-xl font-bold font-orbitron text-yellow-400">{electrons}</span>
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
      <div className="my-8 space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
          <label htmlFor="stable-mode" className="text-base font-medium flex-grow mr-2 cursor-pointer">Stable Mode</label>
          <Switch 
            id="stable-mode"
            checked={isStableMode}
            onCheckedChange={setIsStableMode}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
          <label htmlFor="viz-mode-button" className="text-base font-medium flex-grow mr-2">
            Visualization: {vizMode === 'bohr' ? 'Bohr Model' : 'Quantum Cloud'}
          </label>
          <button 
            id="viz-mode-button"
            onClick={() => setVizMode(vizMode === 'bohr' ? 'cloud' : 'bohr')}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${vizMode === 'bohr' ? 'Quantum Cloud' : 'Bohr Model'} visualization`}
          >
            {vizMode === 'bohr' ? <FlaskConical className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
          <label htmlFor="antimatter-mode" className="text-base font-medium flex-grow mr-2 cursor-pointer">
            Antimatter Mode
          </label>
          <Switch
            id="antimatter-mode"
            checked={isAntimatter}
            onCheckedChange={setIsAntimatter}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button 
          onClick={handleSave} 
          className="w-full h-12 text-lg"
          disabled={isSaving || !user} // Disable if saving OR no user
          aria-live="polite" // Announce changes for screen readers
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
          {isSaving ? 'Saving...' : 'Save Atom'}
        </Button>
        
        {(!user || user.isAnonymous) && (
          <p className="text-xs text-center text-yellow-400">Sign in to save and publish your creations.</p>
        )}

        {/* Publish Toggle */}
        {user && !user.isAnonymous && (
           <div className="flex items-center justify-center space-x-2 pt-2">
            <Switch
              id="publish-toggle"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              aria-label="Publish to Community Gallery"
            />
            <label htmlFor="publish-toggle" className="text-sm text-gray-400 cursor-pointer">
              Publish to Community Gallery
            </label>
          </div>
        )}
        
        <Button 
          onClick={resetAtom} 
          variant="outline" 
          className="w-full h-12 text-lg"
        >
          <RotateCcw className="w-6 h-6 mr-2" />
          Reset to Hydrogen
        </Button>
      </div>
    </div>
  );
}


