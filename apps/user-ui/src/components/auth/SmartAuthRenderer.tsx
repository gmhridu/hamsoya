'use client';

import React from 'react';
import { useAppSelector } from '../../store';
import type { User } from '../../types/auth';
import {
  AuthAvatarSkeleton,
  AuthButtonsSkeleton,
  SmartAuthSkeleton,
} from './AuthSkeleton';

interface SmartAuthRendererProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  expectAuthenticated?: boolean;
  className?: string;
  skeletonClassName?: string;
}

/**
 * Smart authentication renderer that handles loading states and prevents flashing
 * Optimized to prioritize cached data and eliminate unnecessary skeleton loading
 */
export const SmartAuthRenderer: React.FC<SmartAuthRendererProps> = ({
  children,
  fallback,
  expectAuthenticated,
  className = '',
  skeletonClassName = '',
}) => {
  const { isInitialized } = useAppSelector((state) => state.auth);

  // Always show content immediately if initialized
  if (isInitialized) {
    return <div className={className}>{children}</div>;
  }

  // Show fallback or skeleton while initializing
  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }

  // Show appropriate skeleton based on expected auth state
  if (expectAuthenticated) {
    return (
      <AuthAvatarSkeleton
        className={`${className} ${skeletonClassName}`}
        size="md"
      />
    );
  }

  return (
    <AuthButtonsSkeleton className={`${className} ${skeletonClassName}`} />
  );
};

interface ConditionalAuthContentProps {
  authenticated: React.ReactNode;
  unauthenticated: React.ReactNode;
  loading?: React.ReactNode;
  className?: string;
}

/**
 * Component that conditionally renders content based on authentication state
 * with proper loading states to prevent flashing
 */
export const ConditionalAuthContent: React.FC<ConditionalAuthContentProps> = ({
  authenticated,
  unauthenticated,
  loading,
  className = '',
}) => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // Show loading state during initialization
  if (!isInitialized) {
    return <div className={className}>{loading || <SmartAuthSkeleton />}</div>;
  }

  // Show appropriate content when ready
  return (
    <div className={className}>
      {isAuthenticated ? authenticated : unauthenticated}
    </div>
  );
};

interface AuthStateWrapperProps {
  children: (authState: {
    isAuthenticated: boolean;
    isLoading: boolean;
    isReady: boolean;
    user: User | null;
  }) => React.ReactNode;
  className?: string;
}

/**
 * Render prop component that provides authentication state to children
 * with proper loading state management
 */
export const AuthStateWrapper: React.FC<AuthStateWrapperProps> = ({
  children,
  className = '',
}) => {
  const { isAuthenticated, user, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // During loading, provide loading state to children
  if (!isInitialized) {
    return (
      <div className={className}>
        {children({
          isAuthenticated: false,
          isLoading: true,
          isReady: false,
          user: null,
        })}
      </div>
    );
  }

  // When ready, provide actual auth state
  return (
    <div className={className}>
      {children({
        isAuthenticated,
        isLoading: false,
        isReady: true,
        user,
      })}
    </div>
  );
};

interface FadeTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
  duration?: number;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  isVisible,
  className = '',
  duration = 200,
}) => {
  return (
    <div
      className={`transition-opacity ease-in-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

interface SkeletonToContentTransitionProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

/**
 * Smooth transition from skeleton to actual content
 */
export const SkeletonToContentTransition: React.FC<
  SkeletonToContentTransitionProps
> = ({ isLoading, skeleton, content, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <FadeTransition isVisible={isLoading}>{skeleton}</FadeTransition>
      <FadeTransition isVisible={!isLoading}>
        <div className={isLoading ? 'absolute inset-0' : ''}>{content}</div>
      </FadeTransition>
    </div>
  );
};

export default SmartAuthRenderer;
