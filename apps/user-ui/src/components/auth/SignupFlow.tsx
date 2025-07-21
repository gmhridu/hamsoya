'use client';

import React, { useState } from 'react';
import {
  useOTPVerificationMutation,
  useSignupMutation,
} from '../../hooks/useAuth';
import { toast } from '../../lib/toast';
import { SignupFormData } from '../../lib/validations/auth';
import { useResendOtpMutation } from '../../store/authApi';
import type { LoginRequest, SignupRequest } from '../../types/auth';
import { AuthForm } from './AuthForm';
import { OTPVerification } from './OTPVerification';

export interface SignupFlowProps {
  className?: string;
}

type SignupStep = 'form' | 'otp' | 'complete';

/**
 * SignupFlow component that manages the complete signup process
 * including form submission and OTP verification
 */
export const SignupFlow: React.FC<SignupFlowProps> = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('form');
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // RTK Query mutations
  const [signupMutation] = useSignupMutation();
  const otpVerificationMutation = useOTPVerificationMutation();
  const [otpResendMutation] = useResendOtpMutation();

  const handleSignupSubmit = async (data: SignupRequest | LoginRequest) => {
    // Type guard to ensure we have signup data
    if (!('name' in data)) {
      throw new Error('Invalid signup data');
    }

    const signupData = data as SignupRequest;
    // Store signup data for OTP verification
    setSignupData(signupData as SignupFormData);

    // Call real signup API
    await signupMutation({
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
    }).unwrap();

    // Move to OTP verification step
    setCurrentStep('otp');
    setOtpError(null);
  };

  const handleOtpVerify = async (otp: string) => {
    if (!signupData) return;

    setOtpError(null);

    try {
      // Call real OTP verification API
      await otpVerificationMutation.mutateAsync({
        email: signupData.email,
        otp: otp,
        password: signupData.password,
        name: signupData.name,
      });

      // Show success message
      toast.success('Account created successfully!', {
        description: 'Welcome to Hamsoya! Please login to continue.',
      });

      // Redirect to login page after successful signup and OTP verification
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to verify OTP. Please try again.';
      setOtpError(errorMessage);
    }
  };

  const handleOtpResend = async () => {
    if (!signupData) return;

    try {
      // Call real OTP resend API (now only requires email)
      await otpResendMutation({
        email: signupData.email,
      }).unwrap();

      setOtpError(null);

      // Show success toast
      toast.success('Verification code sent!', {
        description: 'A new verification code has been sent to your email.',
      });

      // The countdown timer is handled by the OTPVerification component
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to resend OTP. Please try again.';
      setOtpError(errorMessage);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setOtpError(null);
  };

  // Render based on current step
  if (currentStep === 'otp' && signupData) {
    return (
      <div className="space-y-6">
        {/* OTP Verification */}
        <OTPVerification
          email={signupData.email}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
          onBack={handleBackToForm}
          isLoading={otpVerificationMutation.isLoading}
          error={otpError}
        />
      </div>
    );
  }

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
            Welcome to Hamsoya!
          </h2>
          <p className="text-gray-600">
            Your account has been created successfully.
          </p>
        </div>
      </div>
    );
  }

  // Default: Show signup form
  return (
    <div className="space-y-6">
      {/* Signup Form with integrated social auth */}
      <AuthForm mode="signup" onSubmit={handleSignupSubmit} />
    </div>
  );
};
