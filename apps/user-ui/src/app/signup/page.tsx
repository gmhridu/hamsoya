import { Metadata } from 'next';
import { SignupPageWrapper } from '../../components/auth/SignupPageWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create Account - Hamsoya',
  description:
    'Join Hamsoya to access premium natural products, Ayurvedic medicines, and wellness solutions.',
};

/**
 * Signup Page - Server Component
 * Provides SEO-optimized signup page with instant authentication checks and no loading states
 * Eliminates white screen flashes by removing dynamic imports and loading states
 */
export default function SignupPage() {
  return <SignupPageWrapper />;
}
