'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.otp || !body.password || !body.name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, OTP, password, and name are required',
        },
        { status: 400 }
      );
    }

    // Call backend auth service
    const result = await serverAuthAPI.verifyOTP({
      email: body.email,
      otp: body.otp,
      password: body.password,
      name: body.name,
    });

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
  } catch (error) {
    // Extract status code and message from error
    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    const message = (error as Error).message || 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
