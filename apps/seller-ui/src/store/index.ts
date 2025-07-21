import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers and APIs
import { sellerAuthApi } from './authApi';
import authReducer from './authSlice';

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Create storage that works properly in both SSR and client environments
const createPersistStorage = () => {
  if (typeof window === 'undefined') {
    // Server-side: use noop storage
    return createNoopStorage();
  }

  // Client-side: use localStorage with error handling
  try {
    // Test if localStorage is available and working
    const testKey = '__redux_persist_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return storage; // Use redux-persist's localStorage
  } catch (error) {
    // Fallback to noop if localStorage is not available (private browsing, etc.)
    console.warn('localStorage not available, using noop storage');
    return createNoopStorage();
  }
};

// Use the robust storage configuration
const persistStorage = createPersistStorage();

// Persist configuration for seller auth
const persistConfig = {
  key: 'seller-auth',
  version: 3, // Increment version for breaking changes
  storage: persistStorage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: [sellerAuthApi.reducerPath], // Don't persist API cache
  migrate: (state: any) => {
    // Migration logic for handling version changes - return Promise
    return Promise.resolve(
      (() => {
        if (state && state._persist && state._persist.version < 3) {
          // Clear any potentially unsafe data from previous versions
          return {
            ...state,
            auth: {
              ...(state.auth || {}),
              // Remove any tokens that might have been persisted in old versions
              tokens: undefined,
              accessToken: undefined,
              refreshToken: undefined,
            },
          };
        }
        return state;
      })()
    );
  },
  // Production-ready configuration without debug logging
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  [sellerAuthApi.reducerPath]: sellerAuthApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig as any, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['auth.error'],
      },
      immutableCheck: {
        warnAfter: 128,
      },
    }).concat(sellerAuthApi.middleware) as any,
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
