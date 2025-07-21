import { Metadata } from 'next';
import { ForgotPasswordPageWrapper } from '../../components/auth/ForgotPasswordPageWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reset Password - Hamsoya',
  description:
    'Reset your Hamsoya account password securely. Enter your email to receive a verification code and create a new password.',
  keywords: [
    'forgot password',
    'reset password',
    'password recovery',
    'account recovery',
    'Hamsoya',
    'secure login',
  ],
  robots: {
    index: false, // Don't index password reset pages for security
    follow: false,
  },
  openGraph: {
    title: 'Reset Password - Hamsoya',
    description:
      'Reset your Hamsoya account password securely with email verification.',
    type: 'website',
    siteName: 'Hamsoya',
  },
  twitter: {
    card: 'summary',
    title: 'Reset Password - Hamsoya',
    description:
      'Reset your Hamsoya account password securely with email verification.',
  },
};

/**
 * Forgot Password Page - Server Component
 * Provides SEO-optimized forgot password page with instant authentication checks and no loading states
 * Eliminates white screen flashes by removing dynamic imports and loading states
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordPageWrapper />;
}
