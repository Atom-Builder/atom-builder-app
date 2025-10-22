'use client';

import { useState } from 'react';
import Link from 'next/link';
// 1. FIX: Import GridElement type
import { periodicTable, elementGroups, ElementData, GridElement, PlaceholderElement } from '@/data/periodicTable'; 
import { Check } from 'lucide-react';

// 2. FIX: Define ElementTileProps using GridElement
interface ElementTileProps {
  el: GridElement; 
  activeFilter: string;
}

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
  'Unknown': 'bg-gray-700/20 border-gray-700/50',
};

// Type guard to check if an element is ElementData (real element)
const isElementData = (el: GridElement): el is ElementData => {
  return el !== null && typeof el === 'object' && 'protons' in el;
}

// 3. STRONGLY TYPED COMPONENT
const ElementTile = ({ el, activeFilter }: ElementTileProps) => {
  if (!el) return <div className="hidden sm:block aspect-square"></div>; // Render nothing for null

  // Use the type guard
  if (!isElementData(el)) {
     // It's a PlaceholderElement
     const placeholder = el as PlaceholderElement; // Type assertion
     const isFiltered = activeFilter !== 'All' && placeholder.g !== activeFilter;
     return (
      <div 
        className={`aspect-square border rounded-md flex items-center justify-center p-1
                    bg-gray-800/20 border-gray-800/90 text-xs text-gray-500 italic
                    ${isFiltered ? 'opacity-20' : 'opacity-100'}`}
      >
        {placeholder.s}
      </div>
    );
  }
  
  // It's a real element (ElementData)
  const element = el as ElementData; // Can safely assert type now
  const color = groupColors[element.group] || groupColors['Unknown'];
  const isFiltered = activeFilter !== 'All' && element.group !== activeFilter;
  
  return (
    <Link
      href={`/builder?p=${element.protons}&n=${element.neutrons}&e=${element.protons}`}
      title={`${element.protons}: ${element.name} (${element.mass})`}
      className={`relative aspect-square border rounded-md flex flex-col items-center justify-center p-1 cursor-pointer
                 group transition-all duration-300
                 ${color}
                 ${isFiltered ? 'opacity-20' : 'opacity-100'}
                 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 hover:!opacity-100`}
    >
      <span className="absolute top-1 left-1 text-xs text-gray-400 group-hover:text-cyan-300">{element.protons}</span>
      <span className="text-sm sm:text-lg font-bold text-white">{element.symbol}</span>
      <span className="hidden sm:block text-xs text-gray-300 truncate group-hover:text-cyan-200">{element.name}</span>
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
              className={`relative px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-300 border
                          ${activeFilter === group 
                              ? 'bg-purple-500/30 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30' 
                              : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/70 hover:border-gray-500'
                          }`}
            >
              {activeFilter === group && (
                <Check className="w-4 h-4 absolute -top-1.5 -right-1.5 text-purple-300 bg-gray-900 rounded-full p-0.5" />
              )}
              {group}
            </button>
          ))}
        </div>

        {/* Periodic Table Container */}
        {/* Increased min-width for better spacing, centered with mx-auto */}
        <div className="w-full min-w-[1100px] xl:min-w-full xl:w-max mx-auto">
          {/* Main Periodic Table Grid */}
          <div className="grid grid-cols-18 gap-1 mx-auto">
             {/* Render main table elements */}
            {periodicTable.main.map((el, index) => (
              <ElementTile key={`main-${index}`} el={el} activeFilter={activeFilter} />
            ))}
          </div>

          {/* Spacer */}
          <div className="h-4"></div>

          {/* Lanthanide and Actinide Series */}
          {/* Adjust width and grid columns for these series */}
          <div className="grid grid-cols-15 gap-1 mx-auto w-[calc(15/18*100%)] ml-[calc(1.5/18*100%)]"> {/* Approx 15/18 width and offset */}
             {/* Render Lanthanides */}
            {periodicTable.lanthanides.map((el, index) => (
              <ElementTile key={`lan-${index}`} el={el} activeFilter={activeFilter} />
            ))}
          </div>
           <div className="grid grid-cols-15 gap-1 mx-auto w-[calc(15/18*100%)] ml-[calc(1.5/18*100%)] mt-1"> {/* Same width/offset, margin top */}
             {/* Render Actinides */}
            {periodicTable.actinides.map((el, index) => (
              <ElementTile key={`act-${index}`} el={el} activeFilter={activeFilter} />
            ))}
          </div>
        </div>
         <p className="text-center mt-8 text-gray-600">Click an element to load it in the builder!</p>
      </div>
    </section>
  );
}

