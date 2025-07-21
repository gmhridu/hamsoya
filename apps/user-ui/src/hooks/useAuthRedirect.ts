'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStatus } from './useAuthUser';

/**
 * Hook to handle authentication-based redirects
 * Prevents authenticated users from accessing auth pages
 */
export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Define auth pages that authenticated users shouldn't access
    const authPages = [
      '/auth/login',
      '/auth/signup',
      '/auth/forgot-password',
      '/login',
      '/signup',
      '/forgot-password',
    ];

    // Check if current page is an auth page
    const isAuthPage = authPages.some((page) => pathname.startsWith(page));

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
      // Redirect to dashboard or home page
      const redirectTo = '/dashboard';
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect:
      isAuthenticated &&
      [
        '/auth/login',
        '/auth/signup',
        '/auth/forgot-password',
        '/login',
        '/signup',
        '/forgot-password',
      ].some((page) => pathname.startsWith(page)),
  };
};

/**
 * Hook specifically for auth pages to redirect authenticated users
 */
export const useRedirectIfAuthenticated = (redirectTo = '/dashboard') => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && isAuthenticated,
  };
};

export default useAuthRedirect;
