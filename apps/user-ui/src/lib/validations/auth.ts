import { z } from 'zod';

/**
 * Comprehensive Zod validation schemas for authentication forms
 * Matches existing validation logic with enhanced error messages
 */

// Base field validations
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  )
  .max(128, 'Password must be less than 128 characters');

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

/**
 * Login form validation schema with Remember Me option
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password must be less than 128 characters'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Signup form validation schema with password confirmation
 */
export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .max(128, 'Password must be less than 128 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .max(128, 'Password must be less than 128 characters'),
    token: z.string().min(1, 'Reset token is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * OTP verification form validation schema
 */
export const otpVerificationSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
  email: emailSchema, // Include email for verification context
});

/**
 * Forgot password OTP verification schema
 */
export const forgotPasswordOTPSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
  email: emailSchema,
});

/**
 * New password form validation schema for forgot password flow
 */
export const newPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .max(128, 'Password must be less than 128 characters'),
    email: emailSchema,
    otp: z
      .string()
      .min(6, 'OTP must be 6 digits')
      .max(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only numbers'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * TypeScript types inferred from Zod schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;
export type ForgotPasswordOTPFormData = z.infer<typeof forgotPasswordOTPSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

/**
 * Form validation error type
 */
export interface FormValidationError {
  field: string;
  message: string;
}

/**
 * Utility function to extract validation errors from Zod error
 */
export function extractValidationErrors(
  error: z.ZodError
): FormValidationError[] {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Utility function to validate form data and return typed result
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: FormValidationError[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: extractValidationErrors(error) };
    }
    return {
      success: false,
      errors: [{ field: 'general', message: 'Validation failed' }],
    };
  }
}
