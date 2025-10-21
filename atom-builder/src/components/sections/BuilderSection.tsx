import React from 'react';

// Simple SVG icon for list items
const FeatureIcon = () => (
    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default function BuilderSection() {
    const features = [
        {
            title: "Adjust Protons, Neutrons, and Electrons",
            description: "Use intuitive sliders to manipulate the core components of your atom."
        },
        {
            title: "Switch Visualization Modes",
            description: "Instantly toggle between the classic Bohr model and a modern Quantum cloud view."
        },
        {
            title: "Enable Antimatter Mode",
            description: "Invert the simulation to explore the exotic properties of antimatter."
        },
        {
            title: "Fine-tune Your Creation",
            description: "Control spin, speed, and glow to design a visually stunning atom."
        }
    ];

    return (
        <section id="builder" className="py-20">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-orbitron">
                        <span className="text-cyan-400">⚛️ Build</span> Your Atom
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        The heart of the application is a powerful, interactive atom sandbox.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Features */}
                    <div className="flex flex-col gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <FeatureIcon />
                                <div>
                                    <h3 className="font-bold text-xl text-white">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Placeholder */}
                    <div className="w-full h-96 bg-black/30 rounded-lg border-2 border-purple-500/30 flex items-center justify-center p-8
                                    shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
                        <div className="text-center text-purple-300">
                            <p className="text-3xl font-bold font-orbitron">Interactive Builder</p>
                            <p className="text-md text-gray-500 mt-2">Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
