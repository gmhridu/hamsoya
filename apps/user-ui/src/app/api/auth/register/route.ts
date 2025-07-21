'use server';

import { NextRequest, NextResponse } from 'next/server';
import { serverAuthAPI } from '../../../../lib/server-auth-api';
import { SignupRequest } from '../../../../types/auth';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SignupRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, email, and password are required',
        },
        { status: 400 }
      );
    }

    // Call backend auth service (maps to /user-registration)
    const result = await serverAuthAPI.signup(body);

    // Return success response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Extract status code and message from error
    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    const message = (error as Error).message || 'Registration failed';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}
