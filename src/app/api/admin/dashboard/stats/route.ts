import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { AdminDashboardStats, ApiResponse } from '@/types/admin';

const DEFAULT_DASHBOARD_STATS: AdminDashboardStats = {
  users: {
    total_users: 0,
    verified_users: 0,
    unverified_users: 0,
    users_this_month: 0,
    users_growth_rate: 0,
  },
  products: {
    total_products: 0,
    active_products: 0,
    inactive_products: 0,
    featured_products: 0,
    out_of_stock_products: 0,
    low_stock_products: 0,
    products_this_month: 0,
    products_growth_rate: 0,
    average_product_price: 0,
  },
  categories: {
    total_categories: 0,
    active_categories: 0,
    inactive_categories: 0,
    categories_this_month: 0,
    categories_growth_rate: 0,
    average_products_per_category: 0,
  },
  orders: {
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    processing_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_revenue: 0,
    average_order_value: 0,
    orders_this_month: 0,
    orders_growth_rate: 0,
    revenue_this_month: 0,
    revenue_growth_rate: 0,
  },
  overview: {
    total_revenue: 0,
    total_orders: 0,
    total_customers: 0,
    total_products: 0,
    revenue_growth: 0,
    order_growth: 0,
    customer_growth: 0,
    product_growth: 0,
  },
};

function sanitizeDashboardStats(data: any): AdminDashboardStats {
  return {
    users: {
      total_users: Number(data.users?.total_users) || 0,
      verified_users: Number(data.users?.verified_users) || 0,
      unverified_users: Number(data.users?.unverified_users) || 0,
      users_this_month: Number(data.users?.users_this_month) || 0,
      users_growth_rate: Number(data.users?.users_growth_rate) || 0,
    },
    products: {
      total_products: Number(data.products?.total_products) || 0,
      active_products: Number(data.products?.active_products) || 0,
      inactive_products: Number(data.products?.inactive_products) || 0,
      featured_products: Number(data.products?.featured_products) || 0,
      out_of_stock_products: Number(data.products?.out_of_stock_products) || 0,
      low_stock_products: Number(data.products?.low_stock_products) || 0,
      products_this_month: Number(data.products?.products_this_month) || 0,
      products_growth_rate: Number(data.products?.products_growth_rate) || 0,
      average_product_price: Number(data.products?.average_product_price) || 0,
    },
    categories: {
      total_categories: Number(data.categories?.total_categories) || 0,
      active_categories: Number(data.categories?.active_categories) || 0,
      inactive_categories: Number(data.categories?.inactive_categories) || 0,
      categories_this_month: Number(data.categories?.categories_this_month) || 0,
      categories_growth_rate: Number(data.categories?.categories_growth_rate) || 0,
      average_products_per_category: Number(data.categories?.average_products_per_category) || 0,
    },
    orders: {
      total_orders: Number(data.orders?.total_orders) || 0,
      pending_orders: Number(data.orders?.pending_orders) || 0,
      confirmed_orders: Number(data.orders?.confirmed_orders) || 0,
      processing_orders: Number(data.orders?.processing_orders) || 0,
      shipped_orders: Number(data.orders?.shipped_orders) || 0,
      delivered_orders: Number(data.orders?.delivered_orders) || 0,
      cancelled_orders: Number(data.orders?.cancelled_orders) || 0,
      total_revenue: Number(data.orders?.total_revenue) || 0,
      average_order_value: Number(data.orders?.average_order_value) || 0,
      orders_this_month: Number(data.orders?.orders_this_month) || 0,
      orders_growth_rate: Number(data.orders?.orders_growth_rate) || 0,
      revenue_this_month: Number(data.orders?.revenue_this_month) || 0,
      revenue_growth_rate: Number(data.orders?.revenue_growth_rate) || 0,
    },
    overview: {
      total_revenue: Number(data.overview?.total_revenue) || 0,
      total_orders: Number(data.overview?.total_orders) || 0,
      total_customers: Number(data.overview?.total_customers) || 0,
      total_products: Number(data.overview?.total_products) || 0,
      revenue_growth: Number(data.overview?.revenue_growth) || 0,
      order_growth: Number(data.overview?.order_growth) || 0,
      customer_growth: Number(data.overview?.customer_growth) || 0,
      product_growth: Number(data.overview?.product_growth) || 0,
    },
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
    const timeRange = searchParams.get('timeRange') || '30';

    try {
      const backendUrl = `${API_CONFIG.backend.base}/admin/dashboard/stats?timeRange=${timeRange}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data: ApiResponse<AdminDashboardStats> = await response.json();
        const sanitizedStats = sanitizeDashboardStats(data.data);

        return NextResponse.json({
          success: true,
          data: sanitizedStats,
          message: data.message || 'Dashboard statistics retrieved successfully',
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

      console.warn(`Backend dashboard stats API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      console.warn('Backend dashboard stats API unavailable, using fallback data:', backendError);
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_DASHBOARD_STATS,
      message: 'Dashboard statistics retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Dashboard stats API error:', error);

    return NextResponse.json({
      success: false,
      data: DEFAULT_DASHBOARD_STATS,
      error: 'Internal server error',
      message: 'Failed to retrieve dashboard statistics, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
