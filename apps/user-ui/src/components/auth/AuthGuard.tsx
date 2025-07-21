'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component for protecting routes
 * Uses Redux state for authentication checks
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback,
}) => {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized) {
      if (requireAuth && (!isAuthenticated || !user)) {
        router.replace(redirectTo);
      } else if (!requireAuth && isAuthenticated && user) {
        router.replace('/');
      }
    }
  }, [isInitialized, isAuthenticated, user, requireAuth, redirectTo, router]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && (!isAuthenticated || !user)) {
    return null;
  }

  if (!requireAuth && isAuthenticated && user) {
    return null;
  }

  return <>{children}</>;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simple wrapper for protected routes
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login" fallback={fallback}>
      {children}
    </AuthGuard>
  );
};

interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simple wrapper for public routes (redirects authenticated users)
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  fallback,
}) => {
  return (
    <AuthGuard requireAuth={false} redirectTo="/" fallback={fallback}>
      {children}
    </AuthGuard>
  );
};

export default AuthGuard;
