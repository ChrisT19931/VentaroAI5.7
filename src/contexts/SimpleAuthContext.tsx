'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { simpleAuth } from '@/lib/auth-simple';

interface SimpleAuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  stableAuthState: boolean;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

// Helper function to debug auth state
export function debugAuthStateGlobal() {
  const currentUser = simpleAuth.getUser();
  const isAuthenticated = simpleAuth.getIsAuthenticated();
  const isLoading = simpleAuth.getIsLoading();
  console.log('Auth Debug (Global):', {
    user: currentUser ? `Email: ${currentUser.email}` : 'No user',
    isAuthenticated,
    isLoading,
    timestamp: new Date().toISOString()
  });
}

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stableAuthState, setStableAuthState] = useState(false);

  useEffect(() => {
    console.log('SimpleAuthContext: Initializing');
    let isMounted = true;
    
    // Initialize auth state
    try {
      const currentUser = simpleAuth.getUser();
      console.log('SimpleAuthContext: Initial user retrieved:', currentUser ? `Email: ${currentUser.email}` : 'No user');
      
      if (isMounted) {
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      }
    } catch (error) {
      console.error('SimpleAuthContext: Error getting initial user:', error);
    }
    
    // Add a longer minimum loading time to prevent flashing
    const loadingTimer = setTimeout(() => {
      if (isMounted) {
        console.log('SimpleAuthContext: Initial loading complete');
        setIsLoading(false);
      }
    }, 1200); // 1200ms minimum loading time
    
    // Add a longer delay before considering the auth state stable
    // This ensures we don't prematurely render content before auth is fully established
    const stableTimer = setTimeout(() => {
      if (isMounted) {
        console.log('SimpleAuthContext: Auth state considered stable');
        setStableAuthState(true);
      }
    }, 2000); // 2 seconds before considering auth state stable

    // Listen for auth changes
    const unsubscribe = simpleAuth.onAuthChange((newUser) => {
      console.log('SimpleAuthContext: Auth change detected:', newUser ? `Email: ${newUser.email}` : 'No user');
      if (isMounted) {
        setUser(newUser);
        setIsAuthenticated(!!newUser);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(loadingTimer);
      clearTimeout(stableTimer);
      console.log('SimpleAuthContext: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await simpleAuth.signOut();
  };

  const value = {
    user,
    isLoading,
    signOut,
    isAuthenticated,
    stableAuthState,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}

// Add a debug helper to check auth state - this is a custom hook now
export function useDebugAuthState() {
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  return () => {
    console.log('Auth Debug:', { 
      user, 
      isAuthenticated, 
      isLoading,
      timestamp: new Date().toISOString() 
    });
  };
}