'use client';

import { useBuilder } from "@/hooks/useBuilder";
import { Atom, CircuitBoard, RefreshCcw, Sparkles } from "lucide-react";

// A reusable slider component
const ParticleSlider = ({ label, value, max, color, onChange }: {
  label: string;
  value: number;
  max: number;
  color: string;
  onChange: (newValue: number) => void;
}) => (
  <div className="mb-4">
    <label className="flex justify-between items-center text-lg font-medium text-gray-300">
      <span>{label}</span>
      <span className={`font-orbitron text-xl ${color}`}>{value}</span>
    </label>
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
      style={{ accentColor: color.replace('text-', '') }} // A bit of a hack to get color
    />
  </div>
);

// A reusable toggle component
const ToggleButton = ({ label, icon: Icon, enabled, onClick }: {
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2
      transition-all duration-300
      ${enabled
        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
        : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
      }
    `}
  >
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

export default function ControlsPanel() {
  const { 
    atom, 
    setAtom, 
    derivedInfo,
    // --- GET NEW STATE & FUNCTIONS ---
    isAntimatter,
    setIsAntimatter,
    vizMode,
    setVizMode,
    resetAtom
  } = useBuilder();

  // --- GET PARTICLE LABELS ---
  const protonLabel = isAntimatter ? 'Anti-Protons' : 'Protons';
  const electronLabel = isAntimatter ? 'Positrons' : 'Electrons';
  const neutronLabel = isAntimatter ? 'Anti-Neutrons' : 'Neutrons';

  return (
    <div className="w-full h-full bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 overflow-y-auto shadow-2xl shadow-black/50 border border-gray-700/50">
      
      {/* Element Info Display */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-orbitron font-bold text-white">
          {derivedInfo.element?.symbol || '??'}
        </h2>
        <h3 className="text-2xl text-cyan-400">
          {isAntimatter ? 'Anti-' : ''}{derivedInfo.element?.name || 'Unknown Element'}
        </h3>
        <div className="flex justify-center items-baseline gap-3 mt-2">
          <span className="text-lg text-gray-400">
            Mass: {derivedInfo.atomicMass}
          </span>
          <span className={`text-lg font-bold ${
            derivedInfo.charge === 0 ? 'text-gray-400' : (derivedInfo.charge > 0 ? 'text-green-400' : 'text-red-400')
          }`}>
            Charge: {derivedInfo.charge > 0 ? '+' : ''}{derivedInfo.charge}
            <span className="text-sm ml-1">({derivedInfo.chargeLabel})</span>
          </span>
        </div>
      </div>
      
      {/* Particle Sliders */}
      <div className="mb-6">
        <ParticleSlider
          label={protonLabel}
          value={atom.protons}
          max={118}
          color={isAntimatter ? 'text-cyan-400' : 'text-red-400'} // Flipped
          onChange={(val) => setAtom(a => ({ ...a, protons: val }))}
        />
        <ParticleSlider
          label={neutronLabel}
          value={atom.neutrons}
          max={177} // Max neutrons for Oganesson-294
          color="text-purple-400"
          onChange={(val) => setAtom(a => ({ ...a, neutrons: val }))}
        />
        <ParticleSlider
          label={electronLabel}
          value={atom.electrons}
          max={118}
          color={isAntimatter ? 'text-red-400' : 'text-cyan-400'} // Flipped
          onChange={(val) => setAtom(a => ({ ...a, electrons: val }))}
        />
      </div>

      {/* --- NEW TOGGLES & BUTTONS --- */}
      <div className="grid grid-cols-3 gap-3">
        <ToggleButton
          label="Antimatter"
          icon={Sparkles}
          enabled={isAntimatter}
          onClick={() => setIsAntimatter(prev => !prev)}
        />
        <ToggleButton
          label={vizMode === 'bohr' ? 'Bohr Model' : 'Cloud Model'}
          icon={CircuitBoard}
          enabled={vizMode === 'cloud'}
          onClick={() => setVizMode(prev => (prev === 'bohr' ? 'cloud' : 'bohr'))}
        />
        <button
          onClick={resetAtom}
          className="flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2
                     bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700
                     transition-all duration-300"
        >
          <RefreshCcw className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Reset</span>
        </button>
      </div>

    </div>
  );
}

