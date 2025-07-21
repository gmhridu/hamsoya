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
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { authApi } from './authApi';
import authReducer from './authSlice';

// SSR-safe storage wrapper for Next.js compatibility
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Create SSR-safe storage that only works on client-side
const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

// Enhanced data sanitization transform for security and token management
const sanitizeTransform = {
  in: (inboundState: unknown) => {
    // Security: Remove ALL sensitive data before persisting to localStorage
    const state = inboundState as { user?: Record<string, unknown> };
    if (state?.user) {
      const {
        password,
        accessToken,
        refreshToken,
        token,
        tokens,
        ...sanitizedUser
      } = state.user;

      return {
        ...(inboundState as Record<string, unknown>),
        user: sanitizedUser,
        // Never persist tokens - they're handled via HTTP-only cookies
        tokens: undefined,
        accessToken: undefined,
        refreshToken: undefined,
      };
    }
    return inboundState;
  },
  out: (outboundState: unknown) => {
    // Data is already sanitized during persistence
    return outboundState;
  },
};

// Professional Redux persist configuration with enhanced security
const persistConfig = {
  key: 'hamsoya-auth-v3', // Updated key for new security implementation
  storage,
  whitelist: ['auth'], // ONLY persist auth state (user profile + flags)
  blacklist: ['authApi'], // NEVER persist API cache (contains sensitive data)
  version: 3, // Increment for new security features
  transforms: [sanitizeTransform], // Apply comprehensive data sanitization
  // Performance optimizations
  throttle: 100, // Throttle writes to improve performance
  // Migration for version updates - async function returning Promise
  migrate: async (state: unknown): Promise<unknown> => {
    // Handle migration from previous versions
    const persistedState = state as {
      _persist?: { version: number };
      auth?: Record<string, unknown>;
      [key: string]: unknown;
    };

    if (
      persistedState &&
      persistedState._persist &&
      persistedState._persist.version < 3
    ) {
      // Clear any potentially unsafe data from previous versions
      return {
        ...persistedState,
        auth: {
          ...(persistedState.auth || {}),
          // Remove any tokens that might have been persisted in old versions
          tokens: undefined,
          accessToken: undefined,
          refreshToken: undefined,
        },
      };
    }
    return state;
  },
  // Production-ready configuration without debug logging
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
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
    }).concat(authApi.middleware) as any,
  devTools:
    process.env.NODE_ENV !== 'production'
      ? ({
          actionSanitizer: (action: { type: string; payload?: unknown }) => {
            if (
              action.type?.includes('login') ||
              action.type?.includes('signup')
            ) {
              return {
                ...action,
                payload: {
                  ...(action.payload as Record<string, unknown>),
                  password: '***REDACTED***',
                  confirmPassword: '***REDACTED***',
                },
              };
            }
            return action;
          },
          stateSanitizer: (state: any) => ({
            ...state,
            auth: {
              ...state.auth,
              user: state.auth.user
                ? {
                    ...state.auth.user,
                    password: undefined,
                  }
                : null,
            },
          }),
          maxAge: 50,
          trace: true,
        } as any)
      : false,
});

// Create persistor with production-ready configuration
export const persistor = persistStore(store);

// Types - Define after store creation to avoid circular dependencies
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';
