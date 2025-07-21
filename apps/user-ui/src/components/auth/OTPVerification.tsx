'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  otpVerificationSchema,
  type OTPVerificationFormData,
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

export interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Modern OTP Verification Component
 * Professional OTP input with countdown timer, resend functionality, and brand styling
 */
export const OTPVerification: React.FC<OTPVerificationProps> = ({
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

  const form = useForm<OTPVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
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

  const handleSubmit = async (data: OTPVerificationFormData) => {
    try {
      await onVerify(data.otp);
    } catch {
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
    } catch {
      // Error handling is managed by parent component
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Mail className="w-10 h-10 text-brand-primary" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <div className="space-y-2 max-w-sm mx-auto">
            <p className="text-gray-600 text-base">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="text-brand-primary font-semibold text-lg break-all">
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* OTP Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Error Display */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
              {error}
            </div>
          )}

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
                <FormMessage className="text-center text-sm" />
              </FormItem>
            )}
          />

          {/* Resend Section */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?
            </p>

            {canResend ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={isResending}
                className="text-brand-primary hover:text-brand-primary/80 hover:bg-brand-primary/5 font-medium"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Code'
                )}
              </Button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in {formatTime(countdown)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-2">
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={form.watch('otp').length !== 6}
              className="w-full h-14 text-lg"
            >
              Verify & Continue
            </LoadingButton>

            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isLoading}
              className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 rounded-xl font-medium transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
