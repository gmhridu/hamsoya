import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from '../types/auth';

// Enhanced base query with retry logic and error handling
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: '/api/auth', // Use Next.js API routes instead of external gateway
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    timeout: 10000,
  }),
  {
    maxRetries: 2,
  }
);

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User', 'Auth', 'Session'],

  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => '/user', // Updated to match Next.js API route
      providesTags: ['User', 'Session'],
      keepUnusedDataFor: 1800, // 30 minutes
      // Transform response to ensure data consistency
      transformResponse: (response: { user: User }) => {
        // Sanitize user data before storing in cache
        if (response.user) {
          const { password, ...sanitizedUser } = response.user as User & {
            password?: string;
          };
          return { user: sanitizedUser };
        }
        return response;
      },
      // Handle query lifecycle
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Handle authentication errors gracefully - silent in production
        }
      },
    }),

    // Login mutation with optimistic updates
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Auth', 'Session'],
      // Transform response to sanitize data
      transformResponse: (response: AuthResponse) => {
        if (response.user) {
          const { password, ...sanitizedUser } = response.user as User & {
            password?: string;
          };
          return { ...response, user: sanitizedUser };
        }
        return response;
      },
      // Truly optimistic updates for instant UI feedback
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        // Optimistically update the cache immediately
        const patchResult = dispatch(
          authApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
            // Optimistically assume login will succeed
            draft.user = {
              email: credentials.email,
              name: credentials.email.split('@')[0], // Temporary name
              id: 'temp-id',
            } as User;
          })
        );

        try {
          const { data } = await queryFulfilled;

          // Replace optimistic data with real data
          if (data.user) {
            dispatch(
              authApi.util.updateQueryData(
                'getCurrentUser',
                undefined,
                (draft) => {
                  Object.assign(draft, { user: data.user });
                }
              )
            );
          }
        } catch {
          // Login failed - revert optimistic update
          patchResult.undo();
        }
      },
    }),

    // Signup mutation
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Auth', 'Session'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          authApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
            Object.assign(draft, { user: null });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // OTP verification for signup (verify-user endpoint)
    verifyOtp: builder.mutation<
      AuthResponse,
      { email: string; otp: string; password: string; name: string }
    >({
      query: (data) => ({
        url: '/verify-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    // Resend OTP for signup
    resendOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Forgot password - send OTP to email
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify forgot password OTP
    verifyForgotPasswordOtp: builder.mutation<
      { message: string },
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: '/verify-forgot-password-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password with OTP
    resetPassword: builder.mutation<
      { message: string },
      { email: string; otp: string; newPassword: string }
    >({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
