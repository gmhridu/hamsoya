'use client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createQueryClient } from '../lib/query-config';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken?: string }
  ) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create persister for TanStack Query
const createPersister = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return createAsyncStoragePersister({
    storage: window.localStorage,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    buster: 'auth-v1', // Change this to invalidate cache
  });
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => createQueryClient());
  const [persister] = useState(() => createPersister());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from TanStack Query cache
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user data exists in TanStack Query cache
        const cachedUser = queryClient.getQueryData(['auth', 'user']);
        if (cachedUser) {
          setUser(cachedUser as User);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [queryClient]);

  const login = (
    user: User,
    tokens: { accessToken: string; refreshToken?: string }
  ) => {
    setUser(user);

    // Tokens are managed via HTTP-only cookies by the backend
    // Update TanStack Query cache for persistence
    queryClient.setQueryData(['auth', 'user'], user);
    queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
  };

  const logout = () => {
    setUser(null);

    // Clear TanStack Query cache
    queryClient.removeQueries({ queryKey: ['auth'] });
    queryClient.clear();

    // HTTP-only cookies are cleared by the logout API call
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Update TanStack Query cache for persistence
    queryClient.setQueryData(['auth', 'user'], updatedUser);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  // Use PersistQueryClientProvider if persister is available, otherwise use regular QueryClientProvider
  if (persister) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
          buster: 'auth-v1',
        }}
      >
        <AuthContext.Provider value={contextValue}>
          {children}
        </AuthContext.Provider>
      </PersistQueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Hook to check if query client is being restored from persistence
export const useIsRestoring = () => {
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    // Small delay to allow persistence to restore
    const timer = setTimeout(() => {
      setIsRestoring(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return isRestoring;
};
