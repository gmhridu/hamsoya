import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { AdminCustomer, AdminCustomerQueryParams, PaginatedResponse } from '@/types/admin';

const DEFAULT_CUSTOMERS: AdminCustomer[] = [];

function buildQueryString(params: AdminCustomerQueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

function sanitizeCustomer(customer: any): AdminCustomer {
  return {
    id: String(customer.id || ''),
    name: String(customer.name || ''),
    email: String(customer.email || ''),
    phone_number: customer.phone_number || undefined,
    profile_image_url: customer.profile_image_url || undefined,
    role: customer.role || 'USER',
    is_verified: Boolean(customer.is_verified),
    created_at: String(customer.created_at || new Date().toISOString()),
    updated_at: customer.updated_at || undefined,
    deleted_at: customer.deleted_at || undefined,
    total_orders: Number(customer.total_orders) || 0,
    total_spent: Number(customer.total_spent) || 0,
    last_order_date: customer.last_order_date || undefined,
    days_since_registration: Number(customer.days_since_registration) || 0,
  };
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'Admin access required',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryParams: AdminCustomerQueryParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20,
      search: searchParams.get('search') || undefined,
      role: searchParams.get('role') || undefined,
      verified: searchParams.get('verified') ? searchParams.get('verified') === 'true' : undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    try {
      const queryString = buildQueryString(queryParams);
      const backendUrl = `${API_CONFIG.backend.base}/admin/customers${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data: PaginatedResponse<AdminCustomer> = await response.json();

        const sanitizedCustomers = Array.isArray(data.data)
          ? data.data.map(sanitizeCustomer)
          : [];

        const sanitizedPagination = {
          page: Number(data.pagination?.page) || 1,
          limit: Number(data.pagination?.limit) || 20,
          total: Number(data.pagination?.total) || 0,
          totalPages: Number(data.pagination?.totalPages) || 0,
          hasNext: Boolean(data.pagination?.hasNext),
          hasPrev: Boolean(data.pagination?.hasPrev),
        };

        return NextResponse.json({
          success: true,
          data: sanitizedCustomers,
          pagination: sanitizedPagination,
          message: data.message || 'Customers retrieved successfully',
          timestamp: new Date().toISOString(),
        });
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
            message: 'Admin access required',
          },
          { status: response.status }
        );
      }

      console.warn(`Backend customers API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      console.warn('Backend customers API unavailable, using fallback data:', backendError);
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_CUSTOMERS,
      pagination: {
        page: queryParams.page || 1,
        limit: queryParams.limit || 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      message: 'Customers retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Customers API error:', error);

    return NextResponse.json({
      success: false,
      data: DEFAULT_CUSTOMERS,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      error: 'Internal server error',
      message: 'Failed to retrieve customers, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
