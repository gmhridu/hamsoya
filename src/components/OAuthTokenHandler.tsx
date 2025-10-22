'use client';

import React from 'react';
import { handleOAuthTokenData } from '@/lib/oauth-client';

/**
 * Client component to handle OAuth token data from URL parameters
 */
export function OAuthTokenHandler() {
  React.useEffect(() => {
    console.log('[OAUTH-HANDLER] Component mounted, calling handleOAuthTokenData');
    handleOAuthTokenData();
  }, []);

  return null; // This component doesn't render anything
}
