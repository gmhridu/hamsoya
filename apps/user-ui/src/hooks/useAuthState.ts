'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { queryKeys } from '../lib/query-config';
import { User } from '../types/auth';

/**
 * Authentication state hook that provides current auth status
 * and utilities for route protection
 */
export const useAuthState = () => {
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get authentication status from localStorage and query cache
  const getAuthStatus = () => {
    if (!isClient) return { isAuthenticated: false, user: null };

    const accessToken = localStorage.getItem('accessToken');
    const user = queryClient.getQueryData<User>(queryKeys.auth.user);

    console.log('Auth status check:', {
      accessToken: !!accessToken,
      user: !!user,
    });

    return {
      isAuthenticated: !!accessToken && !!user,
      user,
      accessToken,
    };
  };

  // Query for auth status that updates when tokens change
  const { data: authStatus, isLoading } = useQuery({
    queryKey: ['auth', 'status'],
    queryFn: getAuthStatus,
    enabled: isClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5, // Check every 5 minutes
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.removeQueries({ queryKey: queryKeys.auth.user });
    queryClient.removeQueries({ queryKey: ['auth', 'status'] });
    router.push('/login');
  };

  // Check if tokens are expired (basic check)
  const isTokenExpired = () => {
    if (!isClient) return true;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return true;

    try {
      // Basic JWT expiration check (decode payload)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't decode, consider it expired
    }
  };

  return {
    isAuthenticated: authStatus?.isAuthenticated ?? false,
    user: authStatus?.user ?? null,
    accessToken: authStatus?.accessToken ?? null,
    isLoading: !isClient || isLoading,
    logout,
    isTokenExpired,
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] }),
  };
};

/**
 * Hook for protecting routes - redirects unauthenticated users
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuthState();
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
  const { isAuthenticated, isLoading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};
