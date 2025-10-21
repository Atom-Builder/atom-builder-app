'use client';
import { useGraphicsSettings, GraphicsSetting } from '@/hooks/useGraphicsSettings';
import { X, Check } from 'lucide-react';
import React from 'react';

// Define the props for our modal component
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const settingsOptions: { id: GraphicsSetting; title: string; description: string }[] = [
    { id: 'low', title: 'Low (Default)', description: 'Fastest experience. Disables all animations and 3D effects.' },
    { id: 'medium', title: 'Medium', description: 'Enables particle animations and enhanced UI effects.' },
    { id: 'high', title: 'High (Immersive)', description: 'Full experience. Enables the 3D hero model and intensive effects.' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { settings, setSettings } = useGraphicsSettings();

    // If the modal isn't open, don't render anything
    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Modal Panel */}
            <div 
                className="w-full max-w-md bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 p-6"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-orbitron text-white">Graphics Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {settingsOptions.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => setSettings(option.id)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-center
                                ${settings === option.id
                                    ? 'bg-cyan-500/20 border-cyan-500'
                                    : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50'
                                }`}
                        >
                            <div className="flex-grow">
                                <h3 className="font-bold text-white">{option.title}</h3>
                                <p className="text-sm text-gray-400">{option.description}</p>
                            </div>
                            {settings === option.id && <Check className="text-cyan-400 ml-4" size={20} />}
                        </div>
                    ))}
                </div>
                 <p className="text-xs text-gray-600 mt-6 text-center">Your preference is saved automatically in your browser.</p>
            </div>
        </div>
    );
}
