'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../../lib/validations/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { LoadingButton } from '../ui/loading';

export interface EmailInputFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Email Input Form Component for Forgot Password Flow
 * Professional email input with React Hook Form and Zod validation
 */
export const EmailInputForm: React.FC<EmailInputFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch {
      // Error handling is managed by parent component
    }
  };

  return (
    <div className="space-y-6">
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
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 h-12 border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-sm" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || !form.formState.isValid}
            className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Sending Code...'
            ) : (
              <div className="flex items-center justify-center gap-2">
                Send Verification Code
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </LoadingButton>

          {/* Back to Login */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-brand-primary hover:text-brand-primary/80 font-medium hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
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
            <p className="font-medium mb-1">What happens next?</p>
            <ul className="space-y-1 text-blue-600">
              <li>
                • We&apos;ll send a 6-digit verification code to your email
              </li>
              <li>• Enter the code to verify your identity</li>
              <li>• Create a new secure password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
