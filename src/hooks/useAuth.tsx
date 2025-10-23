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
    // FieldValue // <-- FIX: Removed unused import
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
let auth: Auth;
export let db: Firestore;

if (!getApps().length) {
     try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
     } catch (error) {
         console.error("Firebase initialization error:", error);
         // --- FIX: Use @ts-expect-error ---
         // @ts-expect-error // Ignore potential unassigned error if init fails catastrophically
         auth = null;
         // @ts-expect-error
         db = null;
         // --- END FIX ---
     }
} else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
}

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
        if (!auth) {
             console.error("Firebase Auth not initialized. Cannot set up listener.");
             setLoading(false);
             return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                if (db) {
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
                    console.error("Firestore DB not initialized. Cannot check/create user doc.")
                }
                setLoading(false);
            } else {
                 try {
                     await signInAnonymously(auth);
                 } catch (error) {
                     console.error("Anonymous sign-in failed: ", error);
                     setLoading(false);
                 }
            }
        });

         return () => unsubscribe();
    }, []);


    const signInWithGoogle = async () => {
         if (!auth) {
             toast.error("Authentication service not ready.");
             return;
         }
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success('Signed in successfully!');
        } catch (error: unknown) {
            console.error("Google sign-in failed: ", error);
             if (error instanceof Error) {
                 toast.error(`Sign-in failed: ${error.message}`);
             } else {
                 toast.error('An unknown error occurred during sign-in.');
             }
            setLoading(false);
        }
    };

    const signOut = async () => {
         if (!auth) {
             toast.error("Authentication service not ready.");
             return;
         }
        setLoading(true);
        try {
            await firebaseSignOut(auth);
            toast.success('Signed out.');
        } catch (error: unknown) {
            console.error("Sign-out failed: ", error);
             if (error instanceof Error) {
                 toast.error(`Sign-out failed: ${error.message}`);
             } else {
                 toast.error('An unknown error occurred during sign-out.');
             }
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

