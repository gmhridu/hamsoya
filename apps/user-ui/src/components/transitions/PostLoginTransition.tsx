'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store';
import { HomePageSkeleton } from '../skeletons/HomePageSkeleton';

interface PostLoginTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Post-login transition component that shows home page skeleton
 * during navigation to eliminate white screen flashes
 * Provides smooth transition from login to home page
 */
export const PostLoginTransition: React.FC<PostLoginTransitionProps> = ({
  children,
  className = '',
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Handle post-login transition
  useEffect(() => {
    // Check if we just completed login (authenticated with user data)
    if (isAuthenticated && user && !isTransitioning) {
      setIsTransitioning(true);
      setShowSkeleton(true);

      // Use ViewTransition API for smooth navigation if available
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace('/');
        });
      } else {
        router.replace('/');
      }

      // Hide skeleton after navigation completes
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setIsTransitioning(false);
      }, 1500); // Allow time for page to load

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, isTransitioning, router]);

  // Show skeleton during transition
  if (showSkeleton && isTransitioning) {
    return (
      <div className={className} style={{ viewTransitionName: 'main-content' }}>
        <HomePageSkeleton />
      </div>
    );
  }

  // Show normal content
  return <div className={className}>{children}</div>;
};

/**
 * Hook for managing post-login navigation with skeleton loading
 * Provides smooth transition without white screens
 */
export const usePostLoginNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const navigateToHome = async () => {
    setIsNavigating(true);

    try {
      // Use ViewTransition API for smooth navigation
      if ('startViewTransition' in document) {
        await new Promise<void>((resolve) => {
          (document as any).startViewTransition(() => {
            router.replace('/');
            resolve();
          });
        });
      } else {
        router.replace('/');
      }
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  };

  return {
    isNavigating,
    navigateToHome,
  };
};

/**
 * Loading overlay component for smooth transitions
 * Shows during authentication state changes
 */
export const TransitionLoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  className?: string;
}> = ({ isVisible, message = 'Loading...', className = '' }) => {
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
      style={{ viewTransitionName: 'loading-overlay' }}
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
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced router wrapper that provides smooth transitions
 * Eliminates white screens during navigation
 */
export const SmoothRouter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Enhanced navigation function with skeleton loading
  const enhancedPush = (href: string) => {
    setIsTransitioning(true);

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        router.push(href);
        setTimeout(() => setIsTransitioning(false), 500);
      });
    } else {
      router.push(href);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const enhancedReplace = (href: string) => {
    setIsTransitioning(true);

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        router.replace(href);
        setTimeout(() => setIsTransitioning(false), 500);
      });
    } else {
      router.replace(href);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Provide enhanced router context
  React.useEffect(() => {
    // Override router methods for smooth transitions
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = enhancedPush;
    router.replace = enhancedReplace;

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  return (
    <div className={className}>
      {children}
      <TransitionLoadingOverlay 
        isVisible={isTransitioning} 
        message="Navigating..."
      />
    </div>
  );
};

export default PostLoginTransition;
