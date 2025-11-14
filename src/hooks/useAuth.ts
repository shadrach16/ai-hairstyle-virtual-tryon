// src/hooks/useAuth.ts (Updated for Redirect Flow)

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import React from 'react';
import { toast } from 'sonner';
import { apiService, User } from '@/lib/api';
import { Purchases } from '@revenuecat/purchases-capacitor';

// This global interface might not be needed anymore but is harmless to keep.
declare global {
  interface Window {
    google: any;
  }
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (googleData: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This function is now called by AuthCallback.tsx, which is correct.
  const signIn = useCallback(async (googleData: any): Promise<boolean> => {
    try {
      const result = await apiService.signInWithGoogle(googleData);

      
      if (result.data) {
        setUser(result.data.user); 
        toast.success(result.message || 'Signed in successfully!');
        return true;
      } else {
        toast.error(result.message || 'Sign-in failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred during sign-in.');
      return false;
    }
  }, []);

 

  useEffect(() => {
    // This part is still correct: check for an existing session on initial app load.
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('auth_token');
    
    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.clear();
      }
    }
    
    setIsLoading(false);
  }, []);

  const signOut = async (): Promise<void> => {
    try {

      await apiService.signOut(); 
      // No need to call window.google for redirect flow sign out
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      toast.success('You have been signed out.');
    }
  };

  const refreshUser = async (): Promise<void> => {
    // This function remains crucial for session validation.
    try {
      const result = await apiService.getCurrentUser();
      if (  result.data) {
        setUser(result.data.user); 
      } else {
        // If token is invalid/expired, sign them out locally.
        setUser(null);
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    refreshUser
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}