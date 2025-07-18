'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuthStatus, useUser } from '../../hooks/useAuthUser';
import { useIsRestoring } from '../../providers/AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component that protects routes based on authentication status
 * 
 * @param children - The content to render if authentication check passes
 * @param requireAuth - Whether authentication is required (default: true)
 * @param redirectTo - Where to redirect if auth check fails (default: '/login')
 * @param fallback - Component to show while checking auth status
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback = <AuthLoadingSpinner />,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const { data: user, isLoading: userLoading } = useUser();
  const isRestoring = useIsRestoring();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for restoration and initial auth check to complete
    if (!isRestoring && !isLoading && !userLoading) {
      setHasChecked(true);

      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        router.push('/');
      }
    }
  }, [isRestoring, isLoading, userLoading, isAuthenticated, requireAuth, router, redirectTo]);

  // Show loading while checking auth status
  if (isRestoring || isLoading || userLoading || !hasChecked) {
    return <>{fallback}</>;
  }

  // Show content if auth check passes
  if (requireAuth && isAuthenticated) {
    return <>{children}</>;
  }

  if (!requireAuth && !isAuthenticated) {
    return <>{children}</>;
  }

  // Don't render anything while redirecting
  return <>{fallback}</>;
};

/**
 * Default loading spinner component
 */
const AuthLoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary/5 via-white to-brand-secondary/5">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Loading...</h3>
          <p className="text-gray-600 text-sm">Please wait while we verify your authentication</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Higher-order component for protecting pages
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAuth?: boolean;
    redirectTo?: string;
    fallback?: React.ReactNode;
  } = {}
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Component for protecting authenticated routes
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login" fallback={fallback}>
      {children}
    </AuthGuard>
  );
};

/**
 * Component for protecting guest-only routes (login, signup, etc.)
 */
export const GuestOnlyRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => {
  return (
    <AuthGuard requireAuth={false} redirectTo="/" fallback={fallback}>
      {children}
    </AuthGuard>
  );
};

/**
 * Hook for conditional rendering based on auth status
 */
export const useAuthGuard = (requireAuth: boolean = true) => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const isRestoring = useIsRestoring();

  const shouldRender = () => {
    if (isRestoring || isLoading) {
      return false;
    }

    return requireAuth ? isAuthenticated : !isAuthenticated;
  };

  return {
    shouldRender: shouldRender(),
    isLoading: isRestoring || isLoading,
    isAuthenticated,
  };
};
