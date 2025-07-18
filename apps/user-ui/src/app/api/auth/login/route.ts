'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';
import { LoginRequest } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Call backend auth service
    const result = await serverAuthAPI.login(body);

    // Create response with cookies if tokens are present
    const response = NextResponse.json(result, { status: 200 });

    // Set HTTP-only cookies for tokens if they exist
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

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error);

    // Extract status code and message from error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
