'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Import the Link component

// A more comprehensive list of element categories for the filter buttons
const elementGroups = [
    'All', 'Alkali Metal', 'Alkaline Earth Metal', 'Lanthanide', 'Actinide', 
    'Transition Metal', 'Post-transition Metal', 'Metalloid', 'Nonmetal', 'Halogen', 'Noble Gas'
];

// Complete dataset for the periodic table with name and mass.
// null represents an empty space in the 18-column grid.
const periodicTableElements = [
  { s: 'H', n: 1, name: 'Hydrogen', mass: 1.008, g: 'Nonmetal' }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { s: 'He', n: 2, name: 'Helium', mass: 4.0026, g: 'Noble Gas' },
  { s: 'Li', n: 3, name: 'Lithium', mass: 6.94, g: 'Alkali Metal' }, { s: 'Be', n: 4, name: 'Beryllium', mass: 9.0122, g: 'Alkaline Earth Metal' }, null, null, null, null, null, null, null, null, null, null, { s: 'B', n: 5, name: 'Boron', mass: 10.81, g: 'Metalloid' }, { s: 'C', n: 6, name: 'Carbon', mass: 12.011, g: 'Nonmetal' }, { s: 'N', n: 7, name: 'Nitrogen', mass: 14.007, g: 'Nonmetal' }, { s: 'O', n: 8, name: 'Oxygen', mass: 15.999, g: 'Nonmetal' }, { s: 'F', n: 9, name: 'Fluorine', mass: 18.998, g: 'Halogen' }, { s: 'Ne', n: 10, name: 'Neon', mass: 20.180, g: 'Noble Gas' },
  { s: 'Na', n: 11, name: 'Sodium', mass: 22.990, g: 'Alkali Metal' }, { s: 'Mg', n: 12, name: 'Magnesium', mass: 24.305, g: 'Alkaline Earth Metal' }, null, null, null, null, null, null, null, null, null, null, { s: 'Al', n: 13, name: 'Aluminum', mass: 26.982, g: 'Post-transition Metal' }, { s: 'Si', n: 14, name: 'Silicon', mass: 28.085, g: 'Metalloid' }, { s: 'P', n: 15, name: 'Phosphorus', mass: 30.974, g: 'Nonmetal' }, { s: 'S', n: 16, name: 'Sulfur', mass: 32.06, g: 'Nonmetal' }, { s: 'Cl', n: 17, name: 'Chlorine', mass: 35.45, g: 'Halogen' }, { s: 'Ar', n: 18, name: 'Argon', mass: 39.948, g: 'Noble Gas' },
  { s: 'K', n: 19, name: 'Potassium', mass: 39.098, g: 'Alkali Metal' }, { s: 'Ca', n: 20, name: 'Calcium', mass: 40.078, g: 'Alkaline Earth Metal' }, { s: 'Sc', n: 21, name: 'Scandium', mass: 44.956, g: 'Transition Metal' }, { s: 'Ti', n: 22, name: 'Titanium', mass: 47.867, g: 'Transition Metal' }, { s: 'V', n: 23, name: 'Vanadium', mass: 50.942, g: 'Transition Metal' }, { s: 'Cr', n: 24, name: 'Chromium', mass: 51.996, g: 'Transition Metal' }, { s: 'Mn', n: 25, name: 'Manganese', mass: 54.938, g: 'Transition Metal' }, { s: 'Fe', n: 26, name: 'Iron', mass: 55.845, g: 'Transition Metal' }, { s: 'Co', n: 27, name: 'Cobalt', mass: 58.933, g: 'Transition Metal' }, { s: 'Ni', n: 28, name: 'Nickel', mass: 58.693, g: 'Transition Metal' }, { s: 'Cu', n: 29, name: 'Copper', mass: 63.546, g: 'Transition Metal' }, { s: 'Zn', n: 30, name: 'Zinc', mass: 65.38, g: 'Transition Metal' }, { s: 'Ga', n: 31, name: 'Gallium', mass: 69.723, g: 'Post-transition Metal' }, { s: 'Ge', n: 32, name: 'Germanium', mass: 72.630, g: 'Metalloid' }, { s: 'As', n: 33, name: 'Arsenic', mass: 74.922, g: 'Metalloid' }, { s: 'Se', n: 34, name: 'Selenium', mass: 78.971, g: 'Nonmetal' }, { s: 'Br', n: 35, name: 'Bromine', mass: 79.904, g: 'Halogen' }, { s: 'Kr', n: 36, name: 'Krypton', mass: 83.798, g: 'Noble Gas' },
  { s: 'Rb', n: 37, name: 'Rubidium', mass: 85.468, g: 'Alkali Metal' }, { s: 'Sr', n: 38, name: 'Strontium', mass: 87.62, g: 'Alkaline Earth Metal' }, { s: 'Y', n: 39, name: 'Yttrium', mass: 88.906, g: 'Transition Metal' }, { s: 'Zr', n: 40, name: 'Zirconium', mass: 91.224, g: 'Transition Metal' }, { s: 'Nb', n: 41, name: 'Niobium', mass: 92.906, g: 'Transition Metal' }, { s: 'Mo', n: 42, name: 'Molybdenum', mass: 95.96, g: 'Transition Metal' }, { s: 'Tc', n: 43, name: 'Technetium', mass: '(98)', g: 'Transition Metal' }, { s: 'Ru', n: 44, name: 'Ruthenium', mass: 101.07, g: 'Transition Metal' }, { s: 'Rh', n: 45, name: 'Rhodium', mass: 102.91, g: 'Transition Metal' }, { s: 'Pd', n: 46, name: 'Palladium', mass: 106.42, g: 'Transition Metal' }, { s: 'Ag', n: 47, name: 'Silver', mass: 107.87, g: 'Transition Metal' }, { s: 'Cd', n: 48, name: 'Cadmium', mass: 112.41, g: 'Transition Metal' }, { s: 'In', n: 49, name: 'Indium', mass: 114.82, g: 'Post-transition Metal' }, { s: 'Sn', n: 50, name: 'Tin', mass: 118.71, g: 'Post-transition Metal' }, { s: 'Sb', n: 51, name: 'Antimony', mass: 121.76, g: 'Metalloid' }, { s: 'Te', n: 52, name: 'Tellurium', mass: 127.60, g: 'Metalloid' }, { s: 'I', n: 53, name: 'Iodine', mass: 126.90, g: 'Halogen' }, { s: 'Xe', n: 54, name: 'Xenon', mass: 131.29, g: 'Noble Gas' },
  { s: 'Cs', n: 55, name: 'Cesium', mass: 132.91, g: 'Alkali Metal' }, { s: 'Ba', n: 56, name: 'Barium', mass: 137.33, g: 'Alkaline Earth Metal' }, { s: '57-71', n: 0, name: '', mass: 0, g: 'Lanthanide' }, { s: 'Hf', n: 72, name: 'Hafnium', mass: 178.49, g: 'Transition Metal' }, { s: 'Ta', n: 73, name: 'Tantalum', mass: 180.95, g: 'Transition Metal' }, { s: 'W', n: 74, name: 'Tungsten', mass: 183.84, g: 'Transition Metal' }, { s: 'Re', n: 75, name: 'Rhenium', mass: 186.21, g: 'Transition Metal' }, { s: 'Os', n: 76, name: 'Osmium', mass: 190.23, g: 'Transition Metal' }, { s: 'Ir', n: 77, name: 'Iridium', mass: 192.22, g: 'Transition Metal' }, { s: 'Pt', n: 78, name: 'Platinum', mass: 195.08, g: 'Transition Metal' }, { s: 'Au', n: 79, name: 'Gold', mass: 196.97, g: 'Transition Metal' }, { s: 'Hg', n: 80, name: 'Mercury', mass: 200.59, g: 'Transition Metal' }, { s: 'Tl', n: 81, name: 'Thallium', mass: 204.38, g: 'Post-transition Metal' }, { s: 'Pb', n: 82, name: 'Lead', mass: 207.2, g: 'Post-transition Metal' }, { s: 'Bi', n: 83, name: 'Bismuth', mass: 208.98, g: 'Post-transition Metal' }, { s: 'Po', n: 84, name: 'Polonium', mass: '(209)', g: 'Post-transition Metal' }, { s: 'At', n: 85, name: 'Astatine', mass: '(210)', g: 'Halogen' }, { s: 'Rn', n: 86, name: 'Radon', mass: '(222)', g: 'Noble Gas' },
  { s: 'Fr', n: 87, name: 'Francium', mass: '(223)', g: 'Alkali Metal' }, { s: 'Ra', n: 88, name: 'Radium', mass: '(226)', g: 'Alkaline Earth Metal' }, { s: '89-103', n: 0, name: '', mass: 0, g: 'Actinide' }, { s: 'Rf', n: 104, name: 'Rutherfordium', mass: '(267)', g: 'Transition Metal' }, { s: 'Db', n: 105, name: 'Dubnium', mass: '(268)', g: 'Transition Metal' }, { s: 'Sg', n: 106, name: 'Seaborgium', mass: '(271)', g: 'Transition Metal' }, { s: 'Bh', n: 107, name: 'Bohrium', mass: '(272)', g: 'Transition Metal' }, { s: 'Hs', n: 108, name: 'Hassium', mass: '(277)', g: 'Transition Metal' }, { s: 'Mt', n: 109, name: 'Meitnerium', mass: '(278)', g: 'Transition Metal' }, { s: 'Ds', n: 110, name: 'Darmstadtium', mass: '(281)', g: 'Transition Metal' }, { s: 'Rg', n: 111, name: 'Roentgenium', mass: '(282)', g: 'Transition Metal' }, { s: 'Cn', n: 112, name: 'Copernicium', mass: '(285)', g: 'Transition Metal' }, { s: 'Nh', n: 113, name: 'Nihonium', mass: '(286)', g: 'Post-transition Metal' }, { s: 'Fl', n: 114, name: 'Flerovium', mass: '(289)', g: 'Post-transition Metal' }, { s: 'Mc', n: 115, name: 'Moscovium', mass: '(290)', g: 'Post-transition Metal' }, { s: 'Lv', n: 116, name: 'Livermorium', mass: '(293)', g: 'Post-transition Metal' }, { s: 'Ts', n: 117, name: 'Tennessine', mass: '(294)', g: 'Halogen' }, { s: 'Og', n: 118, name: 'Oganesson', mass: '(294)', g: 'Noble Gas' },
];

