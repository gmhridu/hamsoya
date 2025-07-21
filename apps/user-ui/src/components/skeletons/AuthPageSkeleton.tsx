'use client';

import React from 'react';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

interface AuthPageSkeletonProps {
  variant?: 'login' | 'signup' | 'forgot-password';
  className?: string;
}

/**
 * Authentication page skeleton loader for when authenticated users navigate to auth pages
 * Shows during middleware authentication check and redirect process
 * Matches the auth page design with branded gradients and glass-morphism effects
 */
export const AuthPageSkeleton: React.FC<AuthPageSkeletonProps> = ({
  variant = 'login',
  className = '',
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case 'login':
        return 'from-brand-secondary via-brand-secondary/90 to-brand-accent';
      case 'signup':
        return 'from-brand-primary via-brand-primary/90 to-brand-secondary';
      case 'forgot-password':
        return 'from-brand-primary via-brand-primary/90 to-brand-secondary';
      default:
        return 'from-brand-secondary via-brand-secondary/90 to-brand-accent';
    }
  };

  const getBackgroundPattern = () => {
    switch (variant) {
      case 'login':
        return 'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
      case 'signup':
        return 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
      case 'forgot-password':
        return 'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
      default:
        return 'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
    }
  };

  const getTitle = () => {
    switch (variant) {
      case 'login':
        return 'Welcome Back';
      case 'signup':
        return 'Join Hamsoya';
      case 'forgot-password':
        return 'Reset Password';
      default:
        return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch (variant) {
      case 'login':
        return 'Sign in to your Hamsoya account';
      case 'signup':
        return 'Create your account to access premium natural products';
      case 'forgot-password':
        return 'Reset your password to regain access';
      default:
        return 'Sign in to your Hamsoya account';
    }
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getGradientClasses()} relative overflow-hidden ${className}`}
      style={{ viewTransitionName: 'auth-main' }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: getBackgroundPattern(),
          viewTransitionName: 'auth-background',
        }}
      />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-200 font-medium"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-sora">
              {getTitle()}
            </h1>
            <p className="text-white/80 font-urbanist">
              {getSubtitle()}
            </p>
          </div>

          {/* Form Card Skeleton */}
          <div className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl rounded-lg animate-pulse">
            {/* Card Header */}
            <div className="p-6 pb-4 space-y-1">
              <Skeleton className="h-8 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>

            {/* Card Content */}
            <div className="p-6 pt-2 space-y-6">
              {/* Loading Message */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-brand-primary font-medium">Checking authentication...</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Please wait while we verify your session
                </p>
              </div>

              {/* Form Fields Skeleton */}
              <div className="space-y-4">
                {variant === 'signup' && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {variant === 'login' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                )}
              </div>

              {/* Social Auth Skeleton */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Skeleton className="h-px w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">OR</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 rounded-full" />
                  <Skeleton className="h-10 rounded-full" />
                </div>
              </div>

              {/* Submit Button Skeleton */}
              <Skeleton className="h-12 w-full rounded-full" />

              {/* Footer Links Skeleton */}
              <div className="text-center space-y-2">
                <Skeleton className="h-4 w-40 mx-auto" />
                {variant === 'login' && (
                  <Skeleton className="h-4 w-36 mx-auto" />
                )}
              </div>
            </div>
          </div>

          {/* Loading Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </main>
  );
};

/**
 * Minimal auth page skeleton for quick transitions
 * Used when we need a lighter loading state
 */
export const MinimalAuthPageSkeleton: React.FC<AuthPageSkeletonProps> = ({
  variant = 'login',
  className = '',
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case 'login':
        return 'from-brand-secondary via-brand-secondary/90 to-brand-accent';
      case 'signup':
        return 'from-brand-primary via-brand-primary/90 to-brand-secondary';
      default:
        return 'from-brand-secondary via-brand-secondary/90 to-brand-accent';
    }
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getGradientClasses()} relative overflow-hidden ${className}`}
    >
      {/* Centered loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <div className="text-white text-lg font-medium font-sora">
            Redirecting...
          </div>
          <div className="text-white/70 text-sm font-urbanist">
            Taking you to the right place
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthPageSkeleton;
