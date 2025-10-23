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
    FieldValue // Keep FieldValue for serverTimestamp
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
// --- FIX: Revert back to let ---
let auth: Auth;
export let db: Firestore;
// --- END FIX ---


if (!getApps().length) {
    // Initialize Firebase only if it hasn't been initialized yet
     try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app); // Assign here after init
        db = getFirestore(app); // Assign here after init
     } catch (error) {
         console.error("Firebase initialization error:", error);
         // Handle initialization error appropriately - maybe show error to user
         // For now, ensure auth and db are assigned null or handled gracefully
         // @ts-ignore // Ignore potential unassigned error if init fails catastrophically
         auth = null;
         // @ts-ignore
         db = null;
     }

} else {
    // Get the default app if already initialized
    app = getApps()[0];
    auth = getAuth(app); // Assign here
    db = getFirestore(app); // Assign here
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
        // Ensure auth is initialized before setting up listener
        if (!auth) {
             console.error("Firebase Auth not initialized. Cannot set up listener.");
             setLoading(false); // Stop loading if auth failed
             return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                // Ensure db is initialized before Firestore operations
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
                setLoading(false); // Set loading false after user logic
            } else {
                 try {
                     await signInAnonymously(auth);
                     // Let the next onAuthStateChanged event handle setting the anonymous user
                 } catch (error) {
                     console.error("Anonymous sign-in failed: ", error);
                     setLoading(false); // Stop loading if anonymous sign-in fails
                 }
            }
        });

         return () => unsubscribe();
    }, []); // Empty dependency array means this runs only once on mount


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
            // onAuthStateChanged will handle setting user and setLoading(false)
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
             // onAuthStateChanged will handle anonymous sign-in and setLoading(false)
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
