import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Next.js Middleware for Authentication
 * 
 * This middleware runs at the edge and provides:
 * - Instant authentication checks without client-side loading
 * - Automatic redirects for authenticated users accessing auth pages
 * - Token validation and refresh handling
 * - Performance optimization by handling auth at the edge
 */

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Define routes that should redirect authenticated users (auth pages)
const authRoutes = ['/login', '/signup', '/forgot-password'];

// Define public routes that don't require any auth checks
const publicRoutes = ['/', '/about', '/contact', '/products'];

/**
 * Check if user is authenticated by validating JWT token
 */
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return false;
    }

    // Verify the JWT token
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string; role: string; exp: number };

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    // Token is invalid or expired
    return false;
  }
}

/**
 * Attempt to refresh the access token using refresh token
 */
async function tryRefreshToken(request: NextRequest): Promise<string | null> {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;
    
    if (!refreshToken) {
      return null;
    }

    // Call the refresh token API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check authentication status
  const authenticated = await isAuthenticated(request);
  
  // Handle auth routes (login, signup, forgot-password)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (authenticated) {
      // Redirect authenticated users away from auth pages
      const redirectUrl = new URL('/', request.url);
      const response = NextResponse.redirect(redirectUrl);
      
      // Add cache headers to prevent caching of redirects
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
      return response;
    }
    
    // Allow unauthenticated users to access auth pages
    return NextResponse.next();
  }

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!authenticated) {
      // Try to refresh token first
      const newAccessToken = await tryRefreshToken(request);
      
      if (newAccessToken) {
        // Token refreshed successfully, set new cookie and continue
        const response = NextResponse.next();
        response.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60, // 15 minutes
          path: '/',
        });
        return response;
      }
      
      // Redirect unauthenticated users to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      const response = NextResponse.redirect(loginUrl);
      
      // Clear invalid tokens
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      
      return response;
    }
    
    // Allow authenticated users to access protected routes
    return NextResponse.next();
  }

  // Handle public routes - no authentication required
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For any other routes, allow access but try to refresh token if needed
  if (authenticated) {
    return NextResponse.next();
  } else {
    // Try to refresh token for better UX
    const newAccessToken = await tryRefreshToken(request);
    
    if (newAccessToken) {
      const response = NextResponse.next();
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
