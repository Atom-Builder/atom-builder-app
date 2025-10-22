'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect 
} from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  User, 
  onAuthStateChanged, 
  signInWithCustomToken, 
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  addDoc, 
  collection, 
  setLogLevel
} from 'firebase/firestore';
import { AtomState } from './useBuilder';

// --- This is the new data shape for saving ---
interface CreationData {
  name: string;
  atom_config: Omit<AtomState, 'isPublic'>;
  is_antimatter: boolean;
  is_public: boolean;
  // We'll add user info to the public creations
  userId?: string; 
  username?: string;
}

interface AuthContextType {
  user: User | null;
  auth: Auth;
  db: Firestore;
  appId: string;
  userId: string;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveCreation: (data: CreationData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- GLOBAL VARIABLES FROM THE ENVIRONMENT ---
// These are provided by the canvas environment.
declare var __firebase_config: string;
declare var __initial_auth_token: string;
declare var __app_id: string;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [appId, setAppId] = useState<string>('default-app-id');
  const [userId, setUserId] = useState<string>(() => crypto.randomUUID());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- 1. INITIALIZE FIREBASE ---
    const firebaseConfig = JSON.parse(
      typeof __firebase_config !== 'undefined' 
        ? __firebase_config 
        : '{}'
    );
    
    const app = !getApps().length 
      ? initializeApp(firebaseConfig) 
      : getApp();
      
    const authInstance = getAuth(app);
    const dbInstance = getFirestore(app);
    setLogLevel('debug'); // Enable Firestore logging

    setAuth(authInstance);
    setDb(dbInstance);

    const currentAppId = typeof __app_id !== 'undefined' 
      ? __app_id 
      : 'default-app-id';
    setAppId(currentAppId);

    // --- 2. SET UP AUTH LISTENER ---
    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
        setLoading(false);
      } else {
        // No user. Check for initial token or sign in anonymously.
        try {
          await setPersistence(authInstance, browserLocalPersistence);
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(authInstance, __initial_auth_token);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (error) {
          console.error('Anonymous sign-in failed:', error);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // --- 3. AUTH FUNCTIONS ---
  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      // After sign-out, onAuthStateChanged will trigger an anonymous sign-in
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  // --- 4. REAL SAVE FUNCTION ---
  const saveCreation = async (data: CreationData) => {
    if (!db || !user || !appId) {
      console.error('Firestore not initialized or no user.');
      alert('Error: Could not save. Not signed in or DB not ready.');
      return;
    }

    setLoading(true);
    
    try {
      let collectionPath = '';
      let dataToSave: CreationData = { ...data };

      if (data.is_public) {
        // Public save: artifacts/{appId}/public/data/creations
        collectionPath = `artifacts/${appId}/public/data/creations`;
        dataToSave.userId = user.uid;
        dataToSave.username = user.displayName || user.email || 'Anonymous';
      } else {
        // Private save: artifacts/{appId}/users/{userId}/creations
        collectionPath = `artifacts/${appId}/users/${userId}/creations`;
      }
      
      const docRef = await addDoc(collection(db, collectionPath), dataToSave);
      
      console.log('Document written with ID:', docRef.id);
      alert(`Creation "${data.name}" saved successfully!`);

    } catch (error) {
      console.error('Error adding document:', error);
      alert('Error: Could not save creation.');
    } finally {
      setLoading(false);
    }
  };

  // --- 5. PROVIDE VALUE ---
  // We must block rendering until auth is ready and db is set
  if (loading || !auth || !db) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-orbitron text-lg">Initializing Quantum Link...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      auth, 
      db, 
      appId,
      userId,
      loading: false,
      signInWithGoogle, 
      signOut, 
      saveCreation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

