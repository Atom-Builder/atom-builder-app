'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut,
    signInAnonymously
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    Firestore,
    serverTimestamp,
    // Timestamp // <-- FIX: Removed unused import
    FieldValue // Keep FieldValue if used elsewhere, otherwise remove if only serverTimestamp is needed.
} from 'firebase/firestore';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import toast from 'react-hot-toast';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
// --- FIX: Use const for auth and db ---
const auth: Auth;
export const db: Firestore;
// --- END FIX ---

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Assign after potential initialization
auth = getAuth(app);
db = getFirestore(app);


interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    try {
                        await setDoc(userRef, {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            lastLogin: serverTimestamp(),
                            isAnonymous: user.isAnonymous
                        });
                    } catch (error) {
                        console.error("Error creating user document:", error);
                    }
                }
            } else {
                 try {
                     // Attempt anonymous sign-in only if no user is detected
                     await signInAnonymously(auth);
                 } catch (error) {
                     console.error("Anonymous sign-in failed: ", error);
                     // Handle anonymous sign-in failure (e.g., show error to user)
                 } finally {
                    setLoading(false); // Ensure loading is set to false even if anonymous fails
                 }
            }
             // Set loading false after user state is determined or anonymous sign-in attempted
             if (user) setLoading(false);
        });

         // Cleanup subscription on unmount
         return () => unsubscribe();
    }, []); // Empty dependency array means this runs only once on mount


    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success('Signed in successfully!');
        } catch (error: unknown) { // <-- FIX: Use unknown instead of any
            console.error("Google sign-in failed: ", error);
             if (error instanceof Error) { // Type guard
                 toast.error(`Sign-in failed: ${error.message}`);
             } else {
                 toast.error('An unknown error occurred during sign-in.');
             }
            setLoading(false); // Ensure loading is set false on error
        }
         // setLoading(false) will be handled by onAuthStateChanged after successful sign-in
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await firebaseSignOut(auth);
            toast.success('Signed out.');
             // onAuthStateChanged will handle signing user in anonymously
        } catch (error: unknown) { // <-- FIX: Use unknown instead of any
            console.error("Sign-out failed: ", error);
             if (error instanceof Error) { // Type guard
                 toast.error(`Sign-out failed: ${error.message}`);
             } else {
                 toast.error('An unknown error occurred during sign-out.');
             }
            setLoading(false); // Ensure loading is set false on error
        }
         // setLoading(false) will be handled by onAuthStateChanged after sign-out triggers anonymous sign-in
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

