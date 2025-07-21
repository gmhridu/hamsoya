'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import { setInitialized } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Loading component for persistence gate
const PersistLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Loading seller dashboard...</p>
    </div>
  </div>
);

// Auth initializer component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );
  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  // Disable user data fetching to prevent async errors during development
  // const {
  //   data: sellerData,
  //   error,
  //   isLoading,
  // } = useGetCurrentSellerQuery(undefined, {
  //   skip: true,
  //   refetchOnMountOrArgChange: false,
  // });

  useEffect(() => {
    // Simple initialization without user fetch for now
    if (!isInitialized) {
      dispatch(setInitialized(true));
    }
  }, [isInitialized, dispatch]);

  // Temporarily disabled user data fetching
  // useEffect(() => {
  //   if (sellerData?.seller) {
  //     dispatch(setSeller(sellerData.seller));
  //     dispatch(setInitialized(true));
  //   } else if (error) {
  //     // If there's an error fetching user data, clear auth state
  //     dispatch(setSeller(null));
  //     dispatch(setInitialized(true));
  //   }
  // }, [sellerData, error, dispatch]);

  // Show loading state only during initial auth check
  if (!isInitialized && isAuthenticated && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

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
