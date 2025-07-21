'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';

export async function POST(request: NextRequest) {
  try {
    // Forward cookies from the request to the backend
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token required',
        },
        { status: 401 }
      );
    }

    // Call backend auth service to refresh token
    const result = await serverAuthAPI.refreshToken(cookieHeader);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Token refresh failed',
        },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json(result, { status: 200 });

    // Forward cookies from backend response if they exist
    if (result.cookies && result.cookies.length > 0) {
      result.cookies.forEach((cookie: string) => {
        // Parse cookie string to extract name and value
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');

        if (name && value) {
          // Set the cookie with appropriate options for frontend
          response.cookies.set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: name.trim() === 'access_token' ? 15 * 60 : 7 * 24 * 60 * 60,
            path: '/',
          });
        }
      });
    } else {
      // Fallback: Set cookies from response data if backend cookies are not available
      if (result.accessToken) {
        response.cookies.set('access_token', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60, // 15 minutes
          path: '/',
        });
      }

      if (result.refreshToken) {
        response.cookies.set('refresh_token', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });
      }
    }

    return response;
  } catch (error) {
    // Extract status code and message from error
    const statusCode = (error as { statusCode?: number }).statusCode || 401;
    const message = (error as Error).message || 'Token refresh failed';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
