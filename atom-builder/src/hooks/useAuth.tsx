'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useMemo,
  ReactNode
} from 'react';

// Define a simple user object
interface User {
  id: string;
  username: string;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null; // User is null if not signed in
  signIn: (username?: string) => void;
  signOut: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for our provider
interface AuthProviderProps {
  children: ReactNode;
}

// This is our MOCK provider. In a real app, 'signIn' would call an API.
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock sign-in function
  const signIn = (username: string = "test_user") => {
    // In a real app, you'd get this user object from your API response
    setUser({ id: "123", username: username });
  };

  // Mock sign-out function
  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    signIn,
    signOut,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// The custom hook that our components will use
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
