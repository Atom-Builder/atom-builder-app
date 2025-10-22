// hooks/useGraphicsSettings.tsx
'use client'; // This is a client-side hook, it needs access to localStorage

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo,
  ReactNode
} from 'react';

// Define the shape of our settings
export type GraphicsSetting = 'low' | 'medium' | 'high';

// Define the shape of the context
interface GraphicsContextType {
  settings: GraphicsSetting;
  setSettings: (setting: GraphicsSetting) => void;
}

// Create the context with a default undefined value
const GraphicsContext = createContext<GraphicsContextType | undefined>(undefined);

// Define the props for our provider component
interface GraphicsProviderProps {
  children: ReactNode;
  defaultSetting?: GraphicsSetting;
}

const LOCAL_STORAGE_KEY = 'atom-builder-graphics';
const DEFAULT_SETTING: GraphicsSetting = 'low';

export const GraphicsProvider = ({ 
  children, 
  defaultSetting = DEFAULT_SETTING 
}: GraphicsProviderProps) => {

  // We initialize state to 'low'. 
  // We can't read localStorage here because it doesn't exist on the server.
  const [settings, setSettings] = useState<GraphicsSetting>(defaultSetting);

  // EFFECT 1: Read from localStorage on initial client-side mount
  useEffect(() => {
    // This code only runs on the client, after the component has mounted
    try {
      const storedSetting = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSetting && (storedSetting === 'low' || storedSetting === 'medium' || storedSetting === 'high')) {
        setSettings(storedSetting as GraphicsSetting);
      }
    } catch (error) {
      console.error("Could not read graphics settings from localStorage", error);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // EFFECT 2: Write to localStorage whenever 'settings' changes
  useEffect(() => {
    // This runs every time the 'settings' state changes (and on mount)
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, settings);
    } catch (error) {
      console.error("Could not save graphics settings to localStorage", error);
    }
  }, [settings]); // Re-run this effect when 'settings' changes

  // Use useMemo to prevent the context value from being recreated on every render
  const value = useMemo(() => ({
    settings,
    setSettings,
  }), [settings]);

  return (
    <GraphicsContext.Provider value={value}>
      {children}
    </GraphicsContext.Provider>
  );
};

// The custom hook that our components will use
export const useGraphicsSettings = (): GraphicsContextType => {
  const context = useContext(GraphicsContext);
  if (context === undefined) {
    throw new Error('useGraphicsSettings must be used within a GraphicsProvider');
  }
  return context;
};
