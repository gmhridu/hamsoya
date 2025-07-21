'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { withAuthPageGuard } from './AuthRouteGuard';
import { ForgotPasswordFlow } from './ForgotPasswordFlow';

/**
 * Optimized forgot password page component with instant authentication checks
 * Uses route guard to prevent authenticated users from accessing forgot password page
 * Eliminates white screen flashes and unnecessary loading states
 */
const ForgotPasswordPageContent = () => {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-secondary relative overflow-hidden"
      style={{ viewTransitionName: 'auth-main' }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Auth Card */}
          <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email address and we&apos;ll send you a link to reset
                your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordFlow />
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-white font-medium hover:text-white/80 transition-colors underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

// Export the component wrapped with auth page guard
export const ForgotPasswordPageWrapper = withAuthPageGuard(
  ForgotPasswordPageContent
);

export default ForgotPasswordPageWrapper;
