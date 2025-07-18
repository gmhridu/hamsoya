'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.otp) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and OTP are required',
        },
        { status: 400 }
      );
    }

    // Call backend auth service
    const result = await serverAuthAPI.verifyForgotPasswordOTP({
      email: body.email,
      otp: body.otp,
    });

    // Return success response
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Verify Forgot Password OTP API Error:', error);

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
