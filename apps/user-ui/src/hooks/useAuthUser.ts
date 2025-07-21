'use client';

import { useAppSelector } from '../store/hooks';
import { useGetCurrentUserQuery } from '../store/authApi';

/**
 * Hook to get current user data
 * Uses Redux state with RTK Query for data fetching
 */
export const useUser = () => {
  const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  
  // Use RTK Query to fetch user data if needed
  const { data, isLoading, error, refetch } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || !!user, // Skip if not authenticated or user already exists
  });

  return {
    data: user || data?.user,
    isLoading: !isInitialized || isLoading,
    error,
    refetch,
    isAuthenticated,
  };
};

/**
 * Hook to get authentication status
 */
export const useAuthStatus = () => {
  const { isAuthenticated, user, isInitialized } = useAppSelector((state) => state.auth);

  return {
    isAuthenticated,
    user,
    isInitialized,
    isLoading: !isInitialized,
  };
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  
  return {
    isAuthenticated,
    isLoading: !isInitialized,
  };
};

export default useUser;
