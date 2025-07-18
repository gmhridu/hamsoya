'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authAPI } from '../lib/auth-api';
import { queryKeys } from '../lib/query-config';
import { User } from '../types/auth';

/**
 * Hook to get the current authenticated user
 */
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await authAPI.getCurrentUser();
        return response.user || null;
      } catch (error) {
        return null;
      }
    },
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (
        error?.message?.includes('Authentication') ||
        error?.message?.includes('401')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook to check authentication status
 */
export const useAuthStatus = () => {
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getAuthStatus = () => {
    if (!isClient) return { isAuthenticated: false, user: null };

    // Check if user data exists in TanStack Query cache
    const user = queryClient.getQueryData<User>(queryKeys.auth.user);

    return {
      isAuthenticated: !!user,
      user,
    };
  };

  const { data: authStatus, isLoading } = useQuery({
    queryKey: ['auth', 'status'],
    queryFn: getAuthStatus,
    enabled: isClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5, // Check every 5 minutes
  });

  const logout = () => {
    // Clear TanStack Query cache
    queryClient.removeQueries({ queryKey: queryKeys.auth.user });
    queryClient.removeQueries({ queryKey: ['auth', 'status'] });

    // HTTP-only cookies will be cleared by the logout API call
  };

  return {
    isAuthenticated: authStatus?.isAuthenticated ?? false,
    user: authStatus?.user ?? null,
    isLoading: !isClient || isLoading,
    logout,
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] }),
  };
};

/**
 * Hook for protecting routes - redirects unauthenticated users
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook for redirecting authenticated users away from auth pages
 */
export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook to refresh authentication token
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return async () => {
    try {
      const response = await authAPI.refreshToken();

      // Tokens are managed via HTTP-only cookies
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });

      return response;
    } catch (error) {
      // If refresh fails, logout user
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
      queryClient.removeQueries({ queryKey: ['auth', 'status'] });

      throw error;
    }
  };
};
