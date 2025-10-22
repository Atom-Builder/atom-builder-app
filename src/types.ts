import { Timestamp } from 'firebase/firestore';

// Defines the shape of our data in Firestore
export interface AtomCreation {
  id: string; // Document ID from Firestore
  userId: string;
  userName: string;
  protons: number;
  neutrons: number;
  electrons: number;
  atomName: string;
  isPublic: boolean;
  isAntimatter: boolean;
  stability: 'Stable' | 'Unstable' | 'Predicted' | 'Unknown'; // Be more specific
  predicted: boolean;
  publishedAt: Timestamp; // Use Firestore Timestamp
}

// Defines the shape of the elements in our periodic table data
export interface ElementData {
  name: string;
  symbol: string;
  protons: number;
  neutrons: number; // Most stable isotope
  mass: number | string; // Mass can be a string like '(223)'
  group: string;
}

// Type for the placeholders in the periodic table grid
export type PlaceholderElement = { s: string, g: string, n?: number };

// Combined type for elements in the periodic table grid array
export type GridElement = ElementData | PlaceholderElement | null;

