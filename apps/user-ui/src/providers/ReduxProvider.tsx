'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import { useGetCurrentUserQuery } from '../store/authApi';
import { setInitialized, setUser } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Optimized Auth initializer that prioritizes cached data for instant loading
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isInitialized, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Get Redux Persist rehydration status
  const isRehydrated = useAppSelector(
    (state) => (state as any)._persist?.rehydrated ?? false
  );

  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);
  const [shouldSkipAPI, setShouldSkipAPI] = useState(false);

  // OPTIMIZATION: Skip API call if we have valid cached data
  const skipAPICall = isInitialized || hasAttemptedInit || shouldSkipAPI;

  // Try to get current user only when necessary
  const { isLoading, isError, error, data } = useGetCurrentUserQuery(
    undefined,
    {
      skip: skipAPICall,
      // Aggressive caching for instant subsequent loads
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: true, // Only refetch on network reconnect
    }
  );

  // OPTIMIZATION: Initialize immediately when rehydrated with cached data
  useEffect(() => {
    if (isRehydrated && !isInitialized) {
      if (user && isAuthenticated) {
        // We have valid cached data, mark as initialized immediately
        dispatch(setInitialized());
        setShouldSkipAPI(true); // Skip API call since we have cached data
      } else if (!hasAttemptedInit) {
        // No cached data, allow API call but mark as initialized to prevent loading states
        setHasAttemptedInit(true);
        // Mark as initialized immediately to prevent loading states in AuthStateManager
        dispatch(setInitialized());
      }
    }
  }, [
    isRehydrated,
    isInitialized,
    user,
    isAuthenticated,
    hasAttemptedInit,
    dispatch,
  ]);

  // Handle successful user fetch from API
  useEffect(() => {
    if (data?.user && !isInitialized) {
      // Set user data and mark as initialized
      dispatch(setUser(data.user));
      dispatch(setInitialized());
    }
  }, [data, isInitialized, dispatch]);

  // Handle completion of initialization attempt
  useEffect(() => {
    if (hasAttemptedInit && !isLoading && !isInitialized) {
      // Mark as initialized regardless of success/failure
      dispatch(setInitialized());
    }
  }, [hasAttemptedInit, isLoading, isInitialized, dispatch]);

  // Handle authentication errors silently in production
  useEffect(() => {
    if (isError && process.env.NODE_ENV === 'development') {
      console.warn('Authentication initialization failed:', error);
    }
  }, [isError, error]);

  return <>{children}</>;
};

// Enhanced loading component for persistence with better UX
const PersistLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-secondary via-brand-secondary/90 to-brand-accent">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <div className="text-white text-lg font-medium">Initializing...</div>
    </div>
  </div>
);

// Error boundary for persistence failures (currently unused)
/*
const PersistErrorFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-secondary via-brand-secondary/90 to-brand-accent">
    <div className="flex flex-col items-center gap-4 text-white text-center">
      <div className="text-xl font-semibold">Storage Error</div>
      <div className="text-sm opacity-90">
        Unable to access browser storage. Please check your browser settings.
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-white text-brand-primary rounded-lg font-medium hover:bg-opacity-90 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);
*/

// Enhanced Redux provider with SSR safety and error handling
export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isClient, setIsClient] = React.useState(false);

  // Ensure we're on the client side before initializing persistence
  useEffect(() => {
    setIsClient(true);
  }, []);

  // SSR-safe rendering
  if (!isClient) {
    // During SSR, render without persistence
    return (
      <Provider store={store}>
        <AuthInitializer>{children}</AuthInitializer>
      </Provider>
    );
  }

  // Client-side rendering with persistence
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <AuthInitializer>{children}</AuthInitializer>
      </PersistGate>
    </Provider>
  );
};
