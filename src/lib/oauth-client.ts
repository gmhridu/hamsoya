/**
 * Client-side OAuth utilities
 * For use in Client Components only
 */

/**
 * Handle OAuth token data from URL parameters (for cross-domain OAuth)
 * This should be called on pages that might receive OAuth redirects
 */
export async function handleOAuthTokenData(): Promise<void> {
  if (typeof window === 'undefined') {
    console.log('[OAUTH-CLIENT] Server-side execution - skipping token processing');
    return; // Server-side only
  }

  try {
    console.log('[OAUTH-CLIENT] Starting OAuth token processing...');
    console.log('[OAUTH-CLIENT] Current URL:', window.location.href);
    console.log('[OAUTH-CLIENT] URL search params:', window.location.search);

    const urlParams = new URLSearchParams(window.location.search);
    const tokenDataParam = urlParams.get('token_data');

    console.log('[OAUTH-CLIENT] Token data param exists:', !!tokenDataParam);
    console.log('[OAUTH-CLIENT] Token data param length:', tokenDataParam?.length);

    if (tokenDataParam) {
      console.log('[OAUTH-CLIENT] Processing token data from URL');

      // Decode the token data (browser-compatible base64url decoding)
      let decodedData: string;
      try {
        console.log('[OAUTH-CLIENT] Attempting to decode token data...');
        console.log('[OAUTH-CLIENT] Token data param length:', tokenDataParam.length);

        // For base64url without padding, we need to add padding back
        const paddedParam = tokenDataParam + '='.repeat((4 - tokenDataParam.length % 4) % 4);
        console.log('[OAUTH-CLIENT] Padded param length:', paddedParam.length);

        // Convert base64url to base64
        const base64Data = paddedParam.replace(/-/g, '+').replace(/_/g, '/');
        console.log('[OAUTH-CLIENT] Base64 data length:', base64Data.length);

        // Decode base64
        const binaryString = atob(base64Data);
        console.log('[OAUTH-CLIENT] Binary string length:', binaryString.length);

        // Convert binary string to UTF-8
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        decodedData = new TextDecoder('utf-8').decode(bytes);
        console.log('[OAUTH-CLIENT] Decoded data length:', decodedData.length);
        console.log('[OAUTH-CLIENT] Decoded data preview:', decodedData.substring(0, 100) + '...');
      } catch (decodeError) {
        console.error('[OAUTH-CLIENT] Primary decoding failed:', decodeError);
        console.error('[OAUTH-CLIENT] Token data param:', tokenDataParam);
        console.error('[OAUTH-CLIENT] Token data param length:', tokenDataParam.length);

        // Try alternative decoding method with manual padding calculation
        try {
          console.log('[OAUTH-CLIENT] Trying alternative decoding method...');
          // Calculate proper padding
          const remainder = tokenDataParam.length % 4;
          const paddingNeeded = remainder === 0 ? 0 : (4 - remainder);
          const paddedParam = tokenDataParam + '='.repeat(paddingNeeded);

          const base64Data = paddedParam.replace(/-/g, '+').replace(/_/g, '/');
          const binaryString = atob(base64Data);

          // Convert binary string to UTF-8
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          decodedData = new TextDecoder('utf-8').decode(bytes);
          console.log('[OAUTH-CLIENT] Alternative decoding successful');
        } catch (altDecodeError) {
          console.error('[OAUTH-CLIENT] Alternative decoding also failed:', altDecodeError);
          throw new Error(`Failed to decode OAuth token data: ${decodeError instanceof Error ? decodeError.message : decodeError}`);
        }
      }

      const tokenData = JSON.parse(decodedData);
      console.log('[OAUTH-CLIENT] Parsed token data:', {
        hasAccessToken: !!tokenData.accessToken,
        hasRefreshToken: !!tokenData.refreshToken,
        hasUser: !!tokenData.user,
        userId: tokenData.user?.id,
        timestamp: tokenData.timestamp,
      });

      // Validate timestamp (10 minutes max)
      const tokenAge = Date.now() - (tokenData.timestamp || 0);
      console.log('[OAUTH-CLIENT] Token age (ms):', tokenAge);

      if (tokenAge > 10 * 60 * 1000) {
        console.error('[OAUTH-CLIENT] Token data expired');
        return;
      }

      // Set cookies on the client side with secure settings for Vercel
      const isProduction = window.location.hostname.includes('vercel.app');
      const cookieOptions = `path=/; SameSite=Lax${isProduction ? '; Secure' : ''}`;

      console.log('[OAUTH-CLIENT] Setting access token cookie');
      document.cookie = `accessToken=${tokenData.accessToken}; ${cookieOptions}; max-age=${15 * 60}`;

      console.log('[OAUTH-CLIENT] Setting refresh token cookie');
      document.cookie = `refreshToken=${tokenData.refreshToken}; ${cookieOptions}; max-age=${30 * 24 * 60 * 60}`;

      console.log('[OAUTH-CLIENT] Setting user info cookie');
      document.cookie = `userInfo=${JSON.stringify(tokenData.user)}; ${cookieOptions}; max-age=${15 * 60}`;

      // Force cookie verification
      console.log('[OAUTH-CLIENT] Verifying cookies after setting:');
      const checkCookies = () => {
        const cookies = document.cookie.split(';').map(c => c.trim());
        console.log('[OAUTH-CLIENT] All cookies:', cookies);
        console.log('[OAUTH-CLIENT] Has accessToken:', cookies.some(c => c.startsWith('accessToken=')));
        console.log('[OAUTH-CLIENT] Has refreshToken:', cookies.some(c => c.startsWith('refreshToken=')));
        console.log('[OAUTH-CLIENT] Has userInfo:', cookies.some(c => c.startsWith('userInfo=')));
      };

      // Check immediately and after a short delay
      checkCookies();
      setTimeout(checkCookies, 100);

      console.log('[OAUTH-CLIENT] Tokens set successfully:', {
        hasAccessToken: !!tokenData.accessToken,
        hasRefreshToken: !!tokenData.refreshToken,
        userId: tokenData.user?.id,
        accessTokenLength: tokenData.accessToken?.length,
        refreshTokenLength: tokenData.refreshToken?.length,
      });

      // Verify cookies were set
      console.log('[OAUTH-CLIENT] Verifying cookies after setting:');
      console.log('[OAUTH-CLIENT] Document cookie length:', document.cookie.length);
      console.log('[OAUTH-CLIENT] Access token in document.cookie:', document.cookie.includes('accessToken'));
      console.log('[OAUTH-CLIENT] Refresh token in document.cookie:', document.cookie.includes('refreshToken'));

      // Clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token_data');
      newUrl.searchParams.delete('auth');
      newUrl.searchParams.delete('new_user');

      console.log('[OAUTH-CLIENT] Cleaning URL from:', window.location.href, 'to:', newUrl.pathname + newUrl.search);

      // Use history.replaceState to clean URL without triggering navigation
      window.history.replaceState({}, document.title, newUrl.pathname + newUrl.search);

      console.log('[OAUTH-CLIENT] URL cleaned, triggering page reload to refresh server state');
      // Force a hard refresh to ensure server-side auth state is updated
      window.location.reload();

      // Also trigger a client-side navigation to ensure React components re-render
      console.log('[OAUTH-CLIENT] Triggering client-side navigation');
      if ((window as any).next && (window as any).next.router) {
        (window as any).next.router.reload();
      }

    } else {
      console.log('[OAUTH-CLIENT] No token data found in URL parameters');
    }
  } catch (error) {
    console.error('[OAUTH-CLIENT] Failed to process token data:', error);
    console.error('[OAUTH-CLIENT] Error details:', {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
