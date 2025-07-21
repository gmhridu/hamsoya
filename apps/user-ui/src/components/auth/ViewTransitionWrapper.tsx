'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ViewTransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that enables view transitions for authentication flows
 * Uses Next.js experimental view transitions and React's concurrent features
 */
export const ViewTransitionWrapper: React.FC<ViewTransitionWrapperProps> = ({
  children,
  className = '',
}) => {
  useEffect(() => {
    // Enable view transitions for supported browsers
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Add view transition names for smooth animations
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.viewTransitionName = 'main-content';
      }
    }
  }, []);

  return (
    <div className={className} style={{ viewTransitionName: 'auth-container' }}>
      {children}
    </div>
  );
};

/**
 * Hook for handling view transitions in authentication flows
 * Optimized for instant redirects and smooth navigation
 */
export const useViewTransition = () => {
  const router = useRouter();

  const navigateWithTransition = (path: string, replace = false) => {
    // For authentication redirects, use immediate navigation without transitions
    const isAuthRedirect = [
      '/login',
      '/signup',
      '/forgot-password',
      '/',
    ].includes(path);

    if (isAuthRedirect) {
      // Instant navigation for auth redirects to prevent content flash
      if (replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
      return;
    }

    // For other navigation, use view transitions if supported
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (
        document as Document & {
          startViewTransition: (callback: () => void) => void;
        }
      ).startViewTransition(() => {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      });
    } else {
      // Fallback for browsers without view transition support
      if (replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    }
  };

  return { navigateWithTransition };
};

/**
 * Enhanced authentication page wrapper with view transitions
 */
interface AuthPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({
  children,
  className = '',
  gradientFrom = 'from-brand-secondary',
  gradientTo = 'to-brand-accent',
}) => {
  return (
    <ViewTransitionWrapper>
      <main
        className={`min-h-screen bg-gradient-to-br ${gradientFrom} via-brand-secondary/90 ${gradientTo} relative overflow-hidden ${className}`}
        style={{ viewTransitionName: 'auth-main' }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            viewTransitionName: 'auth-background',
          }}
        />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div
          className="relative z-10 min-h-screen flex items-center justify-center p-4"
          style={{ viewTransitionName: 'auth-content' }}
        >
          {children}
        </div>
      </main>
    </ViewTransitionWrapper>
  );
};

export default ViewTransitionWrapper;
