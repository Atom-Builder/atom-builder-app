'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo, 
  ReactNode,
  useCallback
} from 'react';
import { useSearchParams } from 'next/navigation';
import { periodicTableData } from '@/data/periodicTable'; // Ensure this is the full 118-element data

// --- 1. DEFINE TYPES ---

// The core state of the atom
interface AtomState {
  protons: number;
  neutrons: number;
  electrons: number;
}

// The output of our "AI" analysis
type StabilityStatus = 'Stable' | 'Unstable' | 'Radioactive' | 'Predicted';
interface StabilityAnalysis {
  status: StabilityStatus;
  reason: string;
}

// The comprehensive info object
interface AtomInfo {
  symbol: string;
  name: string;
  mass: number | string;
  charge: number;
  stability: StabilityAnalysis;
}

// The context's value
interface BuilderContextType {
  atom: AtomState;
  info: AtomInfo;
  isAntimatter: boolean;
  isStableMode: boolean; // <-- NEW
  vizMode: 'bohr' | 'cloud';
  isPublic: boolean;
  
  // Setters
  setProtons: (p: number) => void;
  setNeutrons: (n: number) => void;
  setElectrons: (e: number) => void;
  setIsAntimatter: (isAnti: boolean) => void;
  setVizMode: (mode: 'bohr' | 'cloud') => void;
  setIsPublic: (isPublic: boolean) => void;
  toggleStableMode: () => void; // <-- NEW
  resetAtom: () => void;
  loadPreset: (config: AtomState, isAnti?: boolean) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// --- 2. "AI" LOGIC ---

/**
 * Predicts the most stable number of neutrons for a given number of protons.
 * This is a simplified physics model (the "Band of Stability").
 */
const getStableNeutronCount = (protons: number): number => {
  if (protons === 1) return 0; // Hydrogen-1 (Protium)
  if (protons === 2) return 2; // Helium-4
  if (protons <= 20) {
    // For light elements, N ≈ Z
    const el = periodicTableData[protons];
    if (el) return Math.round(Number(el.mass) - protons);
    return protons; // Fallback
  }
  if (protons <= 82) {
    // For heavier elements, N/Z ratio increases to ~1.5
    return Math.round(protons * (1.25 + (protons / 100)));
  }
  // For Z > 82, all isotopes are radioactive, but we can pick the longest-lived one
  const el = periodicTableData[protons];
  if (el) return Math.round(Number(String(el.mass).replace('(', '').replace(')', '')) - protons);
  
  // Prediction for unknown
  return Math.round(protons * 1.5);
};

/**
 * Our "AI" for analyzing atomic stability.
 * This is a simplified model based on the N/Z ratio.
 */
const calculateStability = (protons: number, neutrons: number): StabilityAnalysis => {
  if (protons > 118) {
    return { status: 'Predicted', reason: 'Hypothetical element beyond the known periodic table.' };
  }
  if (protons > 82) {
    return { status: 'Radioactive', reason: 'All elements with Z > 82 are naturally radioactive.' };
  }

  const stableN = getStableNeutronCount(protons);
  const tolerance = protons <= 20 ? 1 : Math.round(protons * 0.05); // Looser tolerance for heavy atoms

  if (Math.abs(neutrons - stableN) <= tolerance) {
    return { status: 'Stable', reason: `N/Z ratio (${(neutrons/protons).toFixed(2)}) is within the band of stability.` };
  } else if (neutrons < stableN) {
    return { status: 'Unstable', reason: 'Neutron-deficient (proton-rich). Likely to decay via positron emission or electron capture.' };
  } else {
    return { status: 'Unstable', reason: 'Neutron-rich. Likely to decay via beta emission.' };
  }
};

/**
 * Generates IUPAC systematic names for undiscovered elements.
 */
const predictElement = (protons: number): Omit<AtomInfo, 'charge' | 'stability'> => {
  const digits = String(protons).split('');
  const names = ['nil', 'un', 'bi', 'tri', 'quad', 'pent', 'hex', 'sept', 'oct', 'enn'];
  const name = digits.map(d => names[Number(d)]).join('') + 'ium';
  const symbol = digits.map(d => names[Number(d)][0]).join('').toUpperCase();

  return {
    symbol: symbol,
    name: name,
    mass: '?',
  };
};


// --- 3. THE PROVIDER ---

export const BuilderProvider = ({ children }: { children: ReactNode }) => {
  const [atom, setAtom] = useState<AtomState>({ protons: 1, neutrons: 0, electrons: 1 });
  const [isAntimatter, setIsAntimatter] = useState(false);
  const [vizMode, setVizMode] = useState<'bohr' | 'cloud'>('bohr');
  const [isPublic, setIsPublic] = useState(false);
  const [isStableMode, setIsStableMode] = useState(false); // <-- NEW STATE

  // --- 4. URL PRESET LOADER ---
  // This effect runs once on page load to check for URL params
  const searchParams = useSearchParams();
  useEffect(() => {
    const p = searchParams.get('p');
    const n = searchParams.get('n');
    const e = searchParams.get('e');
    if (p) {
      const protons = parseInt(p, 10);
      const neutrons = n ? parseInt(n, 10) : getStableNeutronCount(protons);
      const electrons = e ? parseInt(e, 10) : protons;
      setAtom({ protons, neutrons, electrons });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // --- 5. "AI"-POWERED INFO OBJECT ---
  // This recalculates on every state change
  const info = useMemo((): AtomInfo => {
    const { protons, neutrons, electrons } = atom;
    const charge = protons - electrons;
    const stability = calculateStability(protons, neutrons);
    
    let elementData: Omit<AtomInfo, 'charge' | 'stability'>;

    if (protons > 118) {
      elementData = predictElement(protons);
    } else {
      const el = periodicTableData[protons] || { symbol: '?', name: 'Unknown', mass: '?' };
      elementData = { symbol: el.symbol, name: el.name, mass: el.mass };
    }
    
    return { ...elementData, charge, stability };
  }, [atom]);
  
  // --- 6. ATOM SETTERS (WITH STABLE MODE LOGIC) ---
  
  const setProtons = useCallback((p: number) => {
    if (p < 1) p = 1;
    if (p > 150) p = 150; // Allow prediction up to 150
    setAtom(prev => {
      const newNeutrons = isStableMode ? getStableNeutronCount(p) : prev.neutrons;
      const newElectrons = (prev.electrons === prev.protons) ? p : prev.electrons; // Auto-update electrons if atom was neutral
      return { protons: p, neutrons: newNeutrons, electrons: newElectrons };
    });
  }, [isStableMode]);

  const setNeutrons = useCallback((n: number) => {
    if (n < 0) n = 0;
    if (n > 250) n = 250;
    setIsStableMode(false); // Manually changing neutrons turns off stable mode
    setAtom(prev => ({ ...prev, neutrons: n }));
  }, []);

  const setElectrons = useCallback((e: number) => {
    if (e < 0) e = 0;
    if (e > 150) e = 150;
    setAtom(prev => ({ ...prev, electrons: e }));
  }, []);

  const toggleStableMode = () => {
    setIsStableMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        // When turning stable mode ON, snap to the stable neutron count
        setAtom(prev => ({ ...prev, neutrons: getStableNeutronCount(prev.protons) }));
      }
      return newMode;
    });
  };

  const resetAtom = () => {
    setAtom({ protons: 1, neutrons: 0, electrons: 1 });
    setIsAntimatter(false);
    setVizMode('bohr');
    setIsPublic(false);
    setIsStableMode(false);
  };
  
  const loadPreset = (config: AtomState, isAnti: boolean = false) => {
    setAtom(config);
    setIsAntimatter(isAnti);
    setIsStableMode(false); // Turn off stable mode when loading a preset
  };

  // --- 7. CONTEXT VALUE ---
  const value = useMemo(() => ({
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
    loadPreset
  }), [
    atom, info, isAntimatter, isStableMode, vizMode, isPublic, 
    setProtons, setNeutrons, setElectrons, toggleStableMode
  ]);

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};

