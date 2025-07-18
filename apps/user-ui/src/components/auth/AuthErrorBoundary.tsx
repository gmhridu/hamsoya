'use client';

import React from 'react';

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

/**
 * Error boundary specifically for authentication components
 * Prevents auth errors from crashing the entire application
 */
export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle authentication-specific errors
    this.handleAuthError(error);

    // Only log in development to avoid console spam in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Error Boundary caught an error:', error, errorInfo);
    }
  }

  private handleAuthError = (error: Error) => {
    const errorMessage = error.message.toLowerCase();

    // Handle different types of authentication errors
    if (
      errorMessage.includes('session expired') ||
      errorMessage.includes('token expired')
    ) {
      this.redirectToLogin('Your session has expired. Please login again.');
    } else if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('authentication')
    ) {
      this.redirectToLogin('Please login to continue.');
    }
  };

  private redirectToLogin = (message: string) => {
    // HTTP-only cookies will be cleared by the logout API call
    if (typeof window !== 'undefined') {
      // Show message and redirect
      console.warn(message);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  };

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Something went wrong
            </h3>
            <p className="text-gray-600">
              We encountered an error while processing your request. Please try
              again.
            </p>
            <button
              onClick={this.resetError}
              className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with AuthErrorBoundary
 */
export function withAuthErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
) {
  const WrappedComponent = (props: P) => (
    <AuthErrorBoundary fallback={fallback}>
      <Component {...props} />
    </AuthErrorBoundary>
  );

  WrappedComponent.displayName = `withAuthErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
