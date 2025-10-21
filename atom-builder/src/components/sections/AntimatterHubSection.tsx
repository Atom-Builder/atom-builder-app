'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Using lucide-react for a clean icon

// Data for our knowledge panels
const hubTopics = [
    {
        title: 'What is an Atom?',
        content: 'An atom is the smallest unit of ordinary matter that forms a chemical element. Every solid, liquid, gas, and plasma is composed of neutral or ionized atoms. Atoms are extremely small, typically around 100 picometers across.'
    },
    {
        title: 'What is Antimatter?',
        content: 'Antimatter is the opposite of normal matter. For every particle of matter, there is a corresponding antiparticle with the same mass but opposite charge. When matter and antimatter meet, they annihilate each other in a burst of energy.'
    },
    {
        title: 'Quantum Models',
        content: 'Instead of electrons orbiting the nucleus like planets, the quantum model describes them as existing in probability clouds called orbitals. It\'s impossible to know both the exact position and momentum of an electron simultaneously.'
    }
];

export default function AntimatterHubSection() {
    // State to track the currently expanded panel
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        // If the clicked panel is already open, close it. Otherwise, open it.
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section id="antimatter-hub" className="py-20 bg-gray-900">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-orbitron">
                        <span className="text-cyan-400">💫 The Antimatter</span> Hub
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Dive into the mysteries of antimatter, quantum clouds, and atomic energy with these primers.
                    </p>
                </div>

                {/* Accordion Panels */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {hubTopics.map((topic, index) => (
                        <div key={index} className="border border-cyan-500/30 rounded-lg backdrop-blur-sm bg-black/30 overflow-hidden">
                            <button 
                                onClick={() => handleToggle(index)}
                                className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg"
                            >
                                <span>{topic.title}</span>
                                <ChevronDown 
                                    className={`transform transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : 'rotate-0'}`} 
                                />
                            </button>
                            {/* Expandable content area */}
                            <div 
                                className={`transition-all duration-500 ease-in-out grid ${expandedIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-5 pb-5 text-gray-400">
                                        {topic.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
