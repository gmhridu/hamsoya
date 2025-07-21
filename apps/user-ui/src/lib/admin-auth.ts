import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AdminSession, Role } from '../types/admin';

/**
 * Verify if the current user has admin access
 */
export async function verifyAdminAccess(request: NextRequest): Promise<{
  isAdmin: boolean;
  session: AdminSession | null;
}> {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return { isAdmin: false, session: null };
    }

    // Verify the JWT token
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload & {
      id: string;
      email: string;
      role: string;
      exp: number;
    };

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return { isAdmin: false, session: null };
    }

    // Check if user has admin role
    if (decoded.role !== Role.ADMIN) {
      return { isAdmin: false, session: null };
    }

    // Create admin session
    const session: AdminSession = {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role as Role,
      expiresAt: decoded.exp,
      permissions: decoded.permissions as string[] | undefined,
    };

    return { isAdmin: true, session };
  } catch (error) {
    // Token is invalid or expired
    return { isAdmin: false, session: null };
  }
}

/**
 * Get admin session from server component
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return null;
    }

    // Verify the JWT token
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload & {
      id: string;
      email: string;
      role: string;
      exp: number;
    };

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return null;
    }

    // Check if user has admin role
    if (decoded.role !== Role.ADMIN) {
      return null;
    }

    // Create admin session
    const session: AdminSession = {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role as Role,
      expiresAt: decoded.exp,
      permissions: decoded.permissions as string[] | undefined,
    };

    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Create audit log entry for admin actions
 */
export async function createAdminAuditLog(
  userId: string,
  action: string,
  resource: string,
  details?: Record<string, unknown>
): Promise<void> {
  // In a real implementation, this would send the audit log to a backend API
  // For now, we'll just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.info('[Admin Audit]', {
      userId,
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(
  session: AdminSession | null,
  requiredPermission: string
): boolean {
  if (!session) return false;

  // Admin role has all permissions
  if (session.role === Role.ADMIN) return true;

  // Check specific permissions
  return session.permissions?.includes(requiredPermission) || false;
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(request: NextRequest): NextResponse {
  // Redirect to admin login page
  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);

  // Add cache control headers to prevent caching
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(): NextResponse {
  return NextResponse.json(
    {
      error: 'Forbidden',
      message: 'You do not have permission to access this resource',
    },
    { status: 403 }
  );
}
