import { ElementData, PlaceholderElement } from "@/types";

// Define the types for the grid elements
export type GridElement = ElementData | PlaceholderElement | null;

// Define the structure of the exported periodic table object
interface PeriodicTableStructure {
    main: GridElement[];
    lanthanides: ElementData[];
    actinides: ElementData[];
}

// --- FIX: Add the 'export' keyword here ---
export const elementGroups = [
    'All', 'Alkali Metal', 'Alkaline Earth Metal', 'Lanthanide', 'Actinide', 
    'Transition Metal', 'Post-transition Metal', 'Metalloid', 'Nonmetal', 'Halogen', 'Noble Gas', 'Unknown' 
];
// --- END FIX ---

const elements: { [key: number]: ElementData } = {
    1: { protons: 1, symbol: "H", name: "Hydrogen", mass: "1.008", group: "Nonmetal", neutrons: 0 },
    2: { protons: 2, symbol: "He", name: "Helium", mass: "4.0026", group: "Noble Gas", neutrons: 2 },
    3: { protons: 3, symbol: "Li", name: "Lithium", mass: "6.94", group: "Alkali Metal", neutrons: 4 },
    4: { protons: 4, symbol: "Be", name: "Beryllium", mass: "9.0122", group: "Alkaline Earth Metal", neutrons: 5 },
    5: { protons: 5, symbol: "B", name: "Boron", mass: "10.81", group: "Metalloid", neutrons: 6 },
    6: { protons: 6, symbol: "C", name: "Carbon", mass: "12.011", group: "Nonmetal", neutrons: 6 },
    7: { protons: 7, symbol: "N", name: "Nitrogen", mass: "14.007", group: "Nonmetal", neutrons: 7 }, // Corrected key from 7G
    8: { protons: 8, symbol: "O", name: "Oxygen", mass: "15.999", group: "Nonmetal", neutrons: 8 },
    9: { protons: 9, symbol: "F", name: "Fluorine", mass: "18.998", group: "Halogen", neutrons: 10 },
    10: { protons: 10, symbol: "Ne", name: "Neon", mass: "20.180", group: "Noble Gas", neutrons: 10 },
    11: { protons: 11, symbol: "Na", name: "Sodium", mass: "22.990", group: "Alkali Metal", neutrons: 12 },
    12: { protons: 12, symbol: "Mg", name: "Magnesium", mass: "24.305", group: "Alkaline Earth Metal", neutrons: 12 },
    13: { protons: 13, symbol: "Al", name: "Aluminum", mass: "26.982", group: "Post-transition Metal", neutrons: 14 },
    14: { protons: 14, symbol: "Si", name: "Silicon", mass: "28.085", group: "Metalloid", neutrons: 14 },
    15: { protons: 15, symbol: "P", name: "Phosphorus", mass: "30.974", group: "Nonmetal", neutrons: 16 },
    16: { protons: 16, symbol: "S", name: "Sulfur", mass: "32.06", group: "Nonmetal", neutrons: 16 },
    17: { protons: 17, symbol: "Cl", name: "Chlorine", mass: "35.45", group: "Halogen", neutrons: 18 },
    18: { protons: 18, symbol: "Ar", name: "Argon", mass: "39.948", group: "Noble Gas", neutrons: 22 },
    19: { protons: 19, symbol: "K", name: "Potassium", mass: "39.098", group: "Alkali Metal", neutrons: 20 },
    20: { protons: 20, symbol: "Ca", name: "Calcium", mass: "40.078", group: "Alkaline Earth Metal", neutrons: 20 },
    21: { protons: 21, symbol: "Sc", name: "Scandium", mass: "44.956", group: "Transition Metal", neutrons: 24 },
    22: { protons: 22, symbol: "Ti", name: "Titanium", mass: "47.867", group: "Transition Metal", neutrons: 26 },
    23: { protons: 23, symbol: "V", name: "Vanadium", mass: "50.942", group: "Transition Metal", neutrons: 28 },
    24: { protons: 24, symbol: "Cr", name: "Chromium", mass: "51.996", group: "Transition Metal", neutrons: 28 },
    25: { protons: 25, symbol: "Mn", name: "Manganese", mass: "54.938", group: "Transition Metal", neutrons: 30 },
    26: { protons: 26, symbol: "Fe", name: "Iron", mass: "55.845", group: "Transition Metal", neutrons: 30 },
    27: { protons: 27, symbol: "Co", name: "Cobalt", mass: "58.933", group: "Transition Metal", neutrons: 32 },
    28: { protons: 28, symbol: "Ni", name: "Nickel", mass: "58.693", group: "Transition Metal", neutrons: 31 },
    29: { protons: 29, symbol: "Cu", name: "Copper", mass: "63.546", group: "Transition Metal", neutrons: 35 },
    30: { protons: 30, symbol: "Zn", name: "Zinc", mass: "65.38", group: "Transition Metal", neutrons: 35 },
    31: { protons: 31, symbol: "Ga", name: "Gallium", mass: "69.723", group: "Post-transition Metal", neutrons: 39 },
    32: { protons: 32, symbol: "Ge", name: "Germanium", mass: "72.630", group: "Metalloid", neutrons: 41 },
    33: { protons: 33, symbol: "As", name: "Arsenic", mass: "74.922", group: "Metalloid", neutrons: 42 },
    34: { protons: 34, symbol: "Se", name: "Selenium", mass: "78.971", group: "Nonmetal", neutrons: 45 },
    35: { protons: 35, symbol: "Br", name: "Bromine", mass: "79.904", group: "Halogen", neutrons: 45 },
    36: { protons: 36, symbol: "Kr", name: "Krypton", mass: "83.798", group: "Noble Gas", neutrons: 48 },
    37: { protons: 37, symbol: "Rb", name: "Rubidium", mass: "85.468", group: "Alkali Metal", neutrons: 48 },
    38: { protons: 38, symbol: "Sr", name: "Strontium", mass: "87.62", group: "Alkaline Earth Metal", neutrons: 50 },
    39: { protons: 39, symbol: "Y", name: "Yttrium", mass: "88.906", group: "Transition Metal", neutrons: 50 },
    40: { protons: 40, symbol: "Zr", name: "Zirconium", mass: "91.224", group: "Transition Metal", neutrons: 51 },
    41: { protons: 41, symbol: "Nb", name: "Niobium", mass: "92.906", group: "Transition Metal", neutrons: 52 },
    42: { protons: 42, symbol: "Mo", name: "Molybdenum", mass: "95.96", group: "Transition Metal", neutrons: 54 },
    43: { protons: 43, symbol: "Tc", name: "Technetium", mass: "(98)", group: "Transition Metal", neutrons: 55 },
    44: { protons: 44, symbol: "Ru", name: "Ruthenium", mass: "101.07", group: "Transition Metal", neutrons: 57 },
    45: { protons: 45, symbol: "Rh", name: "Rhodium", mass: "102.91", group: "Transition Metal", neutrons: 58 },
    46: { protons: 46, symbol: "Pd", name: "Palladium", mass: "106.42", group: "Transition Metal", neutrons: 60 },
    47: { protons: 47, symbol: "Ag", name: "Silver", mass: "107.87", group: "Transition Metal", neutrons: 61 },
    48: { protons: 48, symbol: "Cd", name: "Cadmium", mass: "112.41", group: "Transition Metal", neutrons: 64 },
    49: { protons: 49, symbol: "In", name: "Indium", mass: "114.82", group: "Post-transition Metal", neutrons: 66 },
    50: { protons: 50, symbol: "Sn", name: "Tin", mass: "118.71", group: "Post-transition Metal", neutrons: 69 },
    51: { protons: 51, symbol: "Sb", name: "Antimony", mass: "121.76", group: "Metalloid", neutrons: 71 },
    52: { protons: 52, symbol: "Te", name: "Tellurium", mass: "127.60", group: "Metalloid", neutrons: 75 },
    53: { protons: 53, symbol: "I", name: "Iodine", mass: "126.90", group: "Halogen", neutrons: 74 },
    54: { protons: 54, symbol: "Xe", name: "Xenon", mass: "131.29", group: "Noble Gas", neutrons: 77 },
    55: { protons: 55, symbol: "Cs", name: "Cesium", mass: "132.91", group: "Alkali Metal", neutrons: 78 },
    56: { protons: 56, symbol: "Ba", name: "Barium", mass: "137.33", group: "Alkaline Earth Metal", neutrons: 81 },
    57: { protons: 57, symbol: "La", name: "Lanthanum", mass: "138.91", group: "Lanthanide", neutrons: 82 },
    58: { protons: 58, symbol: "Ce", name: "Cerium", mass: "140.12", group: "Lanthanide", neutrons: 82 },
    59: { protons: 59, symbol: "Pr", name: "Praseodymium", mass: "140.91", group: "Lanthanide", neutrons: 82 },
    60: { protons: 60, symbol: "Nd", name: "Neodymium", mass: "144.24", group: "Lanthanide", neutrons: 84 },
    61: { protons: 61, symbol: "Pm", name: "Promethium", mass: "(145)", group: "Lanthanide", neutrons: 84 },
    62: { protons: 62, symbol: "Sm", name: "Samarium", mass: "150.36", group: "Lanthanide", neutrons: 88 },
    63: { protons: 63, symbol: "Eu", name: "Europium", mass: "151.96", group: "Lanthanide", neutrons: 89 },
    64: { protons: 64, symbol: "Gd", name: "Gadolinium", mass: "157.25", group: "Lanthanide", neutrons: 93 },
    65: { protons: 65, symbol: "Tb", name: "Terbium", mass: "158.93", group: "Lanthanide", neutrons: 94 },
    66: { protons: 66, symbol: "Dy", name: "Dysprosium", mass: "162.50", group: "Lanthanide", neutrons: 97 },
    67: { protons: 67, symbol: "Ho", name: "Holmium", mass: "164.93", group: "Lanthanide", neutrons: 98 },
    68: { protons: 68, symbol: "Er", name: "Erbium", mass: "167.26", group: "Lanthanide", neutrons: 99 },
    69: { protons: 69, symbol: "Tm", name: "Thulium", mass: "168.93", group: "Lanthanide", neutrons: 100 },
    70: { protons: 70, symbol: "Yb", name: "Ytterbium", mass: "173.05", group: "Lanthanide", neutrons: 103 },
    71: { protons: 71, symbol: "Lu", name: "Lutetium", mass: "174.97", group: "Lanthanide", neutrons: 104 },
    72: { protons: 72, symbol: "Hf", name: "Hafnium", mass: "178.49", group: "Transition Metal", neutrons: 106 },
    73: { protons: 73, symbol: "Ta", name: "Tantalum", mass: "180.95", group: "Transition Metal", neutrons: 108 },
    74: { protons: 74, symbol: "W", name: "Tungsten", mass: "183.84", group: "Transition Metal", neutrons: 110 },
    75: { protons: 75, symbol: "Re", name: "Rhenium", mass: "186.21", group: "Transition Metal", neutrons: 111 },
    76: { protons: 76, symbol: "Os", name: "Osmium", mass: "190.23", group: "Transition Metal", neutrons: 114 },
    77: { protons: 77, symbol: "Ir", name: "Iridium", mass: "192.22", group: "Transition Metal", neutrons: 115 },
    78: { protons: 78, symbol: "Pt", name: "Platinum", mass: "195.08", group: "Transition Metal", neutrons: 117 },
    79: { protons: 79, symbol: "Au", name: "Gold", mass: "196.97", group: "Transition Metal", neutrons: 118 },
    80: { protons: 80, symbol: "Hg", name: "Mercury", mass: "200.59", group: "Transition Metal", neutrons: 121 },
    81: { protons: 81, symbol: "Tl", name: "Thallium", mass: "204.38", group: "Post-transition Metal", neutrons: 123 },
    82: { protons: 82, symbol: "Pb", name: "Lead", mass: "207.2", group: "Post-transition Metal", neutrons: 125 },
    83: { protons: 83, symbol: "Bi", name: "Bismuth", mass: "208.98", group: "Post-transition Metal", neutrons: 126 },
    84: { protons: 84, symbol: "Po", name: "Polonium", mass: "(209)", group: "Post-transition Metal", neutrons: 125 },
    85: { protons: 85, symbol: "At", name: "Astatine", mass: "(210)", group: "Halogen", neutrons: 125 },
    86: { protons: 86, symbol: "Rn", name: "Radon", mass: "(222)", group: "Noble Gas", neutrons: 136 },
    87: { protons: 87, symbol: "Fr", name: "Francium", mass: "(223)", group: "Alkali Metal", neutrons: 136 },
    88: { protons: 88, symbol: "Ra", name: "Radium", mass: "(226)", group: "Alkaline Earth Metal", neutrons: 138 },
    89: { protons: 89, symbol: "Ac", name: "Actinium", mass: "(227)", group: "Actinide", neutrons: 138 },
    90: { protons: 90, symbol: "Th", name: "Thorium", mass: "232.04", group: "Actinide", neutrons: 142 },
    91: { protons: 91, symbol: "Pa", name: "Protactinium", mass: "231.04", group: "Actinide", neutrons: 140 },
    92: { protons: 92, symbol: "U", name: "Uranium", mass: "238.03", group: "Actinide", neutrons: 146 },
    93: { protons: 93, symbol: "Np", name: "Neptunium", mass: "(237)", group: "Actinide", neutrons: 144 },
    94: { protons: 94, symbol: "Pu", name: "Plutonium", mass: "(244)", group: "Actinide", neutrons: 150 },
    95: { protons: 95, symbol: "Am", name: "Americium", mass: "(243)", group: "Actinide", neutrons: 148 },
    96: { protons: 96, symbol: "Cm", name: "Curium", mass: "(247)", group: "Actinide", neutrons: 151 },
    97: { protons: 97, symbol: "Bk", name: "Berkelium", mass: "(247)", group: "Actinide", neutrons: 150 },
    98: { protons: 98, symbol: "Cf", name: "Californium", mass: "(251)", group: "Actinide", neutrons: 153 },
    99: { protons: 99, symbol: "Es", name: "Einsteinium", mass: "(252)", group: "Actinide", neutrons: 153 },
    100: { protons: 100, symbol: "Fm", name: "Fermium", mass: "(257)", group: "Actinide", neutrons: 157 },
    101: { protons: 101, symbol: "Md", name: "Mendelevium", mass: "(258)", group: "Actinide", neutrons: 157 },
    102: { protons: 102, symbol: "No", name: "Nobelium", mass: "(259)", group: "Actinide", neutrons: 157 },
    103: { protons: 103, symbol: "Lr", name: "Lawrencium", mass: "(262)", group: "Actinide", neutrons: 159 },
    104: { protons: 104, symbol: "Rf", name: "Rutherfordium", mass: "(267)", group: "Transition Metal", neutrons: 163 },
    105: { protons: 105, symbol: "Db", name: "Dubnium", mass: "(268)", group: "Transition Metal", neutrons: 163 },
    106: { protons: 106, symbol: "Sg", name: "Seaborgium", mass: "(271)", group: "Transition Metal", neutrons: 165 },
    107: { protons: 107, symbol: "Bh", name: "Bohrium", mass: "(272)", group: "Transition Metal", neutrons: 165 },
    108: { protons: 108, symbol: "Hs", name: "Hassium", mass: "(277)", group: "Transition Metal", neutrons: 169 },
    109: { protons: 109, symbol: "Mt", name: "Meitnerium", mass: "(278)", group: "Transition Metal", neutrons: 169 },
    110: { protons: 110, symbol: "Ds", name: "Darmstadtium", mass: "(281)", group: "Transition Metal", neutrons: 171 },
    111: { protons: 111, symbol: "Rg", name: "Roentgenium", mass: "(282)", group: "Transition Metal", neutrons: 171 },
    112: { protons: 112, symbol: "Cn", name: "Copernicium", mass: "(285)", group: "Transition Metal", neutrons: 173 },
    113: { protons: 113, symbol: "Nh", name: "Nihonium", mass: "(286)", group: "Post-transition Metal", neutrons: 173 },
    114: { protons: 114, symbol: "Fl", name: "Flerovium", mass: "(289)", group: "Post-transition Metal", neutrons: 175 },
    115: { protons: 115, symbol: "Mc", name: "Moscovium", mass: "(290)", group: "Post-transition Metal", neutrons: 175 },
    116: { protons: 116, symbol: "Lv", name: "Livermorium", mass: "(293)", group: "Post-transition Metal", neutrons: 177 },
    117: { protons: 117, symbol: "Ts", name: "Tennessine", mass: "(294)", group: "Halogen", neutrons: 177 },
    118: { protons: 118, symbol: "Og", name: "Oganesson", mass: "(294)", group: "Noble Gas", neutrons: 176 },
};

