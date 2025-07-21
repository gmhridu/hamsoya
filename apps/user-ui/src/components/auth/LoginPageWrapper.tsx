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
import { AuthForm } from './AuthForm';
import { withEnhancedAuthPageGuard } from './EnhancedAuthRouteGuard';

/**
 * Optimized login page component with instant authentication checks
 * Uses route guard to prevent authenticated users from accessing login page
 * Eliminates white screen flashes and unnecessary loading states
 */
const LoginPageContent = () => {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary/90 to-brand-accent relative overflow-hidden"
      style={{ viewTransitionName: 'auth-main' }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 70%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          viewTransitionName: 'auth-background',
        }}
      />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
        style={{ viewTransitionName: 'auth-content' }}
      >
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
              Welcome Back
            </h1>
            <p className="text-white/80 font-urbanist">
              Sign in to your Hamsoya account
            </p>
          </div>

          {/* Login Form Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm mode="login" />
            </CardContent>
          </Card>

          {/* Additional Features */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span>Premium Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Export the component wrapped with enhanced auth page guard
export const LoginPageWrapper = withEnhancedAuthPageGuard(
  LoginPageContent,
  'login'
);
