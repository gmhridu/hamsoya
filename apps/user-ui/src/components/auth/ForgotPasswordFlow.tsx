'use client';

import React, { useState } from 'react';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyForgotPasswordOTPMutation,
} from '../../hooks/useAuth';
import { toast } from '../../lib/toast';
import { ForgotPasswordFormData } from '../../lib/validations/auth';
import { useResendOtpMutation } from '../../store/authApi';
import { EmailInputForm } from './EmailInputForm';
import { ForgotPasswordOTPVerification } from './ForgotPasswordOTPVerification';
import { NewPasswordForm } from './NewPasswordForm';

export interface ForgotPasswordFlowProps {
  className?: string;
}

type ForgotPasswordStep = 'email' | 'otp' | 'password' | 'complete';

/**
 * ForgotPasswordFlow component that manages the complete forgot password process
 * including email input, OTP verification, and password reset
 */
export const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = () => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState<string>('');
  const [verifiedOTP, setVerifiedOTP] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // RTK Query mutations
  const [forgotPasswordMutation, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation();
  const verifyOTPMutation = useVerifyForgotPasswordOTPMutation();
  const [resetPasswordMutation, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();
  const [otpResendMutation] = useResendOtpMutation();

  const handleEmailSubmit = async (data: ForgotPasswordFormData) => {
    setEmail(data.email);
    setEmailError(null);

    try {
      await forgotPasswordMutation({ email: data.email }).unwrap();

      toast.success('Verification code sent!', {
        description: 'Please check your email for the OTP code.',
      });

      setCurrentStep('otp');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send verification code. Please try again.';
      setEmailError(errorMessage);
      toast.error('Failed to send code', {
        description: errorMessage,
      });
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setOtpError(null);

    try {
      await verifyOTPMutation.mutateAsync({
        email,
        otp,
      });

      setVerifiedOTP(otp);
      toast.success('OTP verified successfully!', {
        description: 'You can now set your new password.',
      });

      setCurrentStep('password');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
      toast.error('OTP verification failed', {
        description: errorMessage,
      });
    }
  };

  const handleOTPResend = async () => {
    try {
      await otpResendMutation({ email }).unwrap();

      toast.success('New code sent!', {
        description: 'Please check your email for the new OTP code.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resend code. Please try again.';
      toast.error('Failed to resend code', {
        description: errorMessage,
      });
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    setPasswordError(null);

    try {
      await resetPasswordMutation({
        email,
        otp: verifiedOTP,
        newPassword,
      }).unwrap();

      toast.success('Password reset successful!', {
        description: 'You can now login with your new password.',
      });

      setCurrentStep('complete');

      // Redirect to login page after successful password reset
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to reset password. Please try again.';
      setPasswordError(errorMessage);
      toast.error('Password reset failed', {
        description: errorMessage,
      });
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setOtpError(null);
  };

  const handleBackToOTP = () => {
    setCurrentStep('otp');
    setPasswordError(null);
  };

  // Step 1: Email Input
  if (currentStep === 'email') {
    return (
      <EmailInputForm
        onSubmit={handleEmailSubmit}
        isLoading={isForgotPasswordLoading}
        error={emailError}
      />
    );
  }

  // Step 2: OTP Verification
  if (currentStep === 'otp') {
    return (
      <ForgotPasswordOTPVerification
        email={email}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onBack={handleBackToEmail}
        isLoading={verifyOTPMutation.isLoading}
        error={otpError}
      />
    );
  }

  // Step 3: New Password
  if (currentStep === 'password') {
    return (
      <NewPasswordForm
        email={email}
        otp={verifiedOTP}
        onSubmit={handlePasswordReset}
        onBack={handleBackToOTP}
        isLoading={isResetPasswordLoading}
        error={passwordError}
      />
    );
  }

  // Step 4: Complete
  if (currentStep === 'complete') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Complete!
          </h2>
          <p className="text-gray-600">
            Your password has been successfully reset. You will be redirected to
            the login page.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
