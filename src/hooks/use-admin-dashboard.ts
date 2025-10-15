'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { AdminDashboardData } from '@/lib/admin-data-fetchers';
import { AdminDashboardStats, AdminDashboardOverview, AdminOrder, AdminProduct, AdminCustomer } from '@/types/admin';
import { ADMIN_CACHE_KEYS, CACHE_TIMES, getAdminCacheManager } from '@/lib/admin-cache-manager';

const ADMIN_QUERY_KEYS = {
  dashboard: {
    stats: ['admin', 'dashboard', 'stats'],
    overview: ['admin', 'dashboard', 'overview'],
    recentOrders: ['admin', 'dashboard', 'recent-orders'],
    topProducts: ['admin', 'dashboard', 'top-products'],
    recentCustomers: ['admin', 'dashboard', 'recent-customers'],
  },
} as const;

async function fetchDashboardStats(timeRange: string = '30'): Promise<AdminDashboardStats> {
  const response = await fetch(`/api/admin/dashboard/stats?timeRange=${timeRange}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

async function fetchDashboardOverview(): Promise<AdminDashboardOverview> {
  const response = await fetch('/api/admin/dashboard/overview', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard overview: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

async function fetchRecentOrders(limit: number = 10): Promise<AdminOrder[]> {
  const response = await fetch(`/api/admin/orders?limit=${limit}&sortBy=created_at&sortOrder=desc`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recent orders: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

async function fetchTopProducts(limit: number = 5): Promise<AdminProduct[]> {
  const response = await fetch(`/api/admin/products?limit=${limit}&sortBy=sales_count&sortOrder=desc&is_active=true`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch top products: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

interface UseAdminDashboardOptions {
  initialData?: AdminDashboardData;
  timeRange?: string;
  refetchInterval?: number;
  enabled?: boolean;
}

export function useAdminDashboard(options: UseAdminDashboardOptions = {}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  const queryClient = useQueryClient();
  const cacheManager = getAdminCacheManager(queryClient);

  const {
    initialData,
    timeRange = '30',
    refetchInterval = CACHE_TIMES.dashboard.refetchInterval,
    enabled = true,
  } = options;

  // Set initial data in query cache if provided
  if (initialData && isAdmin) {
    queryClient.setQueryData(ADMIN_CACHE_KEYS.dashboard.stats(timeRange), initialData.stats);
    queryClient.setQueryData(ADMIN_CACHE_KEYS.dashboard.overview, initialData.overview);
    queryClient.setQueryData(ADMIN_CACHE_KEYS.dashboard.recentOrders, initialData.recentOrders);
    queryClient.setQueryData(ADMIN_CACHE_KEYS.dashboard.topProducts, initialData.topProducts);
    queryClient.setQueryData(ADMIN_CACHE_KEYS.dashboard.recentCustomers, initialData.recentCustomers);
  }

  const dashboardStatsQuery = useQuery({
    queryKey: ADMIN_CACHE_KEYS.dashboard.stats(timeRange),
    queryFn: () => fetchDashboardStats(timeRange),
    enabled: isAdmin && enabled,
    ...CACHE_TIMES.dashboard,
    refetchInterval,
    refetchOnWindowFocus: false,
    initialData: initialData?.stats,
  });

  const dashboardOverviewQuery = useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard.overview,
    queryFn: fetchDashboardOverview,
    enabled: isAdmin && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    initialData: initialData?.overview,
  });

  const recentOrdersQuery = useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard.recentOrders,
    queryFn: () => fetchRecentOrders(10),
    enabled: isAdmin && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    initialData: initialData?.recentOrders,
  });

  const topProductsQuery = useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard.topProducts,
    queryFn: () => fetchTopProducts(5),
    enabled: isAdmin && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval,
    refetchOnWindowFocus: false,
    initialData: initialData?.topProducts,
  });

  const isLoading = dashboardStatsQuery.isLoading || dashboardOverviewQuery.isLoading ||
                   recentOrdersQuery.isLoading || topProductsQuery.isLoading;

  const isError = dashboardStatsQuery.isError || dashboardOverviewQuery.isError ||
                 recentOrdersQuery.isError || topProductsQuery.isError;

  const error = dashboardStatsQuery.error || dashboardOverviewQuery.error ||
               recentOrdersQuery.error || topProductsQuery.error;

  const hasData = !!(dashboardStatsQuery.data || dashboardOverviewQuery.data ||
                    recentOrdersQuery.data || topProductsQuery.data);

  const refetchAll = async () => {
    await Promise.all([
      dashboardStatsQuery.refetch(),
      dashboardOverviewQuery.refetch(),
      recentOrdersQuery.refetch(),
      topProductsQuery.refetch(),
    ]);
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  return {
    // Data
    dashboardStats: dashboardStatsQuery.data,
    dashboardOverview: dashboardOverviewQuery.data,
    recentOrders: recentOrdersQuery.data,
    topProducts: topProductsQuery.data,

    // Loading states
    isLoading,
    isError,
    error,
    hasData,

    // Individual loading states
    isStatsLoading: dashboardStatsQuery.isLoading,
    isOverviewLoading: dashboardOverviewQuery.isLoading,
    isOrdersLoading: recentOrdersQuery.isLoading,
    isProductsLoading: topProductsQuery.isLoading,

    // Actions
    refetchAll,
    invalidateAll,
    refetchStats: dashboardStatsQuery.refetch,
    refetchOverview: dashboardOverviewQuery.refetch,
    refetchOrders: recentOrdersQuery.refetch,
    refetchProducts: topProductsQuery.refetch,

    // Meta
    isAdmin,

    // Query objects for advanced usage
    queries: {
      stats: dashboardStatsQuery,
      overview: dashboardOverviewQuery,
      orders: recentOrdersQuery,
      products: topProductsQuery,
    },
  };
}

export function useAdminDashboardOptimistic() {
  const queryClient = useQueryClient();

  const updateStatsOptimistically = (updater: (old: AdminDashboardStats | undefined) => AdminDashboardStats) => {
    queryClient.setQueryData(ADMIN_QUERY_KEYS.dashboard.stats, updater);
  };

  const updateOrdersOptimistically = (updater: (old: AdminOrder[] | undefined) => AdminOrder[]) => {
    queryClient.setQueryData(ADMIN_QUERY_KEYS.dashboard.recentOrders, updater);
  };

  const updateProductsOptimistically = (updater: (old: AdminProduct[] | undefined) => AdminProduct[]) => {
    queryClient.setQueryData(ADMIN_QUERY_KEYS.dashboard.topProducts, updater);
  };

  return {
    updateStatsOptimistically,
    updateOrdersOptimistically,
    updateProductsOptimistically,
  };
}
