// ... (imports and Electron, Nucleus, OrbitLine components remain unchanged) ...

// --- REFACTORED AtomScene ---
// Accepts props, does NOT use useBuilder()
interface AtomSceneProps {
    protons: number;
    neutrons: number;
    electrons: number;
    isAntimatter: boolean;
    vizMode: 'bohr' | 'cloud';
}

function AtomScene({ protons, neutrons, electrons, isAntimatter, vizMode }: AtomSceneProps) {
    // --- DELETE THIS LINE ---
    // const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();
    // --- END DELETE ---

    // ... (rest of AtomScene logic remains unchanged, using the props passed in) ...
    const colors = useMemo(() => ({
        proton: isAntimatter ? new Color('#00FFFF') : new Color('#FF00FF'),
        neutron: new Color('#666666'),
        electron: isAntimatter ? new Color('#FF00FF') : new Color('#00FFFF'),
    }), [isAntimatter]);

    const shells = useMemo(() => {
        let remainingElectrons = electrons;
        return bohrShells.map(capacity => {
            const count = Math.min(remainingElectrons, capacity);
            remainingElectrons -= count;
            return count;
        }).filter(count => count > 0);
    }, [electrons]);

    const atomKey = `${protons}-${neutrons}-${electrons}-${isAntimatter}-${vizMode}`;

    return (
        <Suspense fallback={null}>
            {/* ... Lights ... */}
            <hemisphereLight intensity={0.3} groundColor="black" />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} distance={30} decay={1}/>
            <pointLight position={[-10, -10, -5]} intensity={0.8} color={colors.proton} distance={30} decay={1}/>
            <directionalLight position={[0, -5, 5]} intensity={0.3} color={colors.electron} />

            {/* Background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <group key={atomKey}>
                <Nucleus
                    protons={protons}
                    neutrons={neutrons}
                    protonColor={colors.proton}
                    neutronColor={colors.neutron}
                />

                {vizMode === 'bohr' && shells.map((count, index) => {
                    const radius = (index + 1) * 0.9;
                    return (
                        <group key={`shell-${index}`}>
                            <OrbitLine radius={radius} electronColor={colors.electron} />
                            {Array.from({ length: count }).map((_, i) => (
                                <Electron
                                    key={`electron-${index}-${i}`}
                                    shellIndex={index}
                                    radius={radius}
                                    speedFactor={1.5}
                                    offset={(i / count) * Math.PI * 2}
                                    color={colors.electron}
                                    vizMode="bohr"
                                />
                            ))}
                        </group>
                    );
                })}

                {vizMode === 'cloud' && Array.from({ length: electrons }).map((_, i) => {
                    let estimatedShell = 0;
                    let countInShells = 0;
                    for(let s=0; s < bohrShells.length; s++) {
                        countInShells += bohrShells[s];
                        if(i < countInShells) { estimatedShell = s; break; }
                    }
                    const baseRadius = (estimatedShell + 1) * 0.7 + (Math.random() - 0.5) * 0.4;
                    const speedFactor = 1.0;
                    return (
                        <Electron
                            key={`cloud-electron-${i}`}
                            shellIndex={estimatedShell}
                            radius={baseRadius}
                            speedFactor={speedFactor}
                            offset={Math.random() * Math.PI * 2}
                            color={colors.electron}
                            vizMode="cloud"
                        />
                    );
                })}
            </group>
        </Suspense>
    );
}
// --- END REFACTOR ---


// --- Main Viewport Wrapper Component ---
export default function AtomViewport() {
    // --- ADD THESE LINES ---
    // Get builder state here in the parent
    const { protons, neutrons, electrons, isAntimatter, vizMode } = useBuilder();
    const { settings: graphicsSetting } = useGraphicsSettings();
    // --- END ADD ---

    return (
        <Canvas camera={{ position: [0, 5, 12], fov: 50 }} className="w-full h-full bg-black">
             {/* Use Suspense at a higher level if needed */}
             {/* --- MODIFY THIS SECTION --- */}
            <AtomScene
                protons={protons}
                neutrons={neutrons}
                electrons={electrons}
                isAntimatter={isAntimatter}
                vizMode={vizMode}
            />
             {/* --- END MODIFY --- */}
            <OrbitControls />
            {graphicsSetting === 'high' && (
                <EffectComposer>
                    <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={0.8}/>
                </EffectComposer>
            )}
        </Canvas>
    );
}

