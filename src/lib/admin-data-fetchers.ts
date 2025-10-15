import { cookies } from 'next/headers';
import { AdminDashboardStats, AdminDashboardOverview, AdminOrder, AdminCustomer, AdminProduct, ApiResponse, PaginatedResponse } from '@/types/admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}

async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    cache: options.cache || 'no-store',
    next: {
      revalidate: options.revalidate,
      tags: options.tags,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized access');
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchDashboardStats(timeRange: string = '30'): Promise<AdminDashboardStats> {
  try {
    const data: ApiResponse<AdminDashboardStats> = await fetchWithAuth(
      `/api/admin/dashboard/stats?timeRange=${timeRange}`,
      {
        cache: 'no-store',
        tags: ['admin-dashboard-stats'],
      }
    );
    return data.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return {
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
  }
}

export async function fetchDashboardOverview(): Promise<AdminDashboardOverview> {
  try {
    const data: ApiResponse<AdminDashboardOverview> = await fetchWithAuth(
      '/api/admin/dashboard/overview',
      {
        cache: 'no-store',
        tags: ['admin-dashboard-overview'],
      }
    );
    return data.data;
  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error);
    return {
      recentUsers: [],
      topProducts: [],
      recentOrders: [],
    };
  }
}

export async function fetchRecentOrders(limit: number = 10): Promise<AdminOrder[]> {
  try {
    const data: PaginatedResponse<AdminOrder> = await fetchWithAuth(
      `/api/admin/orders?limit=${limit}&sortBy=created_at&sortOrder=desc`,
      {
        cache: 'no-store',
        tags: ['admin-recent-orders'],
      }
    );
    return data.data;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    return [];
  }
}

export async function fetchTopProducts(limit: number = 10): Promise<AdminProduct[]> {
  try {
    const data: PaginatedResponse<AdminProduct> = await fetchWithAuth(
      `/api/admin/products?limit=${limit}&sortBy=sales_count&sortOrder=desc&is_active=true`,
      {
        cache: 'no-store',
        tags: ['admin-top-products'],
      }
    );
    return data.data;
  } catch (error) {
    console.error('Failed to fetch top products:', error);
    return [];
  }
}

export async function fetchRecentCustomers(limit: number = 10): Promise<AdminCustomer[]> {
  try {
    const data: PaginatedResponse<AdminCustomer> = await fetchWithAuth(
      `/api/admin/customers?limit=${limit}&sortBy=created_at&sortOrder=desc`,
      {
        cache: 'no-store',
        tags: ['admin-recent-customers'],
      }
    );
    return data.data;
  } catch (error) {
    console.error('Failed to fetch recent customers:', error);
    return [];
  }
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  overview: AdminDashboardOverview;
  recentOrders: AdminOrder[];
  topProducts: AdminProduct[];
  recentCustomers: AdminCustomer[];
}

export async function fetchAllDashboardData(timeRange: string = '30'): Promise<AdminDashboardData> {
  try {
    const [stats, overview, recentOrders, topProducts, recentCustomers] = await Promise.allSettled([
      fetchDashboardStats(timeRange),
      fetchDashboardOverview(),
      fetchRecentOrders(10),
      fetchTopProducts(5),
      fetchRecentCustomers(10),
    ]);

    return {
      stats: stats.status === 'fulfilled' ? stats.value : await fetchDashboardStats(timeRange),
      overview: overview.status === 'fulfilled' ? overview.value : await fetchDashboardOverview(),
      recentOrders: recentOrders.status === 'fulfilled' ? recentOrders.value : [],
      topProducts: topProducts.status === 'fulfilled' ? topProducts.value : [],
      recentCustomers: recentCustomers.status === 'fulfilled' ? recentCustomers.value : [],
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
}

export function revalidateDashboardData() {
  return [
    'admin-dashboard-stats',
    'admin-dashboard-overview',
    'admin-recent-orders',
    'admin-top-products',
    'admin-recent-customers',
  ];
}
