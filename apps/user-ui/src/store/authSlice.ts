import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/auth';
import { authApi } from './authApi';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set user manually (for immediate updates)
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialized = true;
    },

    // Clear auth state (for logout)
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitialized = true;
    },

    // Mark as initialized
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Handle getCurrentUser query
    builder
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        // Only set loading to true if we don't have cached user data
        // This prevents loading states when we already have cached data
        if (!state.isInitialized && !state.user) {
          state.isLoading = true;
        } else if (state.isInitialized && state.user) {
          // Background refresh - don't show loading in main UI
          state.isLoading = false;
        }
      })
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user ?? null;
          state.isAuthenticated = !!action.payload.user;
          state.isLoading = false;
          state.error = null;
          state.isInitialized = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchRejected,
        (state, action) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = action.error.message || 'Failed to get user';
          state.isInitialized = true;
        }
      );

    // Handle login mutation
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user ?? null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Handle signup mutation
    builder
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
        // Don't set user for signup - they need to verify OTP first
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Signup failed';
      });

    // Handle logout mutation
    builder
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout fails on server, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });

    // Handle OTP verification
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchFulfilled,
      (state, action) => {
        state.user = action.payload.user ?? null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        state.isInitialized = true;
      }
    );
  },
});

export const { clearError, setLoading, setUser, clearAuth, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
