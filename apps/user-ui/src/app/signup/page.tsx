import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

const SignupPageWrapper = dynamicImport(
  () =>
    import('../../components/auth/SignupPageWrapper').then((mod) => ({
      default: mod.SignupPageWrapper,
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
  title: 'Create Account - Hamsoya',
  description:
    'Join Hamsoya to access premium natural products, Ayurvedic medicines, and wellness solutions.',
};

/**
 * Signup Page - Server Component
 * Provides SEO-optimized signup page with client-side form functionality and route protection
 */
export default function SignupPage() {
  return <SignupPageWrapper />;
}
