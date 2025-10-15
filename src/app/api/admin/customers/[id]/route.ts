import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { AdminCustomer } from '@/types/admin';

// Helper function to sanitize customer data
function sanitizeCustomer(customer: any): AdminCustomer {
  return {
    id: String(customer.id || ''),
    name: String(customer.name || ''),
    email: String(customer.email || ''),
    phone_number: customer.phone_number ? String(customer.phone_number) : undefined,
    profile_image_url: customer.profile_image_url ? String(customer.profile_image_url) : undefined,
    role: customer.role || 'USER',
    is_verified: Boolean(customer.is_verified),
    created_at: String(customer.created_at || new Date().toISOString()),
    updated_at: customer.updated_at ? String(customer.updated_at) : undefined,
    deleted_at: customer.deleted_at ? String(customer.deleted_at) : undefined,
    total_orders: customer.total_orders ? Number(customer.total_orders) : undefined,
    total_spent: customer.total_spent ? Number(customer.total_spent) : undefined,
    last_order_date: customer.last_order_date ? String(customer.last_order_date) : undefined,
    days_since_registration: customer.days_since_registration ? Number(customer.days_since_registration) : undefined,
  };
}

// GET /api/admin/customers/[id]
export async function GET(
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

    try {
      // Call backend API
      const backendUrl = API_CONFIG.backend.admin.customers.byId(customerId);

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Validate and sanitize the response data
        const sanitizedCustomer = sanitizeCustomer(data.data || data);

        return NextResponse.json({
          success: true,
          data: sanitizedCustomer,
          message: data.message || 'Customer retrieved successfully',
          timestamp: new Date().toISOString(),
        });
      }

      // Handle backend errors
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'Customer not found',
            message: 'The requested customer does not exist'
          },
          { status: 404 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: 'Access denied',
            message: 'Insufficient permissions to access customer data'
          },
          { status: 403 }
        );
      }

      // Other backend errors
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Backend error',
          message: errorData.message || 'Failed to retrieve customer from backend'
        },
        { status: response.status }
      );

    } catch (fetchError) {
      console.error('Backend fetch error:', fetchError);

      // Return fallback empty customer data when backend is unavailable
      return NextResponse.json(
        {
          success: false,
          error: 'Backend unavailable',
          message: 'Unable to retrieve customer data. Backend service is currently unavailable.',
          data: null
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Customer details API error:', error);

    // Return graceful error
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve customer details',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// PUT /api/admin/customers/[id] - Update customer
export async function PUT(
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
    const updateData = await request.json();

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

    try {
      // Call backend API
      const backendUrl = API_CONFIG.backend.admin.customers.update(customerId);

      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();

        // Validate and sanitize the response data
        const sanitizedCustomer = sanitizeCustomer(data.data || data);

        return NextResponse.json({
          success: true,
          data: sanitizedCustomer,
          message: data.message || 'Customer updated successfully',
          timestamp: new Date().toISOString(),
        });
      }

      // Handle backend errors
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Backend error',
          message: errorData.message || 'Failed to update customer'
        },
        { status: response.status }
      );

    } catch (fetchError) {
      console.error('Backend fetch error:', fetchError);

      return NextResponse.json(
        {
          success: false,
          error: 'Backend unavailable',
          message: 'Unable to update customer. Backend service is currently unavailable.'
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Customer update API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update customer',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// DELETE /api/admin/customers/[id] - Delete customer
export async function DELETE(
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

    try {
      // Call backend API
      const backendUrl = API_CONFIG.backend.admin.customers.delete(customerId);

      const response = await fetch(backendUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));

        return NextResponse.json({
          success: true,
          message: data.message || 'Customer deleted successfully',
          timestamp: new Date().toISOString(),
        });
      }

      // Handle backend errors
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Backend error',
          message: errorData.message || 'Failed to delete customer'
        },
        { status: response.status }
      );

    } catch (fetchError) {
      console.error('Backend fetch error:', fetchError);

      return NextResponse.json(
        {
          success: false,
          error: 'Backend unavailable',
          message: 'Unable to delete customer. Backend service is currently unavailable.'
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Customer delete API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete customer',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
