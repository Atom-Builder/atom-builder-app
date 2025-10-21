import { Search, SlidersHorizontal } from 'lucide-react';
import React from 'react';

// Placeholder data for the gallery cards
const placeholderCreations = [
    { user: 'QuantumQuasar', name: 'Stable Helium-8' },
    { user: 'NeutronNora', name: 'Vibrant Neon' },
    { user: 'ProtonPete', name: 'Gilded Gold' },
    { user: 'ElectronEve', name: 'Anti-Hydrogen' },
    { user: 'AtomicArchitect', name: 'Glowing Oganesson' },
    { user: 'MoleculeMaker', name: 'Carbon Diamond Lattice' },
];

// A reusable card component for a single atom creation
const AtomCard = ({ user, name }: { user: string; name: string }) => (
    <div className="group relative aspect-square border border-purple-500/30 rounded-lg bg-black/40 p-4 flex flex-col justify-end overflow-hidden transition-all duration-300 hover:border-purple-500">
        {/* Placeholder for the 3D atom thumbnail */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-2/3 rounded-full bg-purple-900/50 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="w-1/2 h-1/2 rounded-full bg-purple-500/50 blur-lg absolute"></div>
        </div>
        
        {/* Card Content */}
        <div className="relative z-10">
            <h3 className="font-bold text-white truncate">{name}</h3>
            <p className="text-sm text-gray-400">by {user}</p>
        </div>
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
);

export default function CommunityGallerySection() {
    return (
        <section id="community-gallery" className="py-20 bg-black/20">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-orbitron">
                        <span className="text-purple-400">🌐 Community</span> Creations
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Discover atoms designed by other creators. View, remix, and share your own unique designs.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input 
                                type="text"
                                placeholder="Search for atoms, elements, or users..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        </div>
                        <button className="flex-shrink-0 bg-gray-800/50 border border-gray-700 rounded-md px-4 py-3 text-white flex items-center justify-center gap-2 hover:bg-gray-700/70 transition-colors">
                            <SlidersHorizontal size={20} />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {placeholderCreations.map((creation, index) => (
                        <AtomCard key={index} user={creation.user} name={creation.name} />
                    ))}
                     {/* Placeholder card to indicate more content */}
                    <div className="aspect-square border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-gray-600">More Creations Coming Soon...</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