// Placeholder for Lanthanide/Actinide series in the main grid
const lanthanidePlaceholder: PlaceholderElement = { s: '57-71', g: 'Lanthanide' };
const actinidePlaceholder: PlaceholderElement = { s: '89-103', g: 'Actinide' };

// Build the main grid (18 columns wide)
const mainGrid: GridElement[] = [
    elements[1], null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, elements[2],
    elements[3], elements[4], null, null, null, null, null, null, null, null, null, null, elements[5], elements[6], elements[7], elements[8], elements[9], elements[10],
    elements[11], elements[12], null, null, null, null, null, null, null, null, null, null, elements[13], elements[14], elements[15], elements[16], elements[17], elements[18],
    elements[19], elements[20], elements[21], elements[22], elements[23], elements[24], elements[25], elements[26], elements[27], elements[28], elements[29], elements[30], elements[31], elements[32], elements[33], elements[34], elements[35], elements[36],
    elements[37], elements[38], elements[39], elements[40], elements[41], elements[42], elements[43], elements[44], elements[45], elements[46], elements[47], elements[48], elements[49], elements[50], elements[51], elements[52], elements[53], elements[54],
    elements[55], elements[56], lanthanidePlaceholder, elements[72], elements[73], elements[74], elements[75], elements[76], elements[77], elements[78], elements[79], elements[80], elements[81], elements[82], elements[83], elements[84], elements[85], elements[86],
    elements[87], elements[88], actinidePlaceholder, elements[104], elements[105], elements[106], elements[107], elements[108], elements[109], elements[110], elements[111], elements[112], elements[113], elements[114], elements[115], elements[116], elements[117], elements[118],
];

// Build the Lanthanide and Actinide series arrays
const lanthanideSeries: ElementData[] = Array.from({ length: 15 }, (_, i) => elements[57 + i]);
const actinideSeries: ElementData[] = Array.from({ length: 15 }, (_, i) => elements[89 + i]);

// Export the complete structure
export const periodicTable: PeriodicTableStructure = {
    main: mainGrid,
    lanthanides: lanthanideSeries,
    actinides: actinideSeries,
};

// Function to get element data by proton number
export const getElementByProton = (protons: number): ElementData | undefined => {
    return elements[protons];
};