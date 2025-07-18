// Authentication related types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
  password: string;
  name: string;
}

export interface OTPResendRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  isSubmitting: boolean;
}

// Social Authentication Types
export type SocialProvider = 'google' | 'facebook';

export type AuthMode = 'login' | 'signup';

export interface SocialAuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  provider: SocialProvider;
}

export interface SocialAuthRequest {
  provider: SocialProvider;
  mode: AuthMode;
  redirectUrl?: string;
}

export interface SocialAuthHandler {
  (provider: SocialProvider): Promise<SocialAuthResponse>;
}

export interface SocialAuthState {
  isLoading: boolean;
  loadingProvider: SocialProvider | null;
  error: string | null;
}

export interface SocialAuthConfig {
  google: {
    clientId: string;
    redirectUri: string;
    scope: string[];
  };
  facebook: {
    appId: string;
    redirectUri: string;
    scope: string[];
  };
}

/**
 * Social authentication error types
 */
export enum SocialAuthError {
  POPUP_BLOCKED = 'popup_blocked',
  CANCELLED = 'cancelled',
  NETWORK_ERROR = 'network_error',
  INVALID_RESPONSE = 'invalid_response',
  PROVIDER_ERROR = 'provider_error',
  UNKNOWN_ERROR = 'unknown_error',
}

export interface SocialAuthErrorDetails {
  code: SocialAuthError;
  message: string;
  provider: SocialProvider;
  details?: any;
}

// OTP Verification Types
export interface OTPVerificationState {
  isVisible: boolean;
  isLoading: boolean;
  isResending: boolean;
  countdown: number;
  email: string;
  error: string | null;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
  countdown: number;
}
