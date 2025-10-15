'use client';

import { QueryClient } from '@tanstack/react-query';

export const ADMIN_CACHE_KEYS = {
  dashboard: {
    stats: (timeRange?: string) => ['admin', 'dashboard', 'stats', timeRange].filter(Boolean),
    overview: ['admin', 'dashboard', 'overview'],
    recentOrders: ['admin', 'dashboard', 'recent-orders'],
    topProducts: ['admin', 'dashboard', 'top-products'],
    recentCustomers: ['admin', 'dashboard', 'recent-customers'],
    salesAnalytics: (period: string, chartType: string) => ['admin', 'analytics', 'sales', period, chartType],
    activity: (limit: number) => ['admin', 'activity', limit],
  },
  orders: {
    list: (params?: any) => ['admin', 'orders', 'list', params].filter(Boolean),
    detail: (id: string) => ['admin', 'orders', 'detail', id],
    stats: ['admin', 'orders', 'stats'],
  },
  products: {
    list: (params?: any) => ['admin', 'products', 'list', params].filter(Boolean),
    detail: (id: string) => ['admin', 'products', 'detail', id],
    stats: ['admin', 'products', 'stats'],
  },
  customers: {
    list: (params?: any) => ['admin', 'customers', 'list', params].filter(Boolean),
    detail: (id: string) => ['admin', 'customers', 'detail', id],
    stats: ['admin', 'customers', 'stats'],
  },
  categories: {
    list: (params?: any) => ['admin', 'categories', 'list', params].filter(Boolean),
    detail: (id: string) => ['admin', 'categories', 'detail', id],
    stats: ['admin', 'categories', 'stats'],
  },
} as const;

export const CACHE_TIMES = {
  // Dashboard data - frequently updated
  dashboard: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  },
  // Real-time data - very fresh
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 1 * 60 * 1000, // 1 minute
  },
  // List data - moderately fresh
  lists: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: false, // Manual refresh only
  },
  // Detail data - can be cached longer
  details: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: false, // Manual refresh only
  },
  // Analytics data - can be cached longer
  analytics: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: false, // Manual refresh only
  },
} as const;

export class AdminCacheManager {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  // Invalidate all dashboard data
  invalidateDashboard() {
    this.queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  }

  // Invalidate specific resource
  invalidateResource(resource: 'orders' | 'products' | 'customers' | 'categories') {
    this.queryClient.invalidateQueries({ queryKey: ['admin', resource] });
    // Also invalidate dashboard data that might be affected
    this.invalidateDashboard();
  }

  // Smart invalidation based on mutation type
  invalidateAfterMutation(
    resource: 'orders' | 'products' | 'customers' | 'categories',
    action: 'create' | 'update' | 'delete',
    id?: string
  ) {
    switch (action) {
      case 'create':
        // Invalidate lists and dashboard
        this.queryClient.invalidateQueries({ queryKey: ['admin', resource, 'list'] });
        this.queryClient.invalidateQueries({ queryKey: ['admin', resource, 'stats'] });
        this.invalidateDashboard();
        break;

      case 'update':
        // Invalidate specific item, lists, and dashboard
        if (id) {
          this.queryClient.invalidateQueries({ queryKey: ['admin', resource, 'detail', id] });
        }
        this.queryClient.invalidateQueries({ queryKey: ['admin', resource, 'list'] });
        this.invalidateDashboard();
        break;

      case 'delete':
        // Remove specific item from cache and invalidate lists
        if (id) {
          this.queryClient.removeQueries({ queryKey: ['admin', resource, 'detail', id] });
        }
        this.queryClient.invalidateQueries({ queryKey: ['admin', resource, 'list'] });
        this.queryClient.invalidateQueries({ queryKey: ['admin', resource, 'stats'] });
        this.invalidateDashboard();
        break;
    }
  }

