'use client';

import { useCallback } from 'react';
import { authApi } from '../store/authApi';
import { clearAuth, setUser } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import { User } from '../types/auth';
import { useAuthNavigation } from './useEnhancedNavigation';

/**
 * Hook that provides authentication actions with Redux state management
 * This hook ensures that after login/logout, the auth state is properly updated
 */
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const { handleLogoutNavigation } = useAuthNavigation();

  /**
   * Invalidate all authentication-related queries
   * This forces a fresh fetch of user data and auth status
   */
  const invalidateAuthQueries = useCallback(() => {
    dispatch(authApi.util.invalidateTags(['User', 'Auth', 'Session']));
  }, [dispatch]);

  /**
   * Clear all authentication-related cache
   * Use this on logout or authentication errors
   */
  const clearAuthCache = useCallback(() => {
    dispatch(clearAuth());
    dispatch(authApi.util.resetApiState());
  }, [dispatch]);

  /**
   * Set user data in cache immediately
   * Use this after successful login for instant UI updates
   */
  const setUserInCache = useCallback(
    (user: User) => {
      dispatch(setUser(user));
    },
    [dispatch]
  );

  /**
   * Refresh user data
   * Forces a fresh fetch of current user data
   */
  const refreshUserData = useCallback(async () => {
    dispatch(authApi.util.invalidateTags(['User']));
    // The RTK Query will automatically refetch when invalidated
    return true;
  }, [dispatch]);

  /**
   * Handle successful login
   * Call this after a successful login to update the auth state
   */
  const handleLoginSuccess = useCallback(
    async (redirectPath = '/') => {
      // Invalidate queries to trigger fresh data fetch
      invalidateAuthQueries();

      // Force a fresh user data fetch
      try {
        await refreshUserData();
      } catch {
        // Silent error handling for production
      }
    },
    [invalidateAuthQueries, refreshUserData]
  );

  /**
   * Handle logout with enhanced navigation and smooth transitions
   * Call this to clear all auth state and redirect with optimized UX
   */
  const handleLogout = useCallback(async () => {
    try {
      // Clear all auth cache
      clearAuthCache();

      // Use enhanced navigation for smooth post-logout experience
      handleLogoutNavigation('/');
    } catch {
      // Even if API call fails, clear local cache and redirect
      clearAuthCache();

      // Use enhanced navigation for smooth transition
      handleLogoutNavigation('/');
    }
  }, [clearAuthCache, handleLogoutNavigation]);

  /**
   * Handle token refresh
   * Call this when tokens need to be refreshed
   */
  const handleTokenRefresh = useCallback(async () => {
    try {
      // Invalidate auth queries to trigger refresh
      invalidateAuthQueries();
      return true;
    } catch (error) {
      // Clear auth cache and redirect to login
      clearAuthCache();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return false;
    }
  }, [invalidateAuthQueries, clearAuthCache]);

  /**
   * Check and refresh tokens if needed
   * Call this periodically or when getting 401 errors
   */
  const checkAndRefreshTokens = useCallback(async () => {
    try {
      // Invalidate queries to trigger fresh fetch
      invalidateAuthQueries();
      return true;
    } catch (error: any) {
      if (error.message?.includes('401')) {
        // Try to refresh tokens
        return await handleTokenRefresh();
      }
      throw error;
    }
  }, [handleTokenRefresh, invalidateAuthQueries]);

  return {
    invalidateAuthQueries,
    clearAuthCache,
    setUserInCache,
    refreshUserData,
    handleLoginSuccess,
    handleLogout,
    handleTokenRefresh,
    checkAndRefreshTokens,
  };
};

export default useAuthActions;
