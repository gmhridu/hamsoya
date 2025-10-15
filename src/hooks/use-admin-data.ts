'use client';

import { useQuery } from '@tanstack/react-query';
import { ADMIN_QUERY_KEYS } from '@/lib/admin-data-prefetcher';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api-client';

/**
 * Enhanced API data fetchers for admin dashboard
 * Uses enhanced methods with robust error handling and fallback data
 */
const adminDataFetchers = {
  dashboardStats: async (timeRange?: string) => {
    const response = await apiClient.getAdminDashboardStatsEnhanced(timeRange) as any;
    return response.data;
  },

  dashboardOverview: async () => {
    const response = await apiClient.getAdminDashboardOverviewEnhanced() as any;
    return response.data;
  },

  recentOrders: async () => {
    const response = await apiClient.getAdminOrdersEnhanced({ limit: 10, sortBy: 'created_at', sortOrder: 'desc' }) as any;
    return response.data;
  },

  orderStats: async (timeRange?: string) => {
    const response = await apiClient.getAdminOrderStatsEnhanced(timeRange) as any;
    return response.data;
  },

  topProducts: async () => {
    const response = await apiClient.getAdminProductsEnhanced({
      limit: 10,
      sortBy: 'sales_count',
      sortOrder: 'desc',
      is_active: true
    }) as any;
    return response.data;
  },

  productStats: async () => {
    const response = await apiClient.getAdminProductStatsEnhanced() as any;
    return response.data;
  },

  customerStats: async () => {
    const response = await apiClient.getAdminCustomerStatsEnhanced() as any;
    return response.data;
  },

  adminPermissions: async () => {
    // For now, return static permissions based on user role
    // TODO: Implement dynamic permissions from backend
    return [
      'admin:read',
      'admin:write',
      'admin:delete',
      'orders:read',
      'orders:write',
      'orders:manage',
      'products:read',
      'products:write',
      'products:manage',
      'customers:read',
      'customers:write',
      'customers:manage',
      'categories:read',
      'categories:write',
      'categories:manage',
      'settings:read',
      'settings:write',
      'logs:read',
      'analytics:read',
    ];
  },
};

/**
 * Hook for admin dashboard statistics
 */
export function useAdminDashboardStats(timeRange?: string) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.dashboard.stats, timeRange],
    queryFn: () => adminDataFetchers.dashboardStats(timeRange),
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/**
 * Hook for recent orders data with enhanced error handling
 */
export function useAdminRecentOrders() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.orders.recent,
    queryFn: adminDataFetchers.recentOrders,
    enabled: isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 1; // Only retry once
    },
  });
}

/**
 * Hook for top products data with enhanced error handling
 */
export function useAdminTopProducts() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.products.top,
    queryFn: adminDataFetchers.topProducts,
    enabled: isAdmin,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 1; // Only retry once
    },
  });
}

/**
 * Hook for admin permissions
 */
export function useAdminPermissions() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.permissions,
    queryFn: adminDataFetchers.adminPermissions,
    enabled: isAdmin,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}













/**
 * Comprehensive admin data hook
 * Provides all admin dashboard data in a single hook
 */
export function useAdminData() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const dashboardStats = useAdminDashboardStats();
  const recentOrders = useAdminRecentOrders();
  const topProducts = useAdminTopProducts();
  const permissions = useAdminPermissions();

  const isLoading = dashboardStats.isLoading || recentOrders.isLoading || topProducts.isLoading || permissions.isLoading;
  const isError = dashboardStats.isError || recentOrders.isError || topProducts.isError || permissions.isError;
  const error = dashboardStats.error || recentOrders.error || topProducts.error || permissions.error;

  // Check if any critical data is available (for optimistic rendering)
  const hasData = dashboardStats.data || recentOrders.data || topProducts.data;

  return {
    // Individual data
    dashboardStats: dashboardStats.data,
    recentOrders: recentOrders.data,
    topProducts: topProducts.data,
    permissions: permissions.data,

    // Loading states
    isLoading,
    isError,
    error,
    hasData,

    // Individual loading states for granular control
    isDashboardStatsLoading: dashboardStats.isLoading,
    isRecentOrdersLoading: recentOrders.isLoading,
    isTopProductsLoading: topProducts.isLoading,
    isPermissionsLoading: permissions.isLoading,

    // Individual error states
    dashboardStatsError: dashboardStats.error,
    recentOrdersError: recentOrders.error,
    topProductsError: topProducts.error,
    permissionsError: permissions.error,

    // Refetch functions
    refetchDashboardStats: dashboardStats.refetch,
    refetchRecentOrders: recentOrders.refetch,
    refetchTopProducts: topProducts.refetch,
    refetchPermissions: permissions.refetch,

    // Refetch all data
    refetchAll: () => {
      dashboardStats.refetch();
      recentOrders.refetch();
      topProducts.refetch();
      permissions.refetch();
    },

    // Admin access check
    isAdmin,
  };
}

/**
 * Hook for checking if admin data is cached
 */
export function useAdminDataCache() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const dashboardStats = useAdminDashboardStats();
  const recentOrders = useAdminRecentOrders();
  const topProducts = useAdminTopProducts();

  const isCached = !!(dashboardStats.data && recentOrders.data && topProducts.data);
  const isStale = dashboardStats.isStale || recentOrders.isStale || topProducts.isStale;

  return {
    isCached,
    isStale,
    isAdmin,
    cacheStatus: {
      dashboardStats: !!dashboardStats.data,
      recentOrders: !!recentOrders.data,
      topProducts: !!topProducts.data,
    },
  };
}

/**
 * Type definitions for admin data
 */
export interface AdminDashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

export type AdminPermission = string;

/**
 * Enhanced admin hooks with comprehensive error handling
 */

// Dashboard Overview Hook
export function useAdminDashboardOverview() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: adminDataFetchers.dashboardOverview,
    enabled: isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Order Statistics Hook
export function useAdminOrderStats(timeRange?: string) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'orders', 'stats', timeRange],
    queryFn: () => adminDataFetchers.orderStats(timeRange),
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Product Statistics Hook
export function useAdminProductStats() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'products', 'stats'],
    queryFn: adminDataFetchers.productStats,
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Customer Statistics Hook
export function useAdminCustomerStats() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'customers', 'stats'],
    queryFn: adminDataFetchers.customerStats,
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Orders List Hook with Pagination
export function useAdminOrders(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'orders', 'list', params],
    queryFn: () => apiClient.getAdminOrdersEnhanced(params),
    enabled: isAdmin,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Customers List Hook with Pagination
export function useAdminCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  verified?: boolean;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'customers', 'list', params],
    queryFn: () => apiClient.getAdminCustomersEnhanced(params),
    enabled: isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Products List Hook with Pagination
export function useAdminProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  featured?: boolean;
  in_stock?: boolean;
  is_active?: boolean;
  low_stock?: boolean;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'products', 'list', params],
    queryFn: () => apiClient.getAdminProductsEnhanced(params),
    enabled: isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Single Product Hook
export function useAdminProduct(id: string) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'products', 'detail', id],
    queryFn: () => apiClient.getAdminProductEnhanced(id),
    enabled: isAdmin && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Categories List Hook
export function useAdminCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'categories', 'list', params],
    queryFn: () => apiClient.getAdminCategoriesEnhanced(params),
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Settings Hook
export function useAdminSettings() {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => apiClient.getAdminSettingsEnhanced(),
    enabled: isAdmin,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
