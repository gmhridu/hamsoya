import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Seller,
  SellerAuthResponse,
  SellerLoginRequest,
  SellerOTPRequest,
  SellerPasswordResetConfirmRequest,
  SellerPasswordResetRequest,
  SellerSignupRequest,
} from '../types/auth';

// Simplified base query for better performance
const baseQueryWithRetry = fetchBaseQuery({
  baseUrl: '/api/seller/auth', // Seller-specific API routes
  credentials: 'include', // Include cookies for authentication
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  timeout: 5000, // Reduced timeout for faster responses
});

export const sellerAuthApi = createApi({
  reducerPath: 'sellerAuthApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Seller', 'Auth', 'Session'],

  keepUnusedDataFor: 60, // Reduced cache time for better performance
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false, // Disable auto-refetch to prevent async issues
  endpoints: (builder) => ({
    getCurrentSeller: builder.query<{ seller: Seller }, void>({
      query: () => '/user', // Get current seller info
      providesTags: ['Seller', 'Session'],
      keepUnusedDataFor: 1800, // 30 minutes
      // Transform response to ensure data consistency
      transformResponse: (response: { seller: Seller }) => {
        // Sanitize seller data before storing in cache
        if (response.seller) {
          const { ...sanitizedSeller } = response.seller;
          return { seller: sanitizedSeller };
        }
        return response;
      },
      // Simplified query lifecycle - removed async handling to prevent promise errors
    }),

    // Login mutation with optimistic updates
    login: builder.mutation<SellerAuthResponse, SellerLoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Seller', 'Auth', 'Session'],
      // Transform response to sanitize data
      transformResponse: (response: SellerAuthResponse) => {
        if (response.seller) {
          const { ...sanitizedSeller } = response.seller;
          return { ...response, seller: sanitizedSeller };
        }
        return response;
      },
    }),

    // Signup mutation
    signup: builder.mutation<SellerAuthResponse, SellerSignupRequest>({
      query: (sellerData) => ({
        url: '/signup',
        method: 'POST',
        body: sellerData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // OTP verification
    verifyOTP: builder.mutation<SellerAuthResponse, SellerOTPRequest>({
      query: (otpData) => ({
        url: '/verify-otp',
        method: 'POST',
        body: otpData,
      }),
      invalidatesTags: ['Seller', 'Auth', 'Session'],
    }),

    // Resend OTP
    resendOTP: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (data) => ({
        url: '/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Password reset request
    requestPasswordReset: builder.mutation<
      { success: boolean; message: string },
      SellerPasswordResetRequest
    >({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Password reset confirmation
    resetPassword: builder.mutation<
      SellerAuthResponse,
      SellerPasswordResetConfirmRequest
    >({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Logout mutation
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Seller', 'Auth', 'Session'],
    }),

    // Refresh token
    refreshToken: builder.mutation<SellerAuthResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Session'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetCurrentSellerQuery,
  useLoginMutation,
  useSignupMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = sellerAuthApi;
