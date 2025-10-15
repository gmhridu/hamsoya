'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: React.ErrorInfo;
}

class AdminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Show error toast
    toast.error('Something went wrong', {
      description: 'An unexpected error occurred in the admin dashboard.',
      action: {
        label: 'Reload',
        onClick: () => window.location.reload(),
      },
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={this.resetError}
          errorInfo={this.state.errorInfo || undefined}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError, errorInfo }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            An unexpected error occurred in the admin dashboard. Please try refreshing the page or contact support if the problem persists.
          </p>

          {isDevelopment && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-xs font-mono text-destructive break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="mt-2 text-xs font-mono text-muted-foreground overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={resetError} variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.location.href = '/admin'} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Lightweight error fallback for smaller components
export function ComponentErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Component Error</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        This component failed to load. {error.message}
      </p>
      <Button onClick={resetError} size="sm" variant="outline">
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    </div>
  );
}

// Hook for handling async errors
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    
    toast.error('Operation failed', {
      description: error.message || 'An unexpected error occurred.',
      action: {
        label: 'Dismiss',
        onClick: () => {},
      },
    });
  };

  const handleAsyncError = async <T,>(
    asyncFn: () => Promise<T>,
    context?: string,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return fallbackValue;
    }
  };

  return {
    handleError,
    handleAsyncError,
  };
}

// Network error handler
export function handleNetworkError(error: any, context?: string) {
  let message = 'Network error occurred';
  let description = 'Please check your internet connection and try again.';

  if (error?.status === 401) {
    message = 'Authentication required';
    description = 'Please log in to continue.';
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
    }, 2000);
  } else if (error?.status === 403) {
    message = 'Access denied';
    description = 'You do not have permission to perform this action.';
  } else if (error?.status === 404) {
    message = 'Resource not found';
    description = 'The requested resource could not be found.';
  } else if (error?.status >= 500) {
    message = 'Server error';
    description = 'A server error occurred. Please try again later.';
  }

  toast.error(message, {
    description: context ? `${description} (${context})` : description,
    action: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
  });
}

// Retry mechanism with exponential backoff
export function createRetryHandler(maxRetries: number = 3, baseDelay: number = 1000) {
  return async <T,>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          handleNetworkError(error, context);
          throw error;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.warn(`Retry attempt ${attempt + 1}/${maxRetries} for ${context || 'operation'}`);
      }
    }
    
    throw lastError!;
  };
}

export default AdminErrorBoundary;
