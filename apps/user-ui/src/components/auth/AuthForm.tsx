'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../hooks/useAuth';
import { toast } from '../../lib/toast';

import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '../../lib/validations/auth';
import { AuthMode } from '../../types/auth';
import { Checkbox } from '../ui/checkbox';
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
import { SocialAuthSection } from './SocialAuthSection';

export interface AuthFormProps {
  mode: AuthMode;
  onSubmit?: (data: any) => Promise<void>;
}

/**
 * Advanced AuthForm component with React Hook Form and Zod validation
 * Supports both login and signup modes with conditional field rendering
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit: externalOnSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine schema and default values based on mode
  const isSignupMode = mode === 'signup';

  // Import login mutation for login mode
  const loginMutation = useLoginMutation();

  // Get loading state from mutations
  const isLoginLoading = loginMutation.isPending;

  const form = useForm({
    resolver: zodResolver(isSignupMode ? signupSchema : loginSchema),
    defaultValues: isSignupMode
      ? { name: '', email: '', password: '', confirmPassword: '' }
      : { email: '', password: '', rememberMe: false },
    mode: 'onChange', // Enable real-time validation
  });

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      // Use external onSubmit if provided, otherwise use default logic
      if (externalOnSubmit) {
        await externalOnSubmit(data);
      } else {
        // Default submission logic
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (mode === 'login') {
          const loginData = data as LoginFormData;
          const result = await loginMutation.mutateAsync({
            email: loginData.email,
            password: loginData.password,
            rememberMe: loginData.rememberMe,
          });

          // Debug: Log the complete response
          console.log('Complete login response:', result);

          // Store tokens in localStorage if they exist
          if (result.accessToken) {
            localStorage.setItem('accessToken', result.accessToken);
            console.log('Access token stored in localStorage');
          } else {
            console.warn('No accessToken in response');
          }

          if (result.refreshToken) {
            localStorage.setItem('refreshToken', result.refreshToken);
            console.log('Refresh token stored in localStorage');
          } else {
            console.warn('No refreshToken in response');
          }

          console.log('Login successful:', result.message);
          toast.success('Login successful!', {
            description: 'Welcome back! Redirecting to your dashboard...',
          });
        } else {
          const signupData = data as SignupFormData;
          // Simulate different responses based on email
          if (signupData.email === 'test@example.com') {
            throw new Error('User already exists with this email');
          }

          console.log('Signup data:', {
            name: signupData.name,
            email: signupData.email,
            // Don't log password in production
          });

          toast.success('Account created successfully!', {
            description: 'Please check your email for verification.',
          });
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${mode}. Please try again.`;

      // Set form-level error
      form.setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Authentication Section */}
      <SocialAuthSection mode={mode} />

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Root Error Display */}
          {form.formState.errors.root && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Name Field (Signup only) */}
          {isSignupMode && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Enter your full name"
                        className="pl-10 h-12 rounded-full border-2 transition-all duration-200 border-gray-200 focus:border-brand-primary"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 h-12 rounded-full border-2 transition-all duration-200 ${
                        mode === 'login'
                          ? 'border-gray-200 focus:border-brand-secondary'
                          : 'border-gray-200 focus:border-brand-primary'
                      }`}
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={
                        isSignupMode
                          ? 'Create a password'
                          : 'Enter your password'
                      }
                      className={`pl-10 pr-10 h-12 rounded-full border-2 transition-all duration-200 ${
                        mode === 'login'
                          ? 'border-gray-200 focus:border-brand-secondary'
                          : 'border-gray-200 focus:border-brand-primary'
                      }`}
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field (Signup only) */}
          {isSignupMode && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-12 rounded-full border-2 transition-all duration-200 border-gray-200 focus:border-brand-primary"
                        disabled={isLoading}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Forgot Password Link (Login only) */}
          {!isSignupMode && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-brand-secondary hover:text-brand-secondary/80 hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {/* Remember Me Checkbox (Login only) */}
          {!isSignupMode && (
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-brand-secondary data-[state=checked]:border-brand-secondary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                      Remember Me
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )}

          <LoadingButton
            type="submit"
            isLoading={isLoading || (mode === 'login' && isLoginLoading)}
            className="w-full h-12 rounded-full text-base"
          >
            {isSignupMode ? 'Create Account' : 'Sign In'}
          </LoadingButton>

          {/* Alternative Action Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              {isSignupMode
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Link
                href={isSignupMode ? '/login' : '/signup'}
                className={`font-medium hover:underline transition-colors ${
                  mode === 'login'
                    ? 'text-brand-secondary hover:text-brand-secondary/80'
                    : 'text-brand-primary hover:text-brand-primary/80'
                }`}
              >
                {isSignupMode ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};
