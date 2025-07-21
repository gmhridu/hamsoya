'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '../../lib/toast';
import { useLoginMutation } from '../../store/authApi';
import type { LoginRequest, SignupRequest } from '../../types/auth';

import { useRouter } from 'next/navigation';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '../../lib/validations/auth';
import { useAppSelector } from '../../store';
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
  onSubmit?: (data: LoginRequest | SignupRequest) => Promise<void>;
}

/**
 * Advanced AuthForm component with React Hook Form and Zod validation
 * Supports both login and signup modes with conditional field rendering
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit: externalOnSubmit,
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigateAfterLogin, setShouldNavigateAfterLogin] =
    useState(false);

  // Get authentication state from Redux
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Determine schema and default values based on mode
  const isSignupMode = mode === 'signup';

  // Import login mutation for login mode with proper RTK Query syntax
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  // Handle navigation after successful login with skeleton loading
  useEffect(() => {
    if (shouldNavigateAfterLogin && isAuthenticated && user) {
      // Reset the navigation flag
      setShouldNavigateAfterLogin(false);

      // Navigate to home page with smooth transition and ViewTransition API
      if ('startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          router.replace('/');
        });
      } else {
        router.replace('/');
      }
    }
  }, [shouldNavigateAfterLogin, isAuthenticated, user, router]);

  const form = useForm({
    resolver: zodResolver(isSignupMode ? signupSchema : loginSchema),
    defaultValues: isSignupMode
      ? { name: '', email: '', password: '', confirmPassword: '' }
      : { email: '', password: '', rememberMe: false },
    mode: 'onChange', // Enable real-time validation
  });

  const handleSubmit = async (data: LoginFormData | SignupFormData) => {
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

          try {
            // Use RTK Query mutation with comprehensive error handling
            const loginResult = loginMutation({
              email: loginData.email,
              password: loginData.password,
              rememberMe: loginData.rememberMe,
            });

            // Check if mutation was triggered successfully
            if (!loginResult || typeof loginResult.unwrap !== 'function') {
              throw new Error('Login request failed to initialize');
            }

            await loginResult.unwrap();

            // Show success message
            toast.success('Login successful!', {
              description: 'Welcome back! Redirecting to your dashboard...',
            });

            // Set flag to trigger navigation after Redux state updates
            setShouldNavigateAfterLogin(true);
          } catch (loginError) {
            // Handle specific login errors
            const errorMessage =
              (loginError as { data?: { message?: string }; message?: string })
                ?.data?.message ||
              (loginError as Error)?.message ||
              'Login failed. Please check your credentials and try again.';

            toast.error('Login Failed', {
              description: errorMessage,
            });

            // Set form error for user feedback
            form.setError('root', {
              type: 'manual',
              message: errorMessage,
            });

            throw loginError; // Re-throw to be caught by outer try-catch
          }
        } else {
          const signupData = data as SignupFormData;
          // Simulate different responses based on email
          if (signupData.email === 'test@example.com') {
            throw new Error('User already exists with this email');
          }

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
