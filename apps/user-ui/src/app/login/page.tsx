import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

const LoginPageWrapper = dynamicImport(
  () =>
    import('../../components/auth/LoginPageWrapper').then((mod) => ({
      default: mod.LoginPageWrapper,
    })),
  {
    loading: () => (
      <main className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary/90 to-brand-accent relative overflow-hidden flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </main>
    ),
  }
);

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In - Hamsoya',
  description:
    'Sign in to your Hamsoya account to access premium natural products and wellness solutions.',
};

/**
 * Login Page - Server Component
 * Provides SEO-optimized login page with client-side form functionality and route protection
 */
export default function LoginPage() {
  return <LoginPageWrapper />;
}
