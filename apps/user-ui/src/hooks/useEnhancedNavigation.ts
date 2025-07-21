'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

/**
 * Enhanced navigation hook that provides smooth transitions for authentication flows
 * Uses React concurrent features for better perceived performance
 */
export const useEnhancedNavigation = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Navigate with React concurrent features for smooth transitions
   * Uses startTransition to mark navigation as non-urgent
   */
  const navigateWithTransition = useCallback(
    (path: string, replace = false) => {
      startTransition(() => {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      });
    },
    [router]
  );

  /**
   * Navigate with view transition API for smooth page transitions
   * Optimized for instant navigation to prevent white screen flashes
   */
  const navigateWithViewTransition = useCallback(
    (path: string, replace = false) => {
      // For auth redirects, use immediate navigation without transitions
      if (
        path === '/login' ||
        path === '/signup' ||
        path === '/forgot-password'
      ) {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
        return;
      }

      // For post-login navigation to home, use immediate navigation for better UX
      if (path === '/' || path === '/dashboard') {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
        return;
      }

      // For other navigation, use view transitions if supported
      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document
      ) {
        (document as any).startViewTransition(() => {
          if (replace) {
            router.replace(path);
          } else {
            router.push(path);
          }
        });
      } else {
        // Fallback to regular navigation
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      }
    },
    [router]
  );

  /**
   * Instant navigation for authentication redirects
   * Uses replace to avoid adding to history stack and provides immediate navigation
   */
  const redirectAuthenticated = useCallback(
    (path = '/') => {
      // For authenticated user redirects, use immediate navigation
      // to prevent any flash of auth forms - no transitions or delays
      router.replace(path);
    },
    [router]
  );

  /**
   * Instant logout navigation with immediate redirect
   * Optimized for immediate post-logout user experience
   */
  const navigateAfterLogout = useCallback(
    (path = '/login') => {
      // Use immediate navigation for instant logout redirect
      // No transitions or delays to ensure professional UX
      router.replace(path);
    },
    [router]
  );

  return {
    isPending,
    navigateWithTransition,
    navigateWithViewTransition,
    redirectAuthenticated,
    navigateAfterLogout,
  };
};

/**
 * Hook specifically for authentication page navigation
 * Provides optimized navigation patterns for auth flows
 */
export const useAuthNavigation = () => {
  const {
    isPending,
    redirectAuthenticated,
    navigateAfterLogout,
    navigateWithViewTransition,
  } = useEnhancedNavigation();

  /**
   * Handle redirect for authenticated users accessing auth pages
   * Uses instant navigation to prevent content flash
   */
  const handleAuthenticatedRedirect = useCallback(
    (redirectTo = '/') => {
      redirectAuthenticated(redirectTo);
    },
    [redirectAuthenticated]
  );

  /**
   * Handle navigation after successful login
   * Uses instant navigation with view transitions for smooth UX
   */
  const handleLoginSuccess = useCallback(
    (redirectTo = '/') => {
      // Use the existing navigateWithViewTransition function for post-login navigation
      navigateWithViewTransition(redirectTo, true);
    },
    [navigateWithViewTransition]
  );

  /**
   * Handle navigation after logout
   * Optimized for clean state transition
   */
  const handleLogoutNavigation = useCallback(
    (redirectTo = '/login') => {
      navigateAfterLogout(redirectTo);
    },
    [navigateAfterLogout]
  );

  return {
    isPending,
    handleAuthenticatedRedirect,
    handleLoginSuccess,
    handleLogoutNavigation,
  };
};

/**
 * Hook for optimizing authentication state transitions
 * Reduces loading states and improves perceived performance
 */
export const useOptimizedAuthTransitions = () => {
  const [isPending, startTransition] = useTransition();

  /**
   * Wrap authentication state changes in transitions
   * Makes state updates non-blocking for better UX
   */
  const transitionAuthState = useCallback((callback: () => void) => {
    startTransition(callback);
  }, []);

  /**
   * Optimized state update for authentication checks
   * Prevents blocking UI during auth verification
   */
  const updateAuthStateOptimized = useCallback((updateFn: () => void) => {
    // Use transition for non-urgent auth state updates
    startTransition(updateFn);
  }, []);

  return {
    isPending,
    transitionAuthState,
    updateAuthStateOptimized,
  };
};

export default useEnhancedNavigation;
