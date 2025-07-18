'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, password, name } = body;

    if (!email || !otp || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, OTP, password, and name are required',
        },
        { status: 400 }
      );
    }

    // Call backend auth service (maps to /verify-user)
    const result = await serverAuthAPI.verifyOTP({
      email,
      otp,
      password,
      name,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Verify User API Error:', error);

    // Extract status code and message from error
    const statusCode = error.statusCode || 400;
    const message = error.message || 'OTP verification failed';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
