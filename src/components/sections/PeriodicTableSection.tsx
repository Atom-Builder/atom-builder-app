'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { periodicTable } from '@/data/periodicTable'; // Import our single source of truth

// A more comprehensive list of element categories for the filter buttons
const elementGroups = [
    'All', 'Alkali Metal', 'Alkaline Earth Metal', 'Lanthanide', 'Actinide', 
    'Transition Metal', 'Post-transition Metal', 'Metalloid', 'Nonmetal', 'Halogen', 'Noble Gas'
];

// Helper to get element by atomic number
const getElement = (n: number) => periodicTable[n];

// Layout array defines the *structure* of the table using atomic numbers
const periodicTableLayout: (number | string | null)[] = [
  1, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2,
  3, 4, null, null, null, null, null, null, null, null, null, null, 5, 6, 7, 8, 9, 10,
  11, 12, null, null, null, null, null, null, null, null, null, null, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
  55, 56, '57-71', 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
  87, 88, '89-103', 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
];

// Arrays for the separate Lanthanide and Actinide rows
const lanthanideNumbers = Array.from({ length: 15 }, (_, i) => i + 57); // 57-71
const actinideNumbers = Array.from({ length: 15 }, (_, i) => i + 89); // 89-103


const groupColors: { [key: string]: string } = {
    'Nonmetal': 'bg-green-500/20 border-green-500/50',
    'Noble Gas': 'bg-purple-500/20 border-purple-500/50',
    'Alkali Metal': 'bg-red-500/20 border-red-500/50',
    'Alkaline Earth Metal': 'bg-orange-500/20 border-orange-500/50',
    'Metalloid': 'bg-cyan-500/20 border-cyan-500/50',
    'Halogen': 'bg-blue-500/20 border-blue-500/50',
    'Post-transition Metal': 'bg-indigo-500/20 border-indigo-500/50',
    'Transition Metal': 'bg-yellow-500/20 border-yellow-500/50',
    'Lanthanide': 'bg-pink-500/20 border-pink-500/50',
    'Actinide': 'bg-rose-500/20 border-rose-500/50',
};

// This component is now smarter. It receives an `item` (number, string, or null)
// and decides how to render it.
const ElementTile = ({ item, activeFilter }: { item: number | string | null, activeFilter: string }) => {
    if (!item) {
      return <div className="hidden sm:block aspect-square"></div>; // Render empty space
    }

    let el: any;
    let isPlaceholder = false;
    let linkQuery = {};

    if (typeof item === 'number') {
        // It's a real element. Get its data.
        el = getElement(item);
        if (!el) return <div className="hidden sm:block aspect-square"></div>; // Element not found
        linkQuery = { p: el.n, n: el.neutrons, e: el.n };
    } else {
        // It's a string placeholder like '57-71'
        isPlaceholder = true;
        el = {
            s: item,
            g: item === '57-71' ? 'Lanthanide' : 'Actinide',
            name: item === '57-71' ? 'Lanthanides' : 'Actinides',
            n: '' // Set 'n' to empty string for placeholders to prevent errors
        };
        linkQuery = {}; // No link for placeholders
    }
    
    const color = groupColors[el.g] || 'bg-gray-800/50 border-gray-700';
    const isFiltered = activeFilter !== 'All' && el.g !== activeFilter;
    const placeholderStyle = 'bg-gray-800/20 border-gray-800/90 text-sm text-gray-500 italic';

    // This is the visual part of the tile
    const TileContent = () => (
      <div 
          title={el.name ? `${el.n}: ${el.name} (${el.mass || '...'})` : el.g}
          className={`aspect-square border rounded-md flex flex-col items-center justify-center p-1 cursor-pointer
                     hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 hover:!opacity-100 transition-all duration-300 group
                     ${isPlaceholder ? placeholderStyle : color} 
                     ${isFiltered ? 'opacity-20' : 'opacity-100'}`}
      >
          {/* FIX: Check if n is a number before rendering. This solves the bug. */}
          <span className="text-xs text-gray-400 group-hover:text-cyan-300">
            {typeof el.n === 'number' ? el.n : ''}
          </span>
          <span className="text-sm sm:text-lg font-bold text-white">{el.s}</span>
      </div>
    );

    // If it's a placeholder, just render the tile. No link.
    if (isPlaceholder) {
      return <TileContent />;
    }

    // If it's a real element, wrap it in a Link to the builder
    return (
        <Link href={{ pathname: '/builder', query: linkQuery }}>
            <TileContent />
        </Link>
    );
};

export default function PeriodicTableSection() {
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <section id="periodic-table" className="py-20 bg-black/20 overflow-x-auto">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-orbitron">
                        <span className="text-purple-400">🧬 Explore</span> the Elements
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Browse all 118 elements, view their atomic structure, and load them directly into the builder.
                    </p>
                </div>
                
                {/* Filter Controls */}
                <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-8">
                    {elementGroups.map((group) => (
                        <button 
                            key={group} 
                            onClick={() => setActiveFilter(group)}
                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-300 border
                                ${activeFilter === group 
                                    ? 'bg-purple-500/30 text-purple-300 border-purple-500' 
                                    : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/70'
                                }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>

                <div className="w-full min-w-[1000px]">
                    {/* Main Periodic Table Grid: Renders from our layout array */}
                    <div className="grid grid-cols-18 gap-1 mx-auto">
                        {periodicTableLayout.map((item, index) => (
                            <ElementTile key={index} item={item} activeFilter={activeFilter} />
                        ))}
                    </div>

                    {/* Spacer */}
                    <div className="h-4"></div>

                    {/* Lanthanide and Actinide Series */}
                    <div className="grid grid-cols-18 gap-1 mx-auto">
                        <div className="col-span-3"></div> {/* Offset to align */}
                        {lanthanideNumbers.map((num, index) => (
                            <ElementTile key={index} item={num} activeFilter={activeFilter} />
                        ))}
                    </div>
                     <div className="grid grid-cols-18 gap-1 mx-auto mt-1">
                        <div className="col-span-3"></div> {/* Offset to align */}
                        {actinideNumbers.map((num, index) => (
                            <ElementTile key={index} item={num} activeFilter={activeFilter} />
                        ))}
                    </div>
                </div>
                 <p className="text-center mt-8 text-gray-600">Full interactive table coming soon...</p>
            </div>
        </section>
    );
}

