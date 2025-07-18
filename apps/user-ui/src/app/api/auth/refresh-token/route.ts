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
    // Forward the cookies to the backend
    const result = await serverAuthAPI.refreshToken(cookieHeader);

    // Create response - the backend already sets the new access_token cookie
    // We just need to forward the success response
    const response = NextResponse.json(result, { status: 200 });

    return response;
  } catch (error: any) {
    console.error('Refresh Token API Error:', error);

    // Extract status code and message from error
    const statusCode = error.statusCode || 401;
    const message = error.message || 'Token refresh failed';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
