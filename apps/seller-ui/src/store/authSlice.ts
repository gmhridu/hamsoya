import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Seller, SellerAuthState } from '../types/auth';

// Initial state
const initialState: SellerAuthState = {
  seller: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  lastActivity: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set seller data
    setSeller: (state, action: PayloadAction<Seller | null>) => {
      state.seller = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      if (action.payload) {
        state.lastActivity = Date.now();
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set initialized state
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },

    // Update last activity
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },

    // Clear auth state (logout)
    clearAuth: (state) => {
      state.seller = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastActivity = null;
    },

    // Update seller profile
    updateSellerProfile: (state, action: PayloadAction<Partial<Seller>>) => {
      if (state.seller) {
        state.seller = { ...state.seller, ...action.payload };
        state.lastActivity = Date.now();
      }
    },
  },
});

// Export actions
export const {
  setSeller,
  setLoading,
  setError,
  setInitialized,
  updateLastActivity,
  clearAuth,
  updateSellerProfile,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
