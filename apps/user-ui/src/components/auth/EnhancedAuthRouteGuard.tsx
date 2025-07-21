'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  AuthPageSkeleton,
  MinimalAuthPageSkeleton,
} from '../skeletons/AuthPageSkeleton';
import { HomePageSkeleton } from '../skeletons/HomePageSkeleton';

interface EnhancedAuthRouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  className?: string;
  variant?: 'login' | 'signup' | 'forgot-password';
  showSkeleton?: boolean;
  skeletonType?: 'auth' | 'home' | 'minimal';
}

/**
 * Enhanced client-side route guard with skeleton loading states
 * Prevents white screen flashes during authentication checks and redirects
 * Shows appropriate skeleton loaders based on the route type
 */
export const EnhancedAuthRouteGuard: React.FC<EnhancedAuthRouteGuardProps> = ({
  children,
  requireAuth = false,
  redirectTo = '/',
  className = '',
  variant = 'login',
  showSkeleton = true,
  skeletonType = 'auth',
}) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
      setIsRedirecting(true);

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
      setIsRedirecting(true);

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

  // Show skeleton during SSR to prevent white screens
  if (!isClient) {
    if (showSkeleton) {
      switch (skeletonType) {
        case 'home':
          return <HomePageSkeleton className={className} />;
        case 'minimal':
          return (
            <MinimalAuthPageSkeleton variant={variant} className={className} />
          );
        case 'auth':
        default:
          return <AuthPageSkeleton variant={variant} className={className} />;
      }
    }
    return null;
  }

  // Show skeleton during redirect process
  if (isRedirecting || hasRedirected) {
    if (!showSkeleton) {
      return null;
    }

    // Show appropriate skeleton based on redirect type
    if (!requireAuth && isAuthenticated) {
      // Authenticated user on auth page - show home skeleton
      return <HomePageSkeleton className={className} />;
    }

    if (requireAuth && !isAuthenticated) {
      // Unauthenticated user on protected route - show auth skeleton
      return <AuthPageSkeleton variant="login" className={className} />;
    }

    // Default minimal skeleton
    return <MinimalAuthPageSkeleton variant={variant} className={className} />;
  }

  // Show skeleton while waiting for rehydration or initialization
  if (!isRehydrated || !isInitialized) {
    if (showSkeleton) {
      switch (skeletonType) {
        case 'home':
          return <HomePageSkeleton className={className} />;
        case 'minimal':
          return (
            <MinimalAuthPageSkeleton variant={variant} className={className} />
          );
        case 'auth':
        default:
          return <AuthPageSkeleton variant={variant} className={className} />;
      }
    }
    return null;
  }

  // Show children when everything is ready and no redirect is needed
  return <div className={className}>{children}</div>;
};

/**
 * HOC for wrapping auth pages with enhanced route guard
 * Provides skeleton loading during authentication checks
 */
export const withEnhancedAuthPageGuard = <P extends object>(
  Component: React.ComponentType<P>,
  variant: 'login' | 'signup' | 'forgot-password' = 'login'
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <EnhancedAuthRouteGuard
        requireAuth={false}
        redirectTo="/"
        variant={variant}
        showSkeleton={true}
        skeletonType="auth"
      >
        <Component {...props} />
      </EnhancedAuthRouteGuard>
    );
  };

  WrappedComponent.displayName = `withEnhancedAuthPageGuard(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

/**
 * HOC for wrapping protected pages with enhanced route guard
 * Provides skeleton loading during authentication checks
 */
export const withEnhancedProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <EnhancedAuthRouteGuard
        requireAuth={true}
        redirectTo={redirectTo}
        showSkeleton={true}
        skeletonType="home"
      >
        <Component {...props} />
      </EnhancedAuthRouteGuard>
    );
  };

  WrappedComponent.displayName = `withEnhancedProtectedRoute(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

/**
 * Hook for managing authentication redirects with skeleton loading
 */
export const useEnhancedAuthRedirect = (
  requireAuth: boolean = false,
  redirectTo: string = '/'
) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const redirect = () => {
    setIsRedirecting(true);

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        router.replace(redirectTo);
      });
    } else {
      router.replace(redirectTo);
    }
  };

  const shouldRedirect = () => {
    if (!isInitialized) return false;

    if (!requireAuth && isAuthenticated) return true;
    if (requireAuth && !isAuthenticated) return true;

    return false;
  };

  return {
    isRedirecting,
    shouldRedirect: shouldRedirect(),
    redirect,
  };
};

export default EnhancedAuthRouteGuard;
