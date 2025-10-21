'use client'; 

import { useGraphicsSettings, GraphicsSetting } from '@/hooks/useGraphicsSettings';

export default function Home() {
  const { settings, setSettings } = useGraphicsSettings();

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white font-sans"
    >
      <div className="text-center p-8 rounded-lg bg-gray-800 shadow-2xl border border-gray-700">
        <h1 className="text-5xl font-bold mb-4 text-cyan-400">Atom Builder</h1>
        <p className="text-xl mb-8 text-gray-300">
          Current Graphics Setting:
          <strong className="ml-3 px-3 py-1 rounded-md bg-cyan-500 text-white font-mono tracking-wider">
            {settings}
          </strong>
        </p>

        <div className="flex justify-center space-x-4">
          {(['low', 'medium', 'high'] as GraphicsSetting[]).map((s) => (
            <button
              key={s}
              onClick={() => setSettings(s)}
              className={`
                px-6 py-2 rounded-md font-semibold text-white transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
                ${settings === s 
                  ? 'bg-cyan-500 shadow-lg scale-105' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              `}
            >
              Set {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <p className="mt-8 text-sm text-gray-500">
          Developed with the help of Gemini.
        </p>
      </div>
    </main>
  );
}

