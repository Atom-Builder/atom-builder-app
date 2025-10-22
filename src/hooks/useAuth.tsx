'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode
} from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import toast from 'react-hot-toast';

// --- THIS IS THE FIX ---
// Securely read from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBV45_mDIRbunFBIjOhofqBIQ4aj9KpK8E",
  authDomain: "atom-builder-2a2a0.firebaseapp.com",
  projectId: "atom-builder-2a2a0",
  storageBucket: "atom-builder-2a2a0.firebasestorage.app",
  messagingSenderId: "322925747401",
  appId: "1:322925747401:web:56d71ff8ef0c1d1b02c118"
};
// --- END FIX ---

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// ... (rest of the file is identical) ...

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create or update user in Firestore
const updateUserInFirestore = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // New user
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
  } else {
    // Returning user
    await setDoc(userRef, {
      lastLogin: Timestamp.now()
    }, { merge: true });
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        await updateUserInFirestore(user);
      } else {
        // User is signed out, sign them in anonymously
        await signInAnonymously(auth);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      await updateUserInFirestore(result.user);
      toast.success(`Welcome back, ${result.user.displayName}!`);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // Auth state change will handle signing in anonymously
      toast.success('You have been signed out.');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error('Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
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

