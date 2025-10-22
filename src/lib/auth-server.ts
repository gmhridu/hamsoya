/**
 * Server-side authentication utilities
 * For use in Server Components, Server Actions, and API routes
 */

import type { User } from '@/types/auth';
import { AUTH_CONFIG } from '@/types/auth';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface AuthResult {
  user: User | null;
  isAuthenticated: boolean;
}

// Cache for getCurrentUser to prevent redundant calls within the same request
const authCache = new Map<string, { result: AuthResult; timestamp: number }>();
const CACHE_DURATION = AUTH_CONFIG.serverCacheDuration; // 1 minute cache for better performance

/**
 * Attempt to refresh tokens using the refresh token
 * Returns new payload if successful, null if failed
 */
async function attemptTokenRefresh(): Promise<{ success: boolean; payload?: any }> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return { success: false };
    }

    // Call the refresh endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      // Extract new tokens from response
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      // Update cookies with new tokens
      const { cookies: setCookies } = await import('next/headers');
      const cookieStore = await setCookies();

      // Set new access token
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Use 'lax' for OAuth compatibility
        maxAge: 5 * 60, // 5 minutes
        path: '/',
      });

      // Set new refresh token if provided
      if (newRefreshToken) {
        cookieStore.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Use 'lax' for OAuth compatibility
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });
      }

      // Verify and return the new access token payload
      const payload = await verifyAccessToken(newAccessToken);
      return { success: true, payload };
    }

    return { success: false };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Verify JWT access token on the server
 * Using jsonwebtoken library to match backend implementation
 */
async function verifyAccessToken(token: string): Promise<any> {
  try {
    // Check if JWT secrets are available
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    console.log('[SERVER-AUTH] Environment check:', {
      hasAccessSecret: !!accessSecret,
      hasRefreshSecret: !!refreshSecret,
      accessSecretLength: accessSecret?.length,
      refreshSecretLength: refreshSecret?.length,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!accessSecret) {
      console.error('[SERVER-AUTH] JWT_ACCESS_SECRET environment variable not found');
      console.error('[SERVER-AUTH] Available env vars:', Object.keys(process.env).filter(key => key.includes('JWT')));
      return null;
    }

    // Use jsonwebtoken.verify (same as backend)
    const payload = jwt.verify(token, accessSecret, {
      algorithms: ['HS256'],
    });

    console.log('[SERVER-AUTH] Token verified successfully:', {
      userId: (payload as any).userId,
      email: (payload as any).email,
      role: (payload as any).role,
    });

    return payload;
  } catch (error) {
    console.error('[SERVER-AUTH] Token verification failed:', {
      error: error instanceof Error ? error.message : error,
      tokenLength: token?.length,
      secretLength: process.env.JWT_ACCESS_SECRET?.length,
    });
    return null;
  }
}

/**
 * Verify JWT refresh token on the server
 * Using jsonwebtoken library to match backend implementation
 */
function verifyRefreshToken(token: string): any {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      console.error('JWT_REFRESH_SECRET environment variable is required');
      return null;
    }

    // Use jsonwebtoken.verify (same as backend)
    const payload = jwt.verify(token, refreshSecret, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error) {
    // More detailed error logging for debugging
    if (error instanceof Error) {
      console.error('JWT refresh token verification error:', {
        name: error.name,
        message: error.message,
        tokenLength: token?.length,
        secretExists: !!process.env.JWT_REFRESH_SECRET,
        secretLength: process.env.JWT_REFRESH_SECRET?.length,
      });
    }
    return null;
  }
}

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

/**
 * Get current user from server-side cookies
 * This runs on the server and provides instant auth state with automatic token refresh
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('[SERVER-AUTH] Checking authentication state:', {
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length,
      allCookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    });

    // Create cache key based on token
    const cacheKey = accessToken || 'no-token';
    const now = Date.now();

    // Check cache first to prevent redundant calls
    const cached = authCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }

    // If no access token, check for refresh token and attempt refresh
    if (!accessToken) {
      const refreshToken = cookieStore.get('refreshToken')?.value;
      if (refreshToken) {
        // Attempt to refresh tokens using the refresh token
        const refreshResult = await attemptTokenRefresh();
        if (refreshResult.success && refreshResult.payload) {
          // Successfully refreshed, continue with the new payload
          const user: User = {
            id: refreshResult.payload.userId as string,
            email: refreshResult.payload.email as string,
            name:
              (refreshResult.payload.name as string) || refreshResult.payload.email.split('@')[0],
            role: (refreshResult.payload.role as 'USER' | 'SELLER' | 'ADMIN') || 'USER',
            profile_image_url: (refreshResult.payload.profile_image_url as string) || undefined,
            is_verified: (refreshResult.payload.is_verified as boolean) || true,
            created_at: (refreshResult.payload.created_at as string) || new Date().toISOString(),
          };

          const result = { user, isAuthenticated: true };
          authCache.set('refreshed-token', { result, timestamp: now });
          return result;
        }
      }

      // No valid tokens found
      const result = { user: null, isAuthenticated: false };
      authCache.set(cacheKey, { result, timestamp: now });
      return result;
    }

    // Verify and decode the token
    let payload: any;
    let shouldRefresh = false;

    try {
      payload = await verifyAccessToken(accessToken);
    } catch (error) {
      // Access token is invalid/expired, try to refresh it
      shouldRefresh = true;
    }

    // If access token is invalid/expired, try to refresh it
    if (shouldRefresh || !payload) {
      const refreshResult = await attemptTokenRefresh();
      if (refreshResult.success && refreshResult.payload) {
        payload = refreshResult.payload;
      } else {
        const result = { user: null, isAuthenticated: false };
        authCache.set(cacheKey, { result, timestamp: now });
        return result;
      }
    }

    // Extract user data from token payload (matching backend JWT structure)
    const user: User = {
      id: payload.userId as string,
      email: payload.email as string,
      name: (payload.name as string) || payload.email.split('@')[0], // Fallback to email prefix if name not available
      role: (payload.role as 'USER' | 'SELLER' | 'ADMIN') || 'USER',
      profile_image_url: (payload.profile_image_url as string) || undefined,
      is_verified: (payload.is_verified as boolean) || true, // Assume verified if token exists
      created_at: (payload.created_at as string) || new Date().toISOString(),
    };

    const result = { user, isAuthenticated: true };

    // Cache the successful result
    authCache.set(cacheKey, { result, timestamp: now });

    return result;
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, isAuthenticated: false };
  }
}

/**
 * Check if user is authenticated (lightweight version)
 */
