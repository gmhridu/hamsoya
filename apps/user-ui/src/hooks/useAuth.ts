'use client';

import { useRouter } from 'next/navigation';
import {
  useResendOtpMutation,
  useForgotPasswordMutation as useRTKForgotPasswordMutation,
  useLoginMutation as useRTKLoginMutation,
  useLogoutMutation as useRTKLogoutMutation,
  useResetPasswordMutation as useRTKResetPasswordMutation,
  useSignupMutation as useRTKSignupMutation,
  useVerifyForgotPasswordOtpMutation,
  useVerifyOtpMutation,
} from '../store/authApi';
import { clearAuth, setUser } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import { LoginRequest } from '../types/auth';

export const useSignupMutation = () => {
  return useRTKSignupMutation();
};

export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useRTKLoginMutation();

  const handleLogin = async (data: LoginRequest) => {
    try {
      const result = await login(data).unwrap();

      // OPTIMIZATION: Set user data in Redux store immediately for instant UI updates
      if (result.user) {
        dispatch(setUser(result.user));
      }

      // OPTIMIZATION: Use ViewTransition API for smooth navigation
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace('/');
        });
      } else {
        router.replace('/');
      }

      return result;
    } catch (error) {
      // Clear any partial auth state on login failure
      dispatch(clearAuth());
      throw error;
    }
  };

  return {
    mutate: handleLogin,
    mutateAsync: handleLogin,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error,
  };
};

export const useOTPVerificationMutation = () => {
  const router = useRouter();
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

  const handleVerifyOTP = async (data: {
    email: string;
    otp: string;
    password: string;
    name: string;
  }) => {
    const result = await verifyOtp(data).unwrap();
    router.push('/login');
    return result;
  };

  return {
    mutate: handleVerifyOTP,
    mutateAsync: handleVerifyOTP,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error,
  };
};

export const useOTPResendMutation = () => {
  return useResendOtpMutation();
};

export const useForgotPasswordMutation = () => {
  return useRTKForgotPasswordMutation();
};

export const useVerifyForgotPasswordOTPMutation = () => {
  const [verifyForgotPasswordOtp, { isLoading, error }] =
    useVerifyForgotPasswordOtpMutation();

  const handleVerifyForgotPasswordOTP = async (data: {
    email: string;
    otp: string;
  }) => {
    const result = await verifyForgotPasswordOtp(data).unwrap();
    return result;
  };

  return {
    mutate: handleVerifyForgotPasswordOTP,
    mutateAsync: handleVerifyForgotPasswordOTP,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error,
  };
};

export const useResetPasswordMutation = () => {
  return useRTKResetPasswordMutation();
};

export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout, { isLoading, error }] = useRTKLogoutMutation();

  const handleLogout = async () => {
    try {
      // OPTIMIZATION: Clear auth state immediately for instant UI updates
      dispatch(clearAuth());

      // Call logout API in background
      await logout().unwrap();

      // OPTIMIZATION: Use ViewTransition API for smooth navigation to login
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace('/login');
        });
      } else {
        router.replace('/login');
      }
    } catch (error) {
      // Even if logout fails, ensure auth state is cleared and redirect for security
      dispatch(clearAuth());

      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace('/login');
        });
      } else {
        router.replace('/login');
      }

      throw error;
    }
  };

  return {
    mutate: handleLogout,
    mutateAsync: handleLogout,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error,
  };
};
