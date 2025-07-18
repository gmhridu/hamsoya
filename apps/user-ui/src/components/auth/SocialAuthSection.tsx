'use client';

import { Facebook } from 'lucide-react';
import React, { useState } from 'react';
import { AuthMode, SocialProvider } from '../../types/auth';
import { GoogleIcon } from '../icons';
import { SocialAuthButton } from '../ui/social-auth-button';

export interface SocialAuthSectionProps {
  mode: AuthMode;
}

/**
 * SocialAuthSection component that provides Google and Facebook authentication options
 * with professional styling that matches the brand design system
 */
export const SocialAuthSection: React.FC<SocialAuthSectionProps> = ({
  mode,
}) => {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );

  const handleSocialAuth = async (provider: SocialProvider): Promise<void> => {
    setLoadingProvider(provider);

    try {
      // Mock API call - replace with actual social authentication integration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(`${mode} with ${provider}:`, {
        provider,
        mode,
        timestamp: new Date().toISOString(),
      });

      // Show success message
      alert(
        `${
          provider === 'google' ? 'Google' : 'Facebook'
        } ${mode} successful! Redirecting...`
      );

      // TODO: Implement actual social authentication logic
      // - Initialize OAuth flow
      // - Handle authentication response
      // - Store tokens and user data
      // - Redirect to dashboard or appropriate page
    } catch (error) {
      console.error(`${provider} ${mode} error:`, error);
      alert(`Failed to ${mode} with ${provider}. Please try again.`);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Authentication Buttons */}
      <div className="space-y-3">
        {/* Google Authentication */}
        <SocialAuthButton
          provider="google"
          onClick={() => handleSocialAuth('google')}
          isLoading={loadingProvider === 'google'}
          disabled={loadingProvider !== null}
          icon={<GoogleIcon size={20} />}
        >
          Continue with Google
        </SocialAuthButton>

        {/* Facebook Authentication */}
        <SocialAuthButton
          provider="facebook"
          onClick={() => handleSocialAuth('facebook')}
          isLoading={loadingProvider === 'facebook'}
          disabled={loadingProvider !== null}
          icon={<Facebook className="w-5 h-5" />}
        >
          Continue with Facebook
        </SocialAuthButton>
      </div>

      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
        </div>
      </div>
    </div>
  );
};
