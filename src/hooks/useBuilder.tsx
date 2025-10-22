'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo,
  ReactNode,
  useCallback
} from 'react';
import { useSearchParams } from 'next/navigation';
import { periodicTable } from '@/data/periodicTable'; // Ensure this is the full 118-element data



// --- 1. DEFINE TYPES ---
// (interfaces are the same)
interface Atom {
  protons: number;
  neutrons: number;
  electrons: number;
}
interface AtomInfo {
  symbol: string;
  name: string;
  charge: number;
  mass: number;
  stability: {
    status: 'Stable' | 'Unstable' | 'Radioactive' | 'Predicted' | 'Unknown';
    reason: string;
  };
}

interface BuilderContextType {
  atom: Atom;
  info: AtomInfo;
  isAntimatter: boolean;
  isStableMode: boolean;
  vizMode: 'bohr' | 'cloud';
  isPublic: boolean;
  setProtons: (val: number) => void;
  setNeutrons: (val: number) => void;
  setElectrons: (val: number) => void;
  setIsAntimatter: (val: boolean) => void;
  setVizMode: (val: 'bohr' | 'cloud') => void;
  setIsPublic: (val: boolean) => void;
  toggleStableMode: () => void;
  resetAtom: () => void;
}

// Helper function to get the most stable neutron count for a proton number
// This is a simplified physics model (the "band of stability")
const getStableNeutronCount = (protons: number): number => {
  if (protons === 1) return 0; // Hydrogen-1
  if (protons <= 20) {
    return protons; // For light elements, N ≈ Z
  }
  // For heavier elements, N > Z. This is a rough approximation.
  const n = Math.floor(protons * (1 + (protons / 100)));
  
  // Let's use the actual data if we have it
  const element = periodicTable[protons];
  if (element) {
    // Return the neutron count for the most stable isotope
    // We get this by rounding the atomic mass and subtracting protons
    const stableMass = Math.round(element.mass);
    return stableMass - protons;
  }
  
  // Fallback for predicted elements
  return Math.max(protons, n);
};

// --- 2. THE "AI" - STABILITY CALCULATION ---
const calculateStability = (protons: number, neutrons: number): AtomInfo['stability'] => {
  const element = periodicTable[protons];

  // A. Predicted Elements (Beyond our 118-element dataset)
  if (!element) {
    if (protons > 150 || neutrons > 250) {
       return { status: 'Unknown', reason: 'Particle count exceeds theoretical simulation limits.' };
    }
    // This is the "Island of Stability" concept, simplified
    const magicNumbers = [126, 184];
    const isMagic = magicNumbers.includes(protons) || magicNumbers.includes(neutrons);
    const ratio = neutrons / protons;

    if (isMagic && ratio > 1.4 && ratio < 1.7) {
      return { 
        status: 'Predicted', 
        reason: 'This hypothetical nucleus falls within a predicted "Island of Stability." It may have a longer half-life.' 
      };
    }
    return { 
      status: 'Predicted', 
      reason: 'This is a hypothetical, undiscovered element. Its properties are unknown.' 
    };
  }

  // B. Known Elements (1-118)
  const stableNeutrons = getStableNeutronCount(protons);
  const mass = protons + neutrons;

  if (protons > 83) { // All elements after Bismuth are radioactive
    return {
      status: 'Radioactive',
      reason: `All isotopes of ${element.name} (elements > 83) are radioactive and decay over time.`
    };
  }

  const neutronDiff = Math.abs(neutrons - stableNeutrons);
  
  if (neutronDiff === 0) {
    return {
      status: 'Stable',
      reason: `This is the most common and stable isotope of ${element.name}.`
    };
  }
  
  if (neutronDiff <= 2) {
    return {
      status: 'Unstable',
      reason: `This isotope (${mass}${element.symbol}) is known but unstable. It will likely decay.`
    };
  }

  return {
    status: 'Unstable',
    reason: `This nucleus has a highly unstable neutron-to-proton ratio and would decay almost instantly.`
  };
};

// --- 3. PREDICTION & DERIVATION LOGIC ---
const getAtomInfo = (atom: Atom): AtomInfo => {
  const { protons, neutrons, electrons } = atom;
  const element = periodicTable[protons];

  if (element) {
    return {
      symbol: element.symbol,
      name: element.name,
      charge: protons - electrons,
      mass: protons + neutrons, // This is the mass number, not atomic weight
      stability: calculateStability(protons, neutrons),
    };
  }
  
  // Fallback for predicted elements
  const predictedSymbol = `E${protons}`;
  const predictedName = `Element-${protons}`;
  
  return {
    symbol: predictedSymbol,
    name: predictedName,
    charge: protons - electrons,
    mass: protons + neutrons,
    stability: calculateStability(protons, neutrons),
  };
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// --- 4. THE PROVIDER ---
export const BuilderProvider = ({ children }: { children: ReactNode }) => {
  const [atom, setAtom] = useState<Atom>({ protons: 1, neutrons: 0, electrons: 1 });
  const [info, setInfo] = useState<AtomInfo>(() => getAtomInfo(atom));
  const [isAntimatter, setIsAntimatter] = useState(false);
  const [vizMode, setVizMode] = useState<'bohr' | 'cloud'>('bohr');
  const [isStableMode, setIsStableMode] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  
  const searchParams = useSearchParams();

  // Effect to load atom from URL
  useEffect(() => {
    const p = searchParams.get('p');
    const n = searchParams.get('n');
    const e = searchParams.get('e');

    if (p && n && e) {
      const protons = parseInt(p, 10);
      const neutrons = parseInt(n, 10);
      const electrons = parseInt(e, 10);
      if (!isNaN(protons) && !isNaN(neutrons) && !isNaN(electrons)) {
        setAtom({ protons, neutrons, electrons });
        setIsStableMode(false); // Disable stable mode when loading a custom atom
      }
    }
  }, [searchParams]);
  
  // Effect to update info when atom changes
  useEffect(() => {
    setInfo(getAtomInfo(atom));
  }, [atom]);

  // --- 5. STATE SETTERS ---
  const setProtons = useCallback((protons: number) => {
    setAtom(prev => {
      const newNeutrons = isStableMode ? getStableNeutronCount(protons) : prev.neutrons;
      return { protons, neutrons: newNeutrons, electrons: protons };
    });
  }, [isStableMode]);

  const setNeutrons = useCallback((neutrons: number) => {
    setIsStableMode(false); // Manually changing neutrons disables stable mode
    setAtom(prev => ({ ...prev, neutrons }));
  }, []);

  const setElectrons = useCallback((electrons: number) => {
    setAtom(prev => ({ ...prev, electrons }));
  }, []);
  
  const toggleStableMode = useCallback(() => {
    setIsStableMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        // When turning stable mode ON, snap to the stable neutron count
        setAtom(prev => ({ ...prev, neutrons: getStableNeutronCount(prev.protons) }));
      }
      return newMode;
    });
  }, []);

  const resetAtom = useCallback(() => {
    setAtom({ protons: 1, neutrons: 0, electrons: 1 });
    setIsAntimatter(false);
    setVizMode('bohr');
    setIsStableMode(false);
    setIsPublic(false);
  }, []);

  // --- 6. CONTEXT VALUE ---
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
    resetAtom
  }), [
    atom, info, isAntimatter, isStableMode, vizMode, isPublic, 
    setProtons, setNeutrons, setElectrons, toggleStableMode, resetAtom
  ]);

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};

// --- 7. THE HOOK ---
export const useBuilder = (): BuilderContextType => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
};

