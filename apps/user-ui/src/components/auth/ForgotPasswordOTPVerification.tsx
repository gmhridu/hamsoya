'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  forgotPasswordOTPSchema,
  type ForgotPasswordOTPFormData,
} from '../../lib/validations/auth';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { LoadingButton } from '../ui/loading';

export interface ForgotPasswordOTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Forgot Password OTP Verification Component
 * Professional OTP input with countdown timer, resend functionality, and brand styling
 */
export const ForgotPasswordOTPVerification: React.FC<
  ForgotPasswordOTPVerificationProps
> = ({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  error = null,
}) => {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<ForgotPasswordOTPFormData>({
    resolver: zodResolver(forgotPasswordOTPSchema),
    defaultValues: {
      otp: '',
      email,
    },
    mode: 'onChange',
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      return undefined;
    }
  }, [countdown]);

  const handleSubmit = async (data: ForgotPasswordOTPFormData) => {
    try {
      await onVerify(data.otp);
    } catch (error) {
      // Error handling is managed by parent component
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      await onResend();
      setCountdown(60);
      setCanResend(false);
      form.setValue('otp', ''); // Clear OTP input
    } catch (error) {
      // Error handling is managed by parent component
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h3>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-brand-primary font-medium">{email}</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3 h-3 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* OTP Input */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="text-center block text-gray-700 font-medium text-base">
                  Enter Verification Code
                </FormLabel>
                <FormControl>
                  <div className="flex justify-center py-4">
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      containerClassName="gap-3"
                    >
                      <InputOTPGroup className="gap-3">
                        <InputOTPSlot
                          index={0}
                          className="w-12 h-12 text-lg font-bold border-2 border-gray-300 hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-12 h-12 text-lg font-bold border-2 border-gray-300 hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-12 h-12 text-lg font-bold border-2 border-gray-300 hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={3}
                          className="w-12 h-12 text-lg font-bold border-2 border-gray-300 hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={4}
                          className="w-12 h-12 text-lg font-bold border-2 border-gray-300 hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <InputOTPSlot
                          index={5}
                          className="w-12 h-12 text-lg font-bold border-2 border-gray-300 hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-sm text-center" />
              </FormItem>
            )}
          />

          {/* Verify Button */}
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || form.watch('otp').length !== 6}
            className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Verifying...'
            ) : (
              <div className="flex items-center justify-center gap-0.5">
                Verify Code
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </LoadingButton>

          {/* Resend Code */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              {canResend ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-brand-primary hover:text-brand-primary/80 font-medium p-0 h-auto"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </Button>
              ) : (
                <span className="text-gray-500">Resend in {countdown}s</span>
              )}
            </p>

            {/* Back Button */}
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Email
            </Button>
          </div>
        </form>
      </Form>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-3 h-3 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-blue-700 text-sm">
            <p className="font-medium mb-1">Can't find the email?</p>
            <ul className="space-y-1 text-blue-600">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• The code expires in 10 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
