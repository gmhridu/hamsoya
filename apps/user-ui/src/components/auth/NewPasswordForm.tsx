'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  newPasswordSchema,
  type NewPasswordFormData,
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
import { Input } from '../ui/input';
import { LoadingButton } from '../ui/loading';

export interface NewPasswordFormProps {
  email: string;
  otp: string;
  onSubmit: (newPassword: string) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * New Password Form Component for Forgot Password Flow
 * Professional password input with strength validation and confirmation
 */
export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  email,
  otp,
  onSubmit,
  onBack,
  isLoading = false,
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      email,
      otp,
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: NewPasswordFormData) => {
    try {
      await onSubmit(data.newPassword);
    } catch {
      // Error handling is managed by parent component
    }
  };

  const password = form.watch('newPassword');

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    return { score, checks };
  };

  const { score, checks } = getPasswordStrength(password);

  const getStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Create New Password
          </h3>
          <p className="text-gray-600 text-sm">
            Choose a strong password for your account
          </p>
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
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 text-sm" />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                            score
                          )}`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          score < 2
                            ? 'text-red-600'
                            : score < 4
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {getStrengthText(score)}
                      </span>
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div
                        className={`flex items-center gap-1 ${
                          checks.length ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            checks.length ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        8+ characters
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          checks.uppercase ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            checks.uppercase ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        Uppercase
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          checks.lowercase ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            checks.lowercase ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        Lowercase
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          checks.number ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            checks.number ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        Number
                      </div>
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
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
            disabled={isLoading || !form.formState.isValid || score < 3}
            className="w-full h-12 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Updating Password...'
            ) : (
              <div className="flex items-center justify-center gap-0.5">
                Update Password
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </LoadingButton>

          {/* Back Button */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Verification
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
