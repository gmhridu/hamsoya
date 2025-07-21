import { Metadata } from 'next';
import { LoginPageWrapper } from '../../components/auth/LoginPageWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In - Hamsoya',
  description:
    'Sign in to your Hamsoya account to access premium natural products and wellness solutions.',
};

/**
 * Login Page - Server Component
 * Provides SEO-optimized login page with instant authentication checks and no loading states
 * Eliminates white screen flashes by removing dynamic imports and loading states
 */
export default function LoginPage() {
  return <LoginPageWrapper />;
}
