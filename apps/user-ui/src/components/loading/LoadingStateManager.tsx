'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  AuthPageSkeleton,
  MinimalAuthPageSkeleton,
} from '../skeletons/AuthPageSkeleton';
import { HomePageSkeleton } from '../skeletons/HomePageSkeleton';

interface LoadingStateManagerProps {
  children: React.ReactNode;
  className?: string;
}

export const LoadingStateManager: React.FC<LoadingStateManagerProps> = ({
  children,
  className = '',
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<
    'auth' | 'home' | 'minimal'
  >('minimal');
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const isRehydrated = useAppSelector(
    (state) => (state as any)._persist?.rehydrated ?? false
  );

  // Track when component is mounted to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define route types
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(pathname);

  // Handle authentication state changes and route transitions
  useEffect(() => {
    // Only run after component is mounted to prevent hydration mismatches
    if (!isMounted) return;

    // Always show skeleton during initial load until everything is ready
    if (!isRehydrated || !isInitialized) {
      setIsTransitioning(true);

      if (isAuthRoute) {
        // On auth pages, show auth skeleton
        setTransitionType('auth');
      } else {
        // On other pages, show home skeleton
        setTransitionType('home');
      }
      return;
    }

    // Hide loading once everything is ready
    if (isRehydrated && isInitialized) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 100);

      return () => clearTimeout(timer);
    }

    // Explicitly return undefined if no cleanup is needed
    return undefined;
  }, [isMounted, isRehydrated, isInitialized, isAuthRoute, pathname]);

  // Handle authentication redirects
  useEffect(() => {
    if (!isMounted || !isRehydrated || !isInitialized) return;

    // Authenticated users on auth pages should be redirected
    if (isAuthenticated && isAuthRoute) {
      setIsTransitioning(true);
      setTransitionType('home');

      // Use ViewTransition API for smooth redirect
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace('/');
        });
      } else {
        router.replace('/');
      }

      // Hide loading after redirect
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  }, [
    isMounted,
    isAuthenticated,
    isAuthRoute,
    isRehydrated,
    isInitialized,
    router,
  ]);

  // Prevent hydration mismatch by always rendering children on server and initial client render
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  // Show skeleton during transitions or initial load (only after mount)
  if (isTransitioning || !isRehydrated || !isInitialized) {
    switch (transitionType) {
      case 'auth':
        const variant =
          pathname === '/signup'
            ? 'signup'
            : pathname === '/forgot-password'
            ? 'forgot-password'
            : 'login';
        return <AuthPageSkeleton variant={variant} className={className} />;

      case 'home':
        return <HomePageSkeleton className={className} />;

      case 'minimal':
      default:
        return <MinimalAuthPageSkeleton className={className} />;
    }
  }

  // Show normal content when ready
  return <div className={className}>{children}</div>;
};

/**
 * Hook for managing loading states during authentication flows
 */
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const isRehydrated = useAppSelector(
    (state) => (state as any)._persist?.rehydrated ?? false
  );

  const showLoading = (message: string = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const isSystemReady = isRehydrated && isInitialized;

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    isSystemReady,
    isAuthenticated,
  };
};

/**
 * Component for showing loading overlays during specific operations
 */
export const OperationLoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  className?: string;
}> = ({ isVisible, message = 'Processing...', className = '' }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        bg-gradient-to-br from-brand-primary/90 to-brand-secondary/90
        backdrop-blur-sm
        flex items-center justify-center
        transition-opacity duration-300
        ${className}
      `}
      style={{ viewTransitionName: 'operation-loading' }}
    >
      <div className="text-center space-y-4">
        {/* Loading spinner */}
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />

        {/* Loading message */}
        <div className="text-white text-lg font-medium font-sora">
          {message}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Higher-order component that wraps pages with loading state management
 */
export const withLoadingStateManager = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <LoadingStateManager>
        <Component {...props} />
      </LoadingStateManager>
    );
  };

  WrappedComponent.displayName = `withLoadingStateManager(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

export default LoadingStateManager;
