'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useMemo,
  ReactNode
} from 'react';
import { periodicTable, ElementData } from '@/data/periodicTable';
import { useSearchParams } from 'next/navigation';

// --- NEW STATE ---
export type VizMode = 'bohr' | 'cloud';

// Define the shape of our atom's state
export interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}

// Define the derived state we want our hook to provide
export interface DerivedAtomInfo {
  element: ElementData | null;
  atomicMass: number;
  charge: number;
  chargeLabel: string; // e.g., "Anion", "Cation", "Neutral"
}

// Define the shape of the context
interface BuilderContextType {
  atom: AtomState;
  setAtom: React.Dispatch<React.SetStateAction<AtomState>>;
  derivedInfo: DerivedAtomInfo;
  // --- NEW STATE & FUNCTIONS ---
  isAntimatter: boolean;
  setIsAntimatter: React.Dispatch<React.SetStateAction<boolean>>;
  vizMode: VizMode;
  setVizMode: React.Dispatch<React.SetStateAction<VizMode>>;
  resetAtom: () => void;
}

// Create the context
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Define the props for our provider
interface BuilderProviderProps {
  children: ReactNode;
}

const DEFAULT_ATOM: AtomState = { protons: 1, neutrons: 0, electrons: 1 };

// Helper function to get initial state from URL params
const getInitialState = (searchParams: URLSearchParams): AtomState => {
  const protons = parseInt(searchParams.get('protons') || '1', 10);
  const neutrons = parseInt(searchParams.get('neutrons') || '0', 10);
  const electrons = parseInt(searchParams.get('electrons') || '1', 10);

  // Add validation to keep numbers reasonable
  const validProtons = Math.max(1, Math.min(protons, 118));
  const validNeutrons = Math.max(0, Math.min(neutrons, 177));
  const validElectrons = Math.max(0, Math.min(electrons, 118));

  return {
    protons: validProtons,
    neutrons: validNeutrons,
    electrons: validElectrons,
  };
};

// The provider component
export const BuilderProvider = ({ children }: BuilderProviderProps) => {
  const searchParams = useSearchParams();
  const initialState = getInitialState(searchParams);

  const [atom, setAtom] = useState<AtomState>(initialState);
  // --- NEW STATE ---
  const [isAntimatter, setIsAntimatter] = useState(false);
  const [vizMode, setVizMode] = useState<VizMode>('bohr');

  // This effect will re-sync the state if the URL params change
  React.useEffect(() => {
    setAtom(getInitialState(searchParams));
  }, [searchParams]);

  // --- NEW FUNCTION ---
  const resetAtom = () => {
    setAtom(DEFAULT_ATOM);
    // Note: We don't reset antimatter or viz mode, as those are user preferences
  };

  // Calculate the derived info whenever the atom state changes
  const derivedInfo = useMemo((): DerivedAtomInfo => {
    const { protons, neutrons, electrons } = atom;
    const element = periodicTable[protons] || null;
    const atomicMass = protons + neutrons;
    
    // --- UPDATED CHARGE LOGIC ---
    // Protons are +1, Electrons are -1
    // For antimatter, Protons (anti-protons) are -1, Electrons (positrons) are +1
    const charge = isAntimatter ? (electrons - protons) : (protons - electrons);
    
    let chargeLabel = "Neutral";
    if (charge > 0) chargeLabel = isAntimatter ? "Anti-Anion" : "Cation";
    if (charge < 0) chargeLabel = isAntimatter ? "Anti-Cation" : "Anion";

    return { element, atomicMass, charge, chargeLabel };
  }, [atom, isAntimatter]); // Re-calculate when antimatter mode changes

  const value = useMemo(() => ({
    atom,
    setAtom,
    derivedInfo,
    // --- PASS NEW STATE & FUNCTIONS ---
    isAntimatter,
    setIsAntimatter,
    vizMode,
    setVizMode,
    resetAtom,
  }), [atom, derivedInfo, isAntimatter, vizMode]);

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};

// The custom hook that our components will use
export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};

