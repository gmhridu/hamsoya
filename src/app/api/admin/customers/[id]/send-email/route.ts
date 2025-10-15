import { NextRequest, NextResponse } from 'next/server';

// POST /api/admin/customers/[id]/send-email - Send email to customer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'Admin access required'
        },
        { status: 401 }
      );
    }

    const { id: customerId } = await params;
    const emailData = await request.json();

    if (!customerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid customer ID',
          message: 'Customer ID is required'
        },
        { status: 400 }
      );
    }

    if (!emailData.subject || !emailData.message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email data',
          message: 'Subject and message are required'
        },
        { status: 400 }
      );
    }

    try {
      // For now, we'll return success since we're using mailto links
      // In the future, this could integrate with a backend email service
      return NextResponse.json({
        success: true,
        message: 'Email functionality is handled client-side via mailto links',
        timestamp: new Date().toISOString(),
      });

    } catch (fetchError) {
      console.error('Email send error:', fetchError);

      return NextResponse.json(
        {
          success: false,
          error: 'Email service unavailable',
          message: 'Unable to send email. Please try using your email client directly.'
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Send email API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send email',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
