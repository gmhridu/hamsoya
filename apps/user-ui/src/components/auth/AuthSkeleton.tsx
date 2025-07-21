'use client';

import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface AuthSkeletonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Professional skeleton loader for authentication state
 * Mimics the user avatar button shape for better perceived performance
 * Enhanced to match UserAvatar design exactly for seamless transitions
 */
export const AuthSkeleton: React.FC<AuthSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Enhanced User Avatar Skeleton - Matches UserAvatar exactly */}
      <div className="relative">
        <div
          className="
            h-10 w-10
            border-2
            border-white
            shadow-sm
            hover:shadow-md
            transition-all
            duration-200
            cursor-pointer
            ring-2
            ring-transparent
            hover:ring-brand-primary/20
            rounded-full
            bg-gradient-to-br
            from-gray-200
            to-gray-300
            animate-pulse
            flex
            items-center
            justify-center
          "
        >
          {/* Inner gradient that mimics brand fallback */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 animate-pulse" />
        </div>
      </div>

      {/* Optional: Auth buttons skeleton for larger screens */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Sign In Button Skeleton - Enhanced styling */}
        <div
          className="
          w-16 h-8
          rounded-full
          bg-gradient-to-r from-gray-200 to-gray-300
          border border-gray-300
          animate-pulse
          shadow-sm
        "
        />

        {/* Sign Up Button Skeleton - Enhanced styling */}
        <div
          className="
          w-18 h-8
          rounded-full
          bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20
          animate-pulse
          shadow-sm
        "
        />
      </div>
    </div>
  );
};

/**
 * Enhanced avatar skeleton that perfectly matches UserAvatar component
 * Uses the same shadcn/ui Avatar component and styling for seamless transitions
 * Supports all UserAvatar sizes (sm, md, lg) and visual consistency
 */
export const AuthAvatarSkeleton: React.FC<AuthSkeletonProps> = ({
  className = '',
  size = 'md',
}) => {
  // Size configurations that match UserAvatar exactly
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  // Loading spinner size configurations that match UserAvatar
  const spinnerSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Avatar skeleton that matches UserAvatar exactly */}
      <div
        className={`
          ${sizeClasses[size]}
          border-2
          border-white
          shadow-sm
          hover:shadow-md
          transition-all
          duration-200
          cursor-pointer
          ring-2
          ring-transparent
          hover:ring-brand-primary/20
          rounded-full
          bg-gradient-to-br
          from-brand-primary
          to-brand-secondary
          flex
          items-center
          justify-center
          text-white
          font-semibold
        `}
      >
        {/* Loading spinner overlay that matches UserAvatar loading state */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            bg-black/20
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-10
          "
          aria-label="Loading"
        >
          <div
            className={`
              ${spinnerSizeClasses[size]}
              border-2
              border-gray-300
              border-t-white
              rounded-full
              animate-spin
            `}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Auth buttons skeleton loader
 * Used when we expect to show sign in/sign up buttons
 */
export const AuthButtonsSkeleton: React.FC<AuthSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sign In Button Skeleton */}
      <Skeleton className="w-16 h-8 rounded-full bg-gray-200 animate-pulse border border-gray-300" />

      {/* Sign Up Button Skeleton - Hidden on mobile */}
      <Skeleton className="w-18 h-8 rounded-full bg-brand-primary/20 animate-pulse hidden sm:block" />
    </div>
  );
};

/**
 * Skeleton component for navigation area during authentication state restoration
 * Provides a smooth loading experience without layout shifts
 */
export const NavigationSkeleton: React.FC<AuthSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* Wishlist Icon Skeleton */}
      <Skeleton className="h-10 w-10 rounded-full" />

      {/* Cart Icon Skeleton */}
      <Skeleton className="h-10 w-10 rounded-full" />

      {/* Auth Area Skeleton */}
      <AuthButtonsSkeleton />
    </div>
  );
};

/**
 * Skeleton component for user profile section
 * Used in dropdowns and profile areas
 * Now uses enhanced AuthAvatarSkeleton for consistency
 */
export const UserProfileSkeleton: React.FC<AuthSkeletonProps> = ({
  className = '',
  size = 'md',
}) => {
  return (
    <div className={`flex items-center gap-3 p-3 ${className}`}>
      {/* Avatar - now uses consistent AuthAvatarSkeleton */}
      <AuthAvatarSkeleton size={size} />

      {/* User Info */}
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
};

/**
 * Compact skeleton for inline loading states
 * Used in smaller UI components
 */
export const CompactSkeleton: React.FC<AuthSkeletonProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
};

/**
 * Smart skeleton that adapts based on expected authentication state
 * This is the main component that should be used in most cases
 */
export const SmartAuthSkeleton: React.FC<
  AuthSkeletonProps & {
    expectAuthenticated?: boolean;
  }
> = ({ className = '', size = 'md', expectAuthenticated = false }) => {
  // If we expect the user to be authenticated, show avatar skeleton
  if (expectAuthenticated) {
    return <AuthAvatarSkeleton className={className} size={size} />;
  }

  // Otherwise, show auth buttons skeleton
  return <AuthButtonsSkeleton className={className} />;
};

export default AuthSkeleton;
