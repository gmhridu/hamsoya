'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';

interface AuthRouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // true for protected routes, false for auth pages
}

/**
 * Client-side route guard that prevents:
 * - Authenticated users from accessing auth pages (login, signup, etc.)
 * - Unauthenticated users from accessing protected routes
 *
 * Uses cached Redux state for instant redirects without loading states
 */
export const AuthRouteGuard: React.FC<AuthRouteGuardProps> = ({
  children,
  redirectTo = '/',
  requireAuth = false,
}) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Get authentication state from Redux
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // Get Redux Persist rehydration status
  const isRehydrated = useAppSelector(
    (state) => (state as any)._persist?.rehydrated ?? false
  );

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle redirects based on authentication state
  useEffect(() => {
    if (!isClient || hasRedirected || !isRehydrated) {
      return;
    }

    // For auth pages (login, signup): redirect authenticated users
    if (!requireAuth && isAuthenticated && isInitialized) {
      setHasRedirected(true);

      // Use ViewTransition API for smooth navigation
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace(redirectTo);
        });
      } else {
        router.replace(redirectTo);
      }
      return;
    }

    // For protected routes: redirect unauthenticated users
    if (requireAuth && !isAuthenticated && isInitialized) {
      setHasRedirected(true);

      // Use ViewTransition API for smooth navigation
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace(redirectTo);
        });
      } else {
        router.replace(redirectTo);
      }
      return;
    }
  }, [
    isClient,
    isRehydrated,
    isAuthenticated,
    isInitialized,
    requireAuth,
    redirectTo,
    hasRedirected,
    router,
  ]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // Don't render anything if we're redirecting
  if (hasRedirected) {
    return null;
  }

  // Don't render anything if we're waiting for rehydration
  if (!isRehydrated) {
    return null;
  }

  // For auth pages: don't render if user is authenticated
  if (!requireAuth && isAuthenticated && isInitialized) {
    return null;
  }

  // For protected routes: don't render if user is not authenticated
  if (requireAuth && !isAuthenticated && isInitialized) {
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

/**
 * Higher-order component for auth pages (login, signup, forgot-password)
 * Redirects authenticated users to home page
 */
export const withAuthPageGuard = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo = '/'
) => {
  const GuardedComponent = (props: P) => (
    <AuthRouteGuard requireAuth={false} redirectTo={redirectTo}>
      <Component {...props} />
    </AuthRouteGuard>
  );

  GuardedComponent.displayName = `withAuthPageGuard(${
    Component.displayName || Component.name
  })`;
  return GuardedComponent;
};

/**
 * Higher-order component for protected routes (dashboard, profile, etc.)
 * Redirects unauthenticated users to login page
 */
export const withProtectedRouteGuard = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo = '/login'
) => {
  const GuardedComponent = (props: P) => (
    <AuthRouteGuard requireAuth={true} redirectTo={redirectTo}>
      <Component {...props} />
    </AuthRouteGuard>
  );

  GuardedComponent.displayName = `withProtectedRouteGuard(${
    Component.displayName || Component.name
  })`;
  return GuardedComponent;
};
