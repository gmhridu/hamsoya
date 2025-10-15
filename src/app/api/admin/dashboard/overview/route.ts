import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { AdminDashboardOverview, AdminCustomer, AdminProduct, AdminOrder, ApiResponse } from '@/types/admin';

const DEFAULT_DASHBOARD_OVERVIEW: AdminDashboardOverview = {
  recentUsers: [],
  topProducts: [],
  recentOrders: [],
};

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

function sanitizeProduct(product: any): AdminProduct {
  return {
    id: String(product.id || ''),
    name: String(product.name || ''),
    description: product.description || undefined,
    price: Number(product.price) || 0,
    original_price: product.original_price ? Number(product.original_price) : undefined,
    cost_price: product.cost_price ? Number(product.cost_price) : undefined,
    sku: product.sku || undefined,
    stock_quantity: Number(product.stock_quantity) || 0,
    low_stock_threshold: product.low_stock_threshold ? Number(product.low_stock_threshold) : undefined,
    category_id: product.category_id || undefined,
    category_name: product.category?.name || product.category_name || undefined,
    images: Array.isArray(product.images) ? product.images : [],
    featured: Boolean(product.featured),
    is_active: Boolean(product.is_active),
    in_stock: Boolean(product.in_stock),
    weight: product.weight ? Number(product.weight) : undefined,
    dimensions: product.dimensions || undefined,
    tags: Array.isArray(product.tags) ? product.tags : undefined,
    meta_title: product.meta_title || undefined,
    meta_description: product.meta_description || undefined,
    sales_count: Number(product.sales_count) || 0,
    revenue: Number(product.revenue) || 0,
    average_rating: product.average_rating ? Number(product.average_rating) : undefined,
    review_count: Number(product.review_count) || 0,
    total_revenue: Number(product.total_revenue) || 0,
    last_sold_date: product.last_sold_date || undefined,
    days_since_created: Number(product.days_since_created) || 0,
    is_low_stock: Boolean(product.is_low_stock),
    created_at: String(product.created_at || new Date().toISOString()),
    updated_at: String(product.updated_at || new Date().toISOString()),
    deleted_at: product.deleted_at || undefined,
  };
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

function sanitizeDashboardOverview(data: any): AdminDashboardOverview {
  return {
    recentUsers: Array.isArray(data.recentUsers) ? data.recentUsers.map(sanitizeCustomer) : [],
    topProducts: Array.isArray(data.topProducts) ? data.topProducts.map(sanitizeProduct) : [],
    recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders.map(sanitizeOrder) : [],
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

    try {
      const backendUrl = `${API_CONFIG.backend.base}/admin/dashboard/overview`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data: ApiResponse<AdminDashboardOverview> = await response.json();
        const sanitizedOverview = sanitizeDashboardOverview(data.data);

        return NextResponse.json({
          success: true,
          data: sanitizedOverview,
          message: data.message || 'Dashboard overview retrieved successfully',
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

      console.warn(`Backend dashboard overview API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      console.warn('Backend dashboard overview API unavailable, using fallback data:', backendError);
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_DASHBOARD_OVERVIEW,
      message: 'Dashboard overview retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Dashboard overview API error:', error);

    return NextResponse.json({
      success: false,
      data: DEFAULT_DASHBOARD_OVERVIEW,
      error: 'Internal server error',
      message: 'Failed to retrieve dashboard overview, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
