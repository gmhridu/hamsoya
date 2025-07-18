import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

const ForgotPasswordPageWrapper = dynamicImport(
  () =>
    import('../../components/auth/ForgotPasswordPageWrapper').then((mod) => ({
      default: mod.ForgotPasswordPageWrapper,
    })),
  {
    loading: () => (
      <main className="min-h-screen bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-secondary relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </main>
    ),
  }
);

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
 * Provides SEO-optimized forgot password page with client-side form functionality and route protection
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordPageWrapper />;
}