  // Prefetch related data
  async prefetchRelatedData(resource: 'orders' | 'products' | 'customers' | 'categories', id: string) {
    switch (resource) {
      case 'orders':
        // Prefetch customer data for order
        const orderData = this.queryClient.getQueryData(['admin', 'orders', 'detail', id]) as any;
        if (orderData?.customer?.id) {
          this.queryClient.prefetchQuery({
            queryKey: ['admin', 'customers', 'detail', orderData.customer.id],
            queryFn: () => fetch(`/api/admin/customers/${orderData.customer.id}`).then(r => r.json()),
            staleTime: CACHE_TIMES.details.staleTime,
          });
        }
        break;

      case 'products':
        // Prefetch category data for product
        const productData = this.queryClient.getQueryData(['admin', 'products', 'detail', id]) as any;
        if (productData?.category_id) {
          this.queryClient.prefetchQuery({
            queryKey: ['admin', 'categories', 'detail', productData.category_id],
            queryFn: () => fetch(`/api/admin/categories/${productData.category_id}`).then(r => r.json()),
            staleTime: CACHE_TIMES.details.staleTime,
          });
        }
        break;
    }
  }

  // Background refresh for critical data
  backgroundRefresh() {
    // Refresh dashboard stats in background
    this.queryClient.refetchQueries({
      queryKey: ['admin', 'dashboard', 'stats'],
      type: 'active',
    });

    // Refresh recent orders
    this.queryClient.refetchQueries({
      queryKey: ['admin', 'dashboard', 'recent-orders'],
      type: 'active',
    });
  }

  // Optimistic updates
  updateOptimistically<T>(
    queryKey: any[],
    updateFn: (old: T | undefined) => T,
    rollbackFn?: (old: T | undefined) => T
  ) {
    const previousData = this.queryClient.getQueryData<T>(queryKey);

    // Apply optimistic update
    this.queryClient.setQueryData(queryKey, updateFn);

    return {
      rollback: () => {
        if (rollbackFn) {
          this.queryClient.setQueryData(queryKey, rollbackFn);
        } else {
          this.queryClient.setQueryData(queryKey, previousData);
        }
      },
      previousData,
    };
  }

  // Cache warming - preload frequently accessed data
  async warmCache() {
    const queries = [
      {
        queryKey: ADMIN_CACHE_KEYS.dashboard.stats(),
        queryFn: () => fetch('/api/admin/dashboard/stats').then(r => r.json()),
        ...CACHE_TIMES.dashboard,
      },
      {
        queryKey: ADMIN_CACHE_KEYS.dashboard.overview,
        queryFn: () => fetch('/api/admin/dashboard/overview').then(r => r.json()),
        ...CACHE_TIMES.dashboard,
      },
      {
        queryKey: ADMIN_CACHE_KEYS.orders.list(),
        queryFn: () => fetch('/api/admin/orders?limit=20').then(r => r.json()),
        ...CACHE_TIMES.lists,
      },
    ];

    await Promise.allSettled(
      queries.map(query => this.queryClient.prefetchQuery(query as any))
    );
  }

  // Cache cleanup - remove stale data
  cleanup() {
    // Remove queries that haven't been used in the last hour
    this.queryClient.getQueryCache().getAll().forEach(query => {
      const lastUpdated = query.state.dataUpdatedAt;
      const oneHourAgo = Date.now() - 60 * 60 * 1000;

      if (lastUpdated < oneHourAgo && !query.getObserversCount()) {
        this.queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }

  // Get cache statistics
  getCacheStats() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();

    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      loadingQueries: queries.filter(q => q.state.status === 'pending').length,
      cacheSize: this.estimateCacheSize(queries),
    };
  }

  private estimateCacheSize(queries: any[]): string {
    let totalSize = 0;

    queries.forEach(query => {
      if (query.state.data) {
        totalSize += JSON.stringify(query.state.data).length;
      }
    });

    // Convert to human readable format
    if (totalSize < 1024) return `${totalSize} B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
  }
}

// Create singleton instance
let adminCacheManager: AdminCacheManager | null = null;

export function getAdminCacheManager(queryClient: QueryClient): AdminCacheManager {
  if (!adminCacheManager) {
    adminCacheManager = new AdminCacheManager(queryClient);
  }
  return adminCacheManager;
}

// Hook for using cache manager
export function useAdminCacheManager() {
  const queryClient = new QueryClient();
  return getAdminCacheManager(queryClient);
}
