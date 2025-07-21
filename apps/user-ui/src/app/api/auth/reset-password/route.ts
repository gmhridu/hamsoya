'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.otp || !body.newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, OTP, and new password are required',
        },
        { status: 400 }
      );
    }

    // Call backend auth service
    const result = await serverAuthAPI.resetPassword({
      email: body.email,
      otp: body.otp,
      newPassword: body.newPassword,
    });

    // Return success response
    return NextResponse.json(result, { status: 200 });
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
