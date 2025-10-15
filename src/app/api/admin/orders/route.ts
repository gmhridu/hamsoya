import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { AdminOrder, AdminOrderQueryParams, PaginatedResponse } from '@/types/admin';

const DEFAULT_ORDERS: AdminOrder[] = [];

function buildQueryString(params: AdminOrderQueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

function sanitizeOrder(order: any): AdminOrder {
  return {
    id: String(order.id || ''),
    order_number: String(order.order_number || ''),
    user_id: String(order.user_id || ''),
    customer: {
      id: String(order.customer?.id || order.user_id || ''),
      name: String(order.customer?.name || ''),
      email: String(order.customer?.email || ''),
      phone_number: order.customer?.phone_number || undefined,
    },
    items: Array.isArray(order.items) ? order.items.map((item: any) => ({
      id: String(item.id || ''),
      order_id: String(item.order_id || order.id || ''),
      product_id: String(item.product_id || ''),
      product: {
        id: String(item.product?.id || item.product_id || ''),
        name: String(item.product?.name || ''),
        images: Array.isArray(item.product?.images) ? item.product.images : [],
        slug: item.product?.slug || undefined,
      },
      quantity: Number(item.quantity) || 0,
      unit_price: Number(item.unit_price) || 0,
      total_price: Number(item.total_price) || 0,
      created_at: String(item.created_at || new Date().toISOString()),
    })) : [],
    items_count: Number(order.items_count) || 0,
    subtotal: Number(order.subtotal) || 0,
    shipping_cost: Number(order.shipping_cost) || 0,
    tax_amount: Number(order.tax_amount) || 0,
    discount_amount: Number(order.discount_amount) || 0,
    total_amount: Number(order.total_amount) || 0,
    status: order.status || 'pending',
    payment_status: order.payment_status || 'pending',
    payment_method: order.payment_method || 'cod',
    shipping_address: {
      name: String(order.shipping_address?.name || ''),
      phone: String(order.shipping_address?.phone || ''),
      address_line_1: String(order.shipping_address?.address_line_1 || ''),
      address_line_2: order.shipping_address?.address_line_2 || undefined,
      city: String(order.shipping_address?.city || ''),
      postal_code: String(order.shipping_address?.postal_code || ''),
      country: String(order.shipping_address?.country || 'Bangladesh'),
    },
    notes: order.notes || undefined,
    tracking_number: order.tracking_number || undefined,
    estimated_delivery: order.estimated_delivery || undefined,
    delivered_at: order.delivered_at || undefined,
    days_since_created: Number(order.days_since_created) || 0,
    created_at: String(order.created_at || new Date().toISOString()),
    updated_at: String(order.updated_at || new Date().toISOString()),
    deleted_at: order.deleted_at || undefined,
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
    const queryParams: AdminOrderQueryParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      payment_status: searchParams.get('payment_status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    try {
      const queryString = buildQueryString(queryParams);
      const backendUrl = `${API_CONFIG.backend.base}/admin/orders${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data: PaginatedResponse<AdminOrder> = await response.json();

        const sanitizedOrders = Array.isArray(data.data)
          ? data.data.map(sanitizeOrder)
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
          data: sanitizedOrders,
          pagination: sanitizedPagination,
          message: data.message || 'Orders retrieved successfully',
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

      console.warn(`Backend orders API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      console.warn('Backend orders API unavailable, using fallback data:', backendError);
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_ORDERS,
      pagination: {
        page: queryParams.page || 1,
        limit: queryParams.limit || 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      message: 'Orders retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Orders API error:', error);

    return NextResponse.json({
      success: false,
      data: DEFAULT_ORDERS,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      error: 'Internal server error',
      message: 'Failed to retrieve orders, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