const lanthanideActinideSeries = [
    { s: 'La', n: 57, name: 'Lanthanum', mass: 138.91, g: 'Lanthanide' }, { s: 'Ce', n: 58, name: 'Cerium', mass: 140.12, g: 'Lanthanide' }, { s: 'Pr', n: 59, name: 'Praseodymium', mass: 140.91, g: 'Lanthanide' }, { s: 'Nd', n: 60, name: 'Neodymium', mass: 144.24, g: 'Lanthanide' }, { s: 'Pm', n: 61, name: 'Promethium', mass: '(145)', g: 'Lanthanide' }, { s: 'Sm', n: 62, name: 'Samarium', mass: 150.36, g: 'Lanthanide' }, { s: 'Eu', n: 63, name: 'Europium', mass: 151.96, g: 'Lanthanide' }, { s: 'Gd', n: 64, name: 'Gadolinium', mass: 157.25, g: 'Lanthanide' }, { s: 'Tb', n: 65, name: 'Terbium', mass: 158.93, g: 'Lanthanide' }, { s: 'Dy', n: 66, name: 'Dysprosium', mass: 162.50, g: 'Lanthanide' }, { s: 'Ho', n: 67, name: 'Holmium', mass: 164.93, g: 'Lanthanide' }, { s: 'Er', n: 68, name: 'Erbium', mass: 167.26, g: 'Lanthanide' }, { s: 'Tm', n: 69, name: 'Thulium', mass: 168.93, g: 'Lanthanide' }, { s: 'Yb', n: 70, name: 'Ytterbium', mass: 173.05, g: 'Lanthanide' }, { s: 'Lu', n: 71, name: 'Lutetium', mass: 174.97, g: 'Lanthanide' },
    { s: 'Ac', n: 89, name: 'Actinium', mass: '(227)', g: 'Actinide' }, { s: 'Th', n: 90, name: 'Thorium', mass: 232.04, g: 'Actinide' }, { s: 'Pa', n: 91, name: 'Protactinium', mass: 231.04, g: 'Actinide' }, { s: 'U', n: 92, name: 'Uranium', mass: 238.03, g: 'Actinide' }, { s: 'Np', n: 93, name: 'Neptunium', mass: '(237)', g: 'Actinide' }, { s: 'Pu', n: 94, name: 'Plutonium', mass: '(244)', g: 'Actinide' }, { s: 'Am', n: 95, name: 'Americium', mass: '(243)', g: 'Actinide' }, { s: 'Cm', n: 96, name: 'Curium', mass: '(247)', g: 'Actinide' }, { s: 'Bk', n: 97, name: 'Berkelium', mass: '(247)', g: 'Actinide' }, { s: 'Cf', n: 98, name: 'Californium', mass: '(251)', g: 'Actinide' }, { s: 'Es', n: 99, name: 'Einsteinium', mass: '(252)', g: 'Actinide' }, { s: 'Fm', n: 100, name: 'Fermium', mass: '(257)', g: 'Actinide' }, { s: 'Md', n: 101, name: 'Mendelevium', mass: '(258)', g: 'Actinide' }, { s: 'No', n: 102, name: 'Nobelium', mass: '(259)', g: 'Actinide' }, { s: 'Lr', n: 103, name: 'Lawrencium', mass: '(262)', g: 'Actinide' },
];

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

