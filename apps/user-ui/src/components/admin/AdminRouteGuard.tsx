'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Role } from '../../types/admin';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: Role;
  requiredPermissions?: string[];
}

/**
 * Client-side admin route guard component
 * Validates admin role and permissions before rendering protected content
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  fallback,
  requiredRole = Role.ADMIN,
  requiredPermissions = [],
}) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Get authentication state from Redux
  const { user, isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isInitialized && isClient) {
      setIsChecking(true);

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        router.replace('/login?admin=true');
        return;
      }

      // Check if user has required role
      const userRole = (user as any).role;
      if (!userRole || userRole !== requiredRole) {
        router.replace('/unauthorized');
        return;
      }

      // Check permissions if required
      if (requiredPermissions.length > 0) {
        const userPermissions = (user as any).permissions || [];
        const hasRequiredPermissions = requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        );

        if (!hasRequiredPermissions) {
          router.replace('/unauthorized');
          return;
        }
      }

      setHasAccess(true);
      setIsChecking(false);
    }
  }, [
    isInitialized,
    isAuthenticated,
    user,
    requiredRole,
    requiredPermissions,
    router,
    isClient,
  ]);

  // Show loading state while checking authentication
  if (!isClient || !isInitialized || isChecking) {
    return fallback || <AdminLoadingSkeleton />;
  }

  // Show content if user has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback while redirecting
  return fallback || <AdminLoadingSkeleton />;
};

/**
 * Default loading skeleton for admin routes
 */
const AdminLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying admin access...</p>
      </div>
    </div>
  );
};

/**
 * HOC for wrapping admin pages with route guard
 */
export const withAdminGuard = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: Role = Role.ADMIN,
  requiredPermissions: string[] = []
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <AdminRouteGuard
        requiredRole={requiredRole}
        requiredPermissions={requiredPermissions}
      >
        <Component {...props} />
      </AdminRouteGuard>
    );
  };

  WrappedComponent.displayName = `withAdminGuard(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

/**
 * Hook for checking admin permissions
 */
export const useAdminPermissions = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const hasRole = (role: Role): boolean => {
    if (!isAuthenticated || !user) return false;
    return (user as any).role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    const userPermissions = (user as any).permissions || [];
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    const userPermissions = (user as any).permissions || [];
    return permissions.some((permission) =>
      userPermissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    const userPermissions = (user as any).permissions || [];
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  };

  return {
    isAdmin: hasRole(Role.ADMIN),
    isModerator: hasRole(Role.MODERATOR),
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: (user as any)?.role,
    userPermissions: (user as any)?.permissions || [],
  };
};