export async function isAuthenticated(): Promise<boolean> {
  const { isAuthenticated } = await getCurrentUser();
  return isAuthenticated;
}

/**
 * Require authentication - throws if not authenticated
 * Use in Server Actions or API routes
 */
export async function requireAuth(): Promise<User> {
  const { user, isAuthenticated } = await getCurrentUser();

  if (!isAuthenticated || !user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Get user with fallback to API call if token is invalid
 * Use this if you need to refresh tokens or validate against database
 * Note: This function cannot set cookies - use getCurrentUserWithRefreshAndCookies for that
 */
export async function getCurrentUserWithRefresh(): Promise<AuthResult> {
  // First try token-based auth
  const tokenResult = await getCurrentUser();

  if (tokenResult.isAuthenticated) {
    return tokenResult;
  }

  // If token auth fails, try refresh token
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return { user: null, isAuthenticated: false };
    }

    // Call your API to refresh tokens
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return { user: null, isAuthenticated: false };
    }

    const data = await response.json();

    // Extract tokens from response
    const newAccessToken = data.data?.accessToken || data.accessToken;
    const newRefreshToken = data.data?.refreshToken || data.refreshToken;
    const user = data.data?.user || data.user;

    // Set new cookies if tokens were refreshed
    if (newAccessToken && newRefreshToken) {
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === 'production';

      // Set access token (non-httpOnly for API calls)
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: 'lax', // Use 'lax' for OAuth compatibility
        maxAge: 5 * 60, // 5 minutes
        path: '/',
      });

      // Set refresh token (httpOnly for security)
      cookieStore.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax', // Use 'lax' for OAuth compatibility
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    return {
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Error refreshing user session:', error);
    return { user: null, isAuthenticated: false };
  }
}

/**
 * Server-side route protection utility
 * Use in Server Components or Server Actions to protect routes
 * WARNING: This throws errors - use protectRouteSafe for server components
 */
export async function protectRoute(): Promise<User> {
  const { user, isAuthenticated } = await getCurrentUser();

  if (!isAuthenticated || !user) {
    throw new Error('UNAUTHORIZED');
  }

  return user;
}

/**
 * Safe server-side route protection utility
 * Returns null instead of throwing errors - better for server components
 * Middleware should handle redirects, this just provides user data
 */
export async function protectRouteSafe(): Promise<User | null> {
  const { user, isAuthenticated } = await getCurrentUser();

  if (!isAuthenticated || !user) {
    return null;
  }

  return user;
}

/**
 * Server-side guest-only route protection
 * Throws error if user is authenticated (for login/register pages)
 */
export async function requireGuest(): Promise<void> {
  const { isAuthenticated } = await getCurrentUser();

  if (isAuthenticated) {
    throw new Error('ALREADY_AUTHENTICATED');
  }
}

/**
 * Role-based access control for server components
 */
export async function requireRole(allowedRoles: Array<'USER' | 'SELLER' | 'ADMIN'>): Promise<User> {
  const user = await protectRoute();

  if (!allowedRoles.includes(user.role)) {
    throw new Error('INSUFFICIENT_PERMISSIONS');
  }

  return user;
}

/**
 * Admin-only access control
 * WARNING: This throws errors - use requireAdminSafe for server components
 */
export async function requireAdmin(): Promise<User> {
  return await requireRole(['ADMIN']);
}

/**
 * Safe admin-only access control
 * Returns null instead of throwing errors - better for server components
 */
export async function requireAdminSafe(): Promise<User | null> {
  const user = await protectRouteSafe();

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return user;
}

/**
 * Seller or Admin access control
 */
export async function requireSeller(): Promise<User> {
  return await requireRole(['SELLER', 'ADMIN']);
}

/**
 * Safe seller or admin access control
 * Returns null instead of throwing errors - better for server components
 */
export async function requireSellerSafe(): Promise<User | null> {
  const user = await protectRouteSafe();

  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return null;
  }

  return user;
}

/**
 * Get user data for server components with optional fallback
 */
export async function getServerUser(): Promise<User | null> {
  const { user } = await getCurrentUser();
  return user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: 'USER' | 'SELLER' | 'ADMIN'): Promise<boolean> {
  const user = await getServerUser();
  return user?.role === role || false;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('ADMIN');
}

/**
 * Check if user is seller or admin
 */
export async function isSeller(): Promise<boolean> {
  const user = await getServerUser();
  return user?.role === 'SELLER' || user?.role === 'ADMIN' || false;
}