const ElementTile = ({ el, activeFilter }: { el: any, activeFilter: string }) => {
  if (!el) return <div className="hidden sm:block aspect-square"></div>; // Hide empty on mobile, show on larger
    
    const color = groupColors[el.g] || 'bg-gray-800/50 border-gray-700';
    const isFiltered = activeFilter !== 'All' && el.g !== activeFilter;
  const isPlaceholder = !el.name;

  // Calculate default neutrons. (A simple, common isotope)
  // We'll use this for the link.
  // For mass like '(209)', we'll parse the number. For '1.008', we'll round.
  let defaultNeutrons = 0;
  if (el.mass) {
    const massNum = parseFloat(String(el.mass).replace('(', '').replace(')', ''));
    defaultNeutrons = Math.round(massNum) - el.n;
    if (defaultNeutrons < 0) defaultNeutrons = 0; // Hydrogen case
  }
  
  const elementHref = {
    pathname: '/builder',
    query: {
      protons: el.n,
      neutrons: defaultNeutrons,
      electrons: el.n, // Default to a neutral atom
    },
  };

  const tileContent = (
    <div
      title={el.name ? `${el.n}: ${el.name} (${el.mass})` : el.g}
      className={`aspect-square border rounded-md flex flex-col items-center justify-center p-1 cursor-pointer
                       hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 hover:!opacity-100 transition-all duration-300 group
                       w-full h-full
                       ${isPlaceholder ? placeholderStyle : color} 
                       ${isFiltered ? 'opacity-20' : 'opacity-100'}`}
    >
      <span className="text-xs text-gray-400 group-hover:text-cyan-300">{el.n || ''}</span>
      <span className="text-sm sm:text-lg font-bold text-white">{el.s}</span>
    </div>
  );

  // If it's a real element, wrap it in a Link.
  // If it's a placeholder (like "57-71"), just render the div.
  return el.name ? (
    <Link href={elementHref} className="aspect-square">
      {tileContent}
    </Link>
  ) : (
    tileContent
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
                    {/* Main Periodic Table Grid */}
                    <div className="grid grid-cols-18 gap-1 mx-auto">
                        {periodicTableElements.map((el, index) => (
                            <ElementTile key={index} el={el} activeFilter={activeFilter} />
                        ))}
                    </div>

                    {/* Spacer */}
                    <div className="h-4"></div>

                    {/* Lanthanide and Actinide Series */}
                    <div className="grid grid-cols-18 gap-1 mx-auto">
                        <div className="col-span-3"></div> {/* Offset to align */}
                        {lanthanideActinideSeries.slice(0, 15).map((el, index) => (
                            <ElementTile key={index} el={el} activeFilter={activeFilter} />
                        ))}
                    </div>
                     <div className="grid grid-cols-18 gap-1 mx-auto mt-1">
                        <div className="col-span-3"></div> {/* Offset to align */}
                        {lanthanideActinideSeries.slice(15).map((el, index) => (
                            <ElementTile key={index} el={el} activeFilter={activeFilter} />
                        ))}
                    </div>
                </div>
                 <p className="text-center mt-8 text-gray-600">Full interactive table coming soon...</p>
            </div>
        </section>
    );
}

