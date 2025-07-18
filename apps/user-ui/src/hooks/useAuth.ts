'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authAPI } from '../lib/auth-api';
import { queryKeys } from '../lib/query-config';
import { AuthResponse, LoginRequest, SignupRequest } from '../types/auth';

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: (data: SignupRequest): Promise<AuthResponse> =>
      authAPI.signup(data),
  });
};

export const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest): Promise<AuthResponse> =>
      authAPI.login(data),
    onSuccess: (data) => {
      // Store user data in query cache for persistence
      if (data.user) {
        queryClient.setQueryData(queryKeys.auth.user, data.user);
      }

      // Tokens are automatically stored in HTTP-only cookies by the backend
      // Invalidate auth status to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });

      router.push('/');
    },
    onError: () => {
      // Clear any partial auth state on login failure
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
      queryClient.removeQueries({ queryKey: ['auth', 'status'] });
    },
  });
};

export const useOTPVerificationMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      password: string;
      name: string;
    }): Promise<AuthResponse> => authAPI.verifyOTP(data),
    onSuccess: () => {
      router.push('/login');
    },
  });
};

export const useOTPResendMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
    }): Promise<{ success: boolean; message: string }> =>
      authAPI.resendOTP(data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (
      email: string
    ): Promise<{ success: boolean; message: string }> =>
      authAPI.forgotPassword(email),
  });
};

export const useVerifyForgotPasswordOTPMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
    }): Promise<{ success: boolean; message: string }> =>
      authAPI.verifyForgotPasswordOTP(data),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      newPassword: string;
    }): Promise<{ success: boolean; message: string }> =>
      authAPI.resetPassword(data),
  });
};

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<{ success: boolean; message: string }> =>
      authAPI.logout(),
    onSuccess: () => {
      // Clear all auth-related queries from TanStack Query cache
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
      queryClient.removeQueries({ queryKey: queryKeys.auth.session });
      queryClient.removeQueries({ queryKey: ['auth', 'status'] });

      // HTTP-only cookies are cleared by the server
      router.push('/login');
    },
    onError: () => {
      // Even if logout fails, clear local state
      queryClient.removeQueries({ queryKey: queryKeys.auth.user });
      queryClient.removeQueries({ queryKey: queryKeys.auth.session });
      queryClient.removeQueries({ queryKey: ['auth', 'status'] });

      // Redirect anyway since cookies should be cleared
      router.push('/login');
    },
  });
};
