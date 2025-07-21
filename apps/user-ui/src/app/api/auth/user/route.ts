'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the request to the backend
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // Call backend auth service with cookies
    const result = await serverAuthAPI.getCurrentUser(cookieHeader);

    // Return user data
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Extract status code and message from error
    const statusCode = (error as { statusCode?: number }).statusCode || 401;
    const message = (error as Error).message || 'Authentication failed';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
