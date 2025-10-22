'use client';

import { useBuilder } from '@/hooks/useBuilder';
import { useAuth } from '@/hooks/useAuth';
import { Save, Loader2, RotateCcw, Zap, Sparkles, Sliders, FlaskConical, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react'; // <-- Import useEffect
import Link from 'next/link';

// --- Fallback UI Components (as before) ---
const FallbackSlider = ({ value, onValueChange, ...props }: any) => (
  <input
    type="range"
    value={value}
    onChange={(e) => onValueChange(Number(e.target.value))}
    {...props}
    className={`w-full h-2 rounded-lg appearance-none cursor-pointer range-slider ${props.particle}`}
  />
);
const FallbackSwitch = ({ checked, onCheckedChange, ...props }: any) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${checked ? 'bg-cyan-500' : 'bg-gray-600'}`}
    {...props}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                  ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);
const FallbackButton = ({ children, ...props }: any) => (
  <button
    {...props}
    className="w-full flex items-center justify-center p-3 rounded-lg text-lg font-semibold
               disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
               transition-all"
  >
    {children}
  </button>
);
// --- End Fallback UI ---

// Particle Slider Component
const ParticleSlider = ({ label, value, min, max, onChange, colorClass, particle }: any) => (
  <div>
    <label className="flex justify-between items-center text-sm font-medium text-gray-300">
      <span>{label}</span>
      <span className={`font-bold text-lg ${colorClass}`}>{value}</span>
    </label>
    <FallbackSlider 
      min={min} 
      max={max} 
      value={value} 
      onValueChange={onChange} 
      particle={particle}
    />
  </div>
);

// New component for the AI Stability readouts
const StabilityDisplay = ({ info }: { info: any }) => {
  const { status, reason } = info.stability;
  
  let Icon = HelpCircle;
  let colorClass = 'text-gray-400';
  let bgColor = 'bg-gray-800/50';

  switch (status) {
    case 'Stable':
      Icon = CheckCircle;
      colorClass = 'text-green-400';
      bgColor = 'bg-green-900/30';
      break;
    case 'Unstable':
      Icon = AlertTriangle;
      colorClass = 'text-yellow-400';
      bgColor = 'bg-yellow-900/30';
      break;
    case 'Radioactive':
      Icon = AlertTriangle;
      colorClass = 'text-red-400';
      bgColor = 'bg-red-900/30';
      break;
    case 'Predicted':
      Icon = FlaskConical;
      colorClass = 'text-cyan-400';
      bgColor = 'bg-cyan-900/30';
      break;
  }

  return (
    <div className={`p-4 rounded-xl border ${bgColor} border-gray-700 space-y-2`}>
      <div className={`flex items-center text-lg font-semibold ${colorClass}`}>
        <Icon className="w-5 h-5 mr-2" />
        <span>AI Analysis: {status}</span>
      </div>
      <p className="text-sm text-gray-400">
        {reason}
      </p>
    </div>
  );
};


export default function ControlsPanel() {
  const {
    atom,
    info,
    isAntimatter,
    isStableMode,
    vizMode,
    isPublic,
    setProtons,
    setNeutrons,
    setElectrons,
    setIsAntimatter,
    setVizMode,
    setIsPublic,
    toggleStableMode,
    resetAtom,
  } = useBuilder();

  const { saveCreation, user, loading: authLoading } = useAuth();
  const [atomName, setAtomName] = useState(''); // <-- FIX: Removed extra '='
  
  // Update atomName when the element changes
  useEffect(() => {
    setAtomName(isAntimatter ? `Anti-${info.name}` : info.name);
  }, [info.name, isAntimatter]);

  const isAnonymous = user ? user.isAnonymous : true;

  const handleSave = () => {
    if (isAnonymous) {
      alert('Please sign in to save your creations.');
      return;
    }
    
    // Use the current atomName, or prompt if it's empty
    const finalName = atomName.trim() === '' ? info.name : atomName.trim();

    saveCreation({
      name: finalName,
      username: user?.displayName || user?.email || 'Anonymous', // Use optional chaining
      atom_config: atom, // Pass the whole atom object
      is_antimatter: isAntimatter,
      is_public: isPublic,
    });
    
    alert(`Creation "${finalName}" saved! ${isPublic ? 'Published to gallery.' : 'Saved privately.'}`);
    // Reset isPublic toggle after saving
    if (isPublic) setIsPublic(false);
  };

  return (
    <div className="h-full bg-gray-900/80 backdrop-blur-md border-l border-gray-700/50 p-6 overflow-y-auto space-y-6">
      
      {/* Element Display */}
      <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <h2 className="text-4xl font-orbitron font-bold text-white" title={info.name}>
          {info.symbol}
        </h2>
        <p className="text-lg text-gray-300">{isAntimatter ? `Anti-${info.name}` : info.name}</p>
        <p className={`text-lg font-semibold ${info.charge === 0 ? 'text-gray-400' : (info.charge > 0 ? 'text-red-400' : 'text-cyan-400')}`}>
          Charge: {info.charge > 0 ? '+' : ''}{info.charge}
        </p>
      </div>

      {/* --- NEW: AI Stability Display --- */}
      <StabilityDisplay info={info} />

      {/* Particle Sliders */}
      <div className="space-y-4">
        <ParticleSlider 
          label={isAntimatter ? 'Anti-Protons' : 'Protons'}
          value={atom.protons} 
          min={1} 
          max={150} // Extended for prediction 
          onChange={setProtons} 
          colorClass="text-red-400"
          particle="proton"
        />
        <ParticleSlider 
          label="Neutrons" 
          value={atom.neutrons} 
          min={0} 
          max={250} // Extended for prediction
          onChange={setNeutrons}
          colorClass="text-purple-400"
          particle="neutron"
        />
        <ParticleSlider 
          label={isAntimatter ? 'Positrons' : 'Electrons'}
          value={atom.electrons} 
          min={0} 
          max={150} // Extended for prediction
          onChange={setElectrons}
          colorClass="text-cyan-400"
          particle="electron"
        />
      </div>

      {/* Mode Toggles */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        {/* --- NEW: Stable Mode Toggle --- */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center">
            <Sliders className={`w-5 h-5 mr-3 ${isStableMode ? 'text-green-400' : 'text-gray-500'}`} />
            <span className="text-white font-medium">Stable Mode</span>
          </div>
          <FallbackSwitch
            checked={isStableMode}
            onCheckedChange={toggleStableMode}
          />
        </div>
        
        {/* --- FIX: Corrected the broken className --- */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center">
            <Zap className={`w-5 h-5 mr-3 ${isAntimatter ? 'text-yellow-400' : 'text-gray-500'}`} />
            <span className="text-white font-medium">Antimatter Mode</span>
          </div>
          <FallbackSwitch
            checked={isAntimatter}
            onCheckedChange={setIsAntimatter}
          />
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center">
            <Sparkles className={`w-5 h-5 mr-3 ${vizMode === 'cloud' ? 'text-cyan-400' : 'text-gray-500'}`} />
            <span className="text-white font-medium">Quantum Cloud</span>
          </div>
          <FallbackSwitch
            checked={vizMode === 'cloud'}
            onCheckedChange={(checked) => setVizMode(checked ? 'cloud' : 'bohr')}
          />
        </div>
      </div>

      {/* Save & Reset */}
      <div className="pt-4 border-t border-gray-700 space-y-4">
        {/* Save Name Input */}
        <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg">
          <input 
            type="text"
            value={atomName}
            onChange={(e) => setAtomName(e.target.value)}
            placeholder="Name your creation..."
            className="flex-1 bg-transparent border-b border-gray-600 focus:border-cyan-500 focus:outline-none text-white disabled:opacity-50"
            disabled={isAnonymous}
          />
          <div className="flex items-center space-x-2" title="Publish to public gallery?">
            <label htmlFor="publish-switch" className="text-sm text-gray-400">Publish</label>
            <FallbackSwitch
              id="publish-switch"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isAnonymous}
            />
          </div>
        </div>

        {/* Save Button */}
        <FallbackButton
          onClick={handleSave}
          disabled={authLoading || isAnonymous}
          className={isAnonymous 
            ? 'bg-gray-600 text-gray-400' 
            : (isPublic 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white')
          }
        >
          {authLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 mr-2" />}
          {isAnonymous ? 'Sign In to Save' : (isPublic ? 'Save & Publish' : 'Save Privately')}
        </FallbackButton>

        {/* Reset Button */}
        <FallbackButton
          onClick={resetAtom}
          className="bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 text-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Hydrogen
        </FallbackButton>
      </div>

    </div>
  );
}

