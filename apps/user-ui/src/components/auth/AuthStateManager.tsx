'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import AuthButtons from './AuthButtons';
import { HeaderAuthLoadingState } from './AuthLoadingState';
import UserDropdown from './UserDropdown';

interface AuthStateManagerProps {
  className?: string;
}

/**
 * Optimized AuthStateManager with enhanced loading state hierarchy
 * Prioritizes cached data for instant rendering and eliminates unnecessary loading states
 */
export const AuthStateManager: React.FC<AuthStateManagerProps> = ({
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);

  // Get authentication state from Redux with rehydration status
  const { user, isAuthenticated, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  // Get Redux Persist rehydration status
  const isRehydrated = useAppSelector(
    (state) => (state as any)._persist?.rehydrated ?? false
  );

  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR, render a minimal loading state
  if (!isClient) {
    return (
      <div className={className}>
        <HeaderAuthLoadingState />
      </div>
    );
  }

  // PRIORITY 1: If we have cached user data (regardless of rehydration status), show immediately
  // This eliminates loading flashes when user data exists in Redux cache
  if (user && isAuthenticated) {
    // Show user dropdown with background loading indicator if API is refreshing
    const backgroundLoading = isLoading && isInitialized;
    return (
      <div className={className}>
        <UserDropdown user={user} isLoading={backgroundLoading} />
      </div>
    );
  }

  // PRIORITY 2: If rehydrated and explicitly not authenticated, show auth buttons immediately
  if (isRehydrated && !isAuthenticated && isInitialized) {
    return (
      <div className={className}>
        <AuthButtons />
      </div>
    );
  }

  // PRIORITY 3: If rehydrated but not initialized yet, and no cached user, show auth buttons
  // This handles the case where Redux Persist has loaded but auth state is still being determined
  if (isRehydrated && !user && !isAuthenticated) {
    return (
      <div className={className}>
        <AuthButtons />
      </div>
    );
  }

  // PRIORITY 4: Only show loading state if we truly don't know the auth state yet
  // This should only happen during initial app load before Redux Persist rehydration
  if (!isRehydrated || (!isInitialized && !user && isLoading)) {
    return (
      <div className={className}>
        <HeaderAuthLoadingState />
      </div>
    );
  }

  // Fallback: Show auth buttons (should rarely be reached)
  return (
    <div className={className}>
      <AuthButtons />
    </div>
  );
};

export default AuthStateManager;
