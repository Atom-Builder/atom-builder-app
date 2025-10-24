'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode
} from 'react';
import { useSearchParams } from 'next/navigation';
import { getElementByProton } from '@/data/periodicTable';
import { Stability, AtomInfo } from '@/types'; // Import types

// --- Explicit Context Type Definition ---
// Ensure ALL expected properties are listed here
export interface BuilderContextType {
    protons: number;
    setProtons: (p: number) => void;
    neutrons: number;
    setNeutrons: (n: number) => void;
    electrons: number;
    setElectrons: (e: number) => void;
    atomInfo: AtomInfo | null; // Allow null during initial load/invalid state
    isAntimatter: boolean;
    setIsAntimatter: (a: boolean) => void;
    vizMode: 'bohr' | 'cloud';
    setVizMode: (m: 'bohr' | 'cloud') => void;
    isStableMode: boolean;
    setIsStableMode: (s: boolean) => void;
    resetAtom: () => void;
}
// --- End Definition ---

// Helper function: Calculate stability (simplified model)
const calculateStability = (protons: number, neutrons: number): Stability => {
    if (protons <= 0) return 'Unknown';
    if (protons > 118) return 'Predicted';

    const ratio = neutrons / protons;
    if (protons <= 20) {
        if (neutrons === protons) return 'Stable';
        if (Math.abs(neutrons - protons) <= 2) return 'Unstable';
    } else if (protons <= 82) {
        if (ratio >= 1.2 && ratio <= 1.55) return 'Stable';
        if (ratio >= 1.0 && ratio <= 1.7) return 'Unstable';
    } else {
        if (ratio >= 1.4 && ratio <= 1.65) return 'Unstable';
    }
    return 'Unstable'; // Default if not in known bands
};

// Helper function: Predict properties for hypothetical elements
const predictElement = (protons: number): Omit<AtomInfo, 'charge' | 'stability'> => {
    return {
        protons: protons, // Ensure protons is part of the returned object
        name: `Element-${protons}`,
        symbol: `E${protons}`,
        mass: `(${protons * 2 + Math.round(protons * 0.5)})`,
        neutrons: protons + Math.round(protons * 0.5),
        group: 'Unknown',
        predicted: true,
    };
};


// Create Context
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Provider Component
export const BuilderProvider = ({ children }: { children: ReactNode }) => {
    const searchParams = useSearchParams();

    // Use nullish coalescing for safety
    const initialProtons = parseInt(searchParams?.get('p') ?? '1', 10);
    const initialNeutrons = parseInt(searchParams?.get('n') ?? '0', 10);
    const initialElectrons = parseInt(searchParams?.get('e') ?? '1', 10);

    const [protons, setProtonsState] = useState(initialProtons);
    const [neutrons, setNeutronsState] = useState(initialNeutrons);
    const [electrons, setElectronsState] = useState(initialElectrons);
    const [isAntimatter, setIsAntimatter] = useState(false);
    const [vizMode, setVizMode] = useState<'bohr' | 'cloud'>('bohr');
    const [isStableMode, setIsStableMode] = useState(false);

    // Derive element info and stability
    const atomInfo = useMemo((): AtomInfo | null => { // Allow null return
        // Prevent calculations if protons is invalid immediately
        if (protons <= 0) {
             return {
                protons: 0, symbol: '?', name: 'Invalid', mass: '?', neutrons: 0, group: 'Unknown',
                charge: 0, stability: 'Unknown', predicted: false
             };
        }

        const charge = protons - electrons;
        const elementData = getElementByProton(protons);

        if (elementData) {
            const stability = calculateStability(protons, neutrons);
            return {
                ...elementData,
                charge,
                stability,
                predicted: false,
                neutrons: neutrons // Reflect current neutron state
            };
        } else if (protons > 0 && protons <= 120) { // Prediction range
            const predicted = predictElement(protons);
            const stability = calculateStability(protons, neutrons);
            return {
                ...predicted,
                charge,
                stability,
                neutrons: neutrons // Reflect current neutron state
            };
        }

        // Return null if protons > 120 or other invalid case
        return null;

    }, [protons, neutrons, electrons]);

    // Wrapped setters for Stable Mode logic
    const setProtons = useCallback((p: number) => {
        const newProtons = Math.max(0, p);
        setProtonsState(newProtons);
        if (isStableMode && newProtons > 0) {
            const elementData = getElementByProton(newProtons);
            if (elementData) {
                setNeutronsState(elementData.neutrons);
            } else {
                 const predicted = predictElement(newProtons);
                 setNeutronsState(predicted.neutrons);
            }
            setElectronsState(newProtons);
        }
    }, [isStableMode]);

    const setNeutrons = useCallback((n: number) => {
        if (!isStableMode) {
            setNeutronsState(Math.max(0, n));
        }
    }, [isStableMode]);

     const setElectrons = useCallback((e: number) => {
        setElectronsState(Math.max(0, e));
    }, []);


    useEffect(() => {
        if (isStableMode && protons > 0) {
            const elementData = getElementByProton(protons);
            if (elementData) {
                setNeutronsState(elementData.neutrons);
            } else {
                 const predicted = predictElement(protons);
                 setNeutronsState(predicted.neutrons);
            }
            setElectronsState(protons);
        }
    }, [isStableMode, protons]);


    const resetAtom = useCallback(() => {
        setProtonsState(1);
        setNeutronsState(0);
        setElectronsState(1);
        setIsAntimatter(false);
        setVizMode('bohr');
        setIsStableMode(false);
    }, []);

    // Memoize context value - ensure all properties match BuilderContextType
    const value: BuilderContextType = useMemo(() => ({
        protons, setProtons,
        neutrons, setNeutrons,
        electrons, setElectrons,
        atomInfo, // Can be null now
        isAntimatter, setIsAntimatter,
        vizMode, setVizMode,
        isStableMode, setIsStableMode,
        resetAtom
    }), [
        protons, setProtons,
        neutrons, setNeutrons,
        electrons, setElectrons,
        atomInfo,
        isAntimatter, setIsAntimatter,
        vizMode, setVizMode,
        isStableMode, setIsStableMode,
        resetAtom
    ]);

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};

// Custom Hook
export const useBuilder = (): BuilderContextType => {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
};

