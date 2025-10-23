'use client';

import { useState, useEffect } from 'react';
import { useBuilder } from '@/hooks/useBuilder';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
import { db } from '@/hooks/useAuth';
import { collection, addDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { AtomCreation, Stability } from '@/types';

export default function ControlsPanel() {
    const {
        protons, setProtons,
        neutrons, setNeutrons,
        electrons, setElectrons,
        atomInfo, // This is the object containing name, symbol, etc.
        isAntimatter, setIsAntimatter,
        vizMode, setVizMode,
        isStableMode, setIsStableMode,
        resetAtom
    } = useBuilder();

    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    // Initialize atomName based on the initial atomInfo or empty string
    const [atomName, setAtomName] = useState(atomInfo?.name || "");

    useEffect(() => {
        // --- FIX: Add null check for atomInfo ---
        if (atomInfo && atomInfo.name) {
            setAtomName(atomInfo.name);
        }
        // --- FIX: Add atomInfo to dependency array ---
    }, [atomInfo]);
    // --- END FIX ---


    const handleSave = async () => {
        if (!user || user.isAnonymous) {
            toast.error("Please sign in to save your creations.");
            return;
        }

        setIsSaving(true);
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

            const creationData: Omit<AtomCreation, 'id' | 'publishedAt'> & { publishedAt: FieldValue } = {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                protons,
                neutrons,
                electrons,
                atomName: atomName || (atomInfo ? atomInfo.name : 'Unknown'),
                isPublic: isPublic,
                isAntimatter,
                stability: (atomInfo?.stability ?? 'Unknown') as Stability,
                predicted: atomInfo?.predicted ?? false,
                publishedAt: serverTimestamp()
            };


            const userCreationsCol = collection(db, `artifacts/${appId}/users/${user.uid}/creations`);
            await addDoc(userCreationsCol, creationData);

            if (isPublic) {
                const publicCreationsCol = collection(db, `artifacts/${appId}/public/data/creations`);
                await addDoc(publicCreationsCol, { ...creationData, isPublic: true });
            }

            toast.success("Creation saved successfully!");

        } catch (error: unknown) {
            console.error("Error saving creation: ", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred while saving.");
            }
        }
        setIsSaving(false);
    };

    // Use optional chaining and nullish coalescing for safety
    const stability = atomInfo?.stability ?? 'Unknown';
    const symbol = atomInfo?.symbol ?? '?';
    const charge = atomInfo?.charge ?? 0;
    const currentAtomName = atomInfo?.name ?? "Unknown"; // Get current name safely


    const getStabilityInfo = () => {
        switch (stability) {
            case 'Stable':
                return { icon: CheckCircle, color: 'text-green-400', text: 'Stable Isotope' };
            case 'Unstable':
                return { icon: AlertTriangle, color: 'text-yellow-400', text: 'Unstable Isotope' };
            case 'Predicted':
                return { icon: FlaskConical, color: 'text-purple-400', text: 'Predicted (Unknown Stability)' };
            default:
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
                    // Use currentAtomName safely in placeholder
                    placeholder={currentAtomName || "Enter Atom Name"}
                    className="text-3xl font-bold font-orbitron text-white bg-transparent border-b-2 border-gray-700 focus:border-cyan-400 text-center outline-none w-full pb-2 mb-2"
                />
                <div className="flex items-center justify-center space-x-2">
                    <stabilityInfo.icon className={`w-5 h-5 ${stabilityInfo.color}`} />
                    <span className={`text-lg font-medium ${stabilityInfo.color}`}>
                        {stabilityInfo.text}
                    </span>
                </div>
                <p className="text-sm text-gray-400">
                    Symbol: {symbol} | Charge: {charge > 0 ? '+' : ''}{charge}
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
                    />
                </div>
            </div>

            {/* Toggles & Controls */}
            <div className="my-8 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                    <label htmlFor="stable-mode" className="text-base font-medium">Stable Mode</label>
                    <Switch
                        id="stable-mode"
                        checked={isStableMode}
                        onCheckedChange={setIsStableMode}
                    />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                    <label htmlFor="viz-mode" className="text-base font-medium">
                        Visualization: {vizMode === 'bohr' ? 'Bohr Model' : 'Quantum Cloud'}
                    </label>
                    <button
                        onClick={() => setVizMode(vizMode === 'bohr' ? 'cloud' : 'bohr')}
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        aria-label={`Switch to ${vizMode === 'bohr' ? 'Quantum Cloud' : 'Bohr Model'} visualization`}
                    >
                        {vizMode === 'bohr' ? <FlaskConical className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                    </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-md">
                    <label htmlFor="antimatter-mode" className="text-base font-medium">
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
                    disabled={isSaving || !user || user.isAnonymous}
                >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                    {isSaving ? 'Saving...' : 'Save Atom'}
                </Button>

                {(!user || user.isAnonymous) && (
                    <p className="text-xs text-center text-yellow-400">Sign in to save and publish your creations.</p>
                )}

                {user && !user.isAnonymous && (
                    <div className="flex items-center justify-center space-x-2 pt-2">
                        <Switch
                            id="publish-toggle"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                        <label htmlFor="publish-toggle" className="text-sm text-gray-400">
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

