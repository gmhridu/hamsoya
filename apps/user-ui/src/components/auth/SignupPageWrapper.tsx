'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { useRedirectIfAuthenticated } from '../../hooks/useAuthState';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

/**
 * Client-side wrapper for signup page with route protection
 * Redirects authenticated users away from signup page
 */
export const SignupPageWrapper = () => {
  const { isLoading } = useRedirectIfAuthenticated('/');

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary/90 to-brand-accent relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary/90 to-brand-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 mb-8 group shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Link>

            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-sora">
              Join Hamsoya
            </h1>
            <p className="text-white/80 font-urbanist">
              Create your account to access premium natural products
            </p>
          </div>

          {/* Signup Form Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Create Account
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your details to get started with Hamsoya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupFlow />
            </CardContent>
          </Card>

          {/* Additional Features */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span>Email Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span>Premium Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
