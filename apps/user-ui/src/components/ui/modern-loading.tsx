'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface ModernLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'auth' | 'minimal' | 'branded';
  message?: string;
  className?: string;
  showMessage?: boolean;
}

/**
 * Modern, professional loading spinner with brand consistency
 * Replaces basic loading states throughout the authentication system
 */
export const ModernLoadingSpinner: React.FC<ModernLoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  message = 'Loading...',
  className = '',
  showMessage = true,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const getSpinnerClasses = () => {
    const baseClasses = `${sizeClasses[size]} animate-spin rounded-full border-2`;
    
    switch (variant) {
      case 'auth':
        return `${baseClasses} border-white/30 border-t-white`;
      case 'branded':
        return `${baseClasses} border-brand-accent/30 border-t-brand-primary`;
      case 'minimal':
        return `${baseClasses} border-gray-200 border-t-gray-600`;
      default:
        return `${baseClasses} border-brand-accent/30 border-t-brand-primary`;
    }
  };

  const getTextClasses = () => {
    const baseClasses = `${textSizeClasses[size]} font-medium`;
    
    switch (variant) {
      case 'auth':
        return `${baseClasses} text-white/90`;
      case 'branded':
        return `${baseClasses} text-brand-primary`;
      case 'minimal':
        return `${baseClasses} text-gray-600`;
      default:
        return `${baseClasses} text-brand-primary`;
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      containerSizeClasses[size],
      className
    )}>
      {/* Modern spinner with brand colors */}
      <div className={getSpinnerClasses()} />
      
      {/* Optional message */}
      {showMessage && message && (
        <p className={getTextClasses()}>
          {message}
        </p>
      )}
    </div>
  );
};

interface BrandedLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'auth' | 'dashboard' | 'minimal';
  className?: string;
}

/**
 * Full-screen loading overlay with glassmorphism effect
 * Perfect for authentication state transitions
 */
export const BrandedLoadingOverlay: React.FC<BrandedLoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  variant = 'auth',
  className = '',
}) => {
  if (!isVisible) return null;

  const getBackgroundClasses = () => {
    switch (variant) {
      case 'auth':
        return 'bg-gradient-to-br from-brand-secondary/95 via-brand-secondary/90 to-brand-accent/95';
      case 'dashboard':
        return 'bg-white/95 backdrop-blur-sm';
      case 'minimal':
        return 'bg-white/80 backdrop-blur-sm';
      default:
        return 'bg-gradient-to-br from-brand-secondary/95 via-brand-secondary/90 to-brand-accent/95';
    }
  };

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      getBackgroundClasses(),
      className
    )}>
      <div className="text-center space-y-6">
        {/* Enhanced spinner with multiple rings */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Brand name and message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-sora">Hamsoya</h2>
          <p className="text-white/80 font-medium font-urbanist">{message}</p>
        </div>
      </div>
    </div>
  );
};

interface PulseLoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'auth' | 'minimal';
  className?: string;
}

/**
 * Elegant pulsing dots loader for subtle loading states
 */
export const PulseLoadingDots: React.FC<PulseLoadingDotsProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  const getDotClasses = () => {
    const baseClasses = `${dotSizeClasses[size]} rounded-full`;
    
    switch (variant) {
      case 'auth':
        return `${baseClasses} bg-white/80`;
      case 'minimal':
        return `${baseClasses} bg-gray-400`;
      default:
        return `${baseClasses} bg-brand-primary`;
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-center',
      gapClasses[size],
      className
    )}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={getDotClasses()}
          style={{
            animation: `pulse 1.4s ease-in-out ${index * 0.16}s infinite both`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

interface SkeletonLoadingProps {
  variant?: 'auth-button' | 'auth-avatar' | 'auth-form' | 'navigation';
  className?: string;
}

/**
 * Professional skeleton loading components that match actual UI elements
 */
export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  variant = 'auth-button',
  className = '',
}) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'auth-avatar':
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse border-2 border-white shadow-sm" />
          </div>
        );
      
      case 'auth-button':
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-8 rounded-full bg-gray-200 animate-pulse border border-gray-300" />
            <div className="w-20 h-8 rounded-full bg-brand-primary/20 animate-pulse hidden sm:block" />
          </div>
        );
      
      case 'auth-form':
        return (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 bg-brand-primary/20 rounded-full animate-pulse" />
          </div>
        );
      
      case 'navigation':
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-16 h-8 rounded-full bg-gray-200 animate-pulse" />
          </div>
        );
      
      default:
        return (
          <div className="w-16 h-8 rounded-full bg-gray-200 animate-pulse" />
        );
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      {getSkeletonContent()}
    </div>
  );
};

export default ModernLoadingSpinner;
