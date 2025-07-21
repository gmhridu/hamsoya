'use client';

import React from 'react';

interface AuthLoadingStateProps {
  variant?: 'login' | 'signup' | 'forgot-password';
  className?: string;
}

/**
 * Professional loading state component for authentication pages
 * Matches the brand design system with gradient backgrounds and smooth animations
 */
export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({
  variant = 'login',
  className = '',
}) => {
  const getGradientClasses = () => {
    switch (variant) {
      case 'login':
        return 'from-brand-primary via-brand-primary/90 to-brand-secondary';
      case 'signup':
        return 'from-brand-secondary via-brand-secondary/90 to-brand-accent';
      case 'forgot-password':
        return 'from-brand-primary via-brand-primary/90 to-brand-secondary';
      default:
        return 'from-brand-primary via-brand-primary/90 to-brand-secondary';
    }
  };

  const getBackgroundPattern = () => {
    switch (variant) {
      case 'login':
        return 'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
      case 'signup':
        return 'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
      case 'forgot-password':
        return 'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
      default:
        return 'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)';
    }
  };

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${getGradientClasses()} relative overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: getBackgroundPattern(),
        }}
      />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Loading Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6">
          {/* Brand Loading Spinner */}
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
            {/* Spinning inner ring */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <div className="text-white text-lg font-medium font-sora mb-2">
              Initializing...
            </div>
            <div className="text-white/70 text-sm font-urbanist">
              Please wait while we prepare your experience
            </div>
          </div>

          {/* Loading Progress Dots */}
          <div className="flex items-center gap-2">
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
 * Minimal loading state for header authentication component
 */
export const HeaderAuthLoadingState: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Skeleton for auth buttons */}
      <div className="flex items-center gap-2">
        <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

/**
 * User avatar skeleton loading state
 */
export const UserAvatarLoadingState: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`}></div>
    </div>
  );
};

export default AuthLoadingState;
