'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/admin/ui/stats-card';
import { DataTable } from '@/components/admin/ui/data-table';
import { SalesChart } from '@/components/admin/ui/sales-chart';
import { ActivityFeed } from '@/components/admin/ui/activity-feed';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminDashboard } from '@/hooks/use-admin-dashboard';
import { useAdminRealtime } from '@/hooks/use-admin-realtime';
import { useEffect, useState } from 'react';
import { AdminDashboardData } from '@/lib/admin-data-fetchers';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  RefreshCw,
} from 'lucide-react';



const orderColumns = [
  {
    key: 'order_number',
    title: 'Order ID',
    sortable: true,
  },
  {
    key: 'customer.name',
    title: 'Customer',
    render: (value: any, row: any) => row.customer?.name || 'N/A',
    sortable: true,
  },
  {
    key: 'customer.email',
    title: 'Email',
    render: (value: any, row: any) => row.customer?.email || 'N/A',
    sortable: true,
  },
  {
    key: 'total_amount',
    title: 'Total',
    render: (value: number) => `৳${value?.toLocaleString() || '0'}`,
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    render: (value: string) => (
      <Badge
        variant={
          value === 'delivered'
            ? 'default'
            : value === 'confirmed'
            ? 'secondary'
            : 'outline'
        }
      >
        {value || 'pending'}
      </Badge>
    ),
  },
  {
    key: 'created_at',
    title: 'Date',
    render: (value: string) => new Date(value).toLocaleDateString(),
    sortable: true,
  },
  {
    key: 'actions',
    title: 'Actions',
    render: () => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

const productColumns = [
  {
    key: 'name',
    title: 'Product',
    sortable: true,
  },
  {
    key: 'sales_count',
    title: 'Sales',
    render: (value: number) => value?.toLocaleString() || '0',
    sortable: true,
  },
  {
    key: 'revenue',
    title: 'Revenue',
    render: (value: number) => `৳${value?.toLocaleString() || '0'}`,
    sortable: true,
  },
  {
    key: 'stock_quantity',
    title: 'Stock',
    render: (value: number) => (
      <Badge variant={value < 30 ? 'destructive' : 'default'}>
        {value || 0}
      </Badge>
    ),
    sortable: true,
  },
];

interface AdminDashboardContentProps {
  initialData?: AdminDashboardData;
}

export function AdminDashboardContent({ initialData }: AdminDashboardContentProps) {
  console.log('AdminDashboardContent - Component rendering');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use admin dashboard hook with SSR initial data
  const {
    dashboardStats,
    recentOrders,
    topProducts,
    isLoading,
    isError,
    error,
    hasData,
    refetchAll,
    isAdmin,
  } = useAdminDashboard({
    initialData,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  // Enable real-time updates
  const { isConnected: isRealtimeConnected } = useAdminRealtime({
    enabled: isAdmin,
    onEvent: (event) => {
      console.log('Realtime event received:', event);
    },
  });

  // Show loading state only if no initial data and still loading
  if (isLoading && !hasData && !initialData) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="h-80 bg-card rounded-lg animate-pulse"></div>
          <div className="h-80 bg-card rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Show error state only if there's an error and no data available
  if (isError && !hasData && !initialData) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-center min-h-[400px] bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-destructive">Dashboard Error</h2>
            <p className="text-muted-foreground">There was an error loading the admin dashboard.</p>
            <Button onClick={refetchAll} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Use real data from SSR initial data or client-side hooks
  const stats = dashboardStats || initialData?.stats;
  const orders = recentOrders || initialData?.recentOrders || [];
  const products = topProducts || initialData?.topProducts || [];

  // Extract growth data from stats
  const salesGrowth = stats?.overview?.revenue_growth || 0;
  const ordersGrowth = stats?.overview?.order_growth || 0;
  const customersGrowth = stats?.overview?.customer_growth || 0;

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Skeleton loading for stats cards */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Skeleton loading for charts */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="space-y-4 md:space-y-6">
      {/* Page Header with refresh button */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome to your admin dashboard. Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            {/* Real-time connection indicator */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isRealtimeConnected ? 'Live' : 'Offline'}
            </div>

            <Button
              onClick={refetchAll}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="hidden sm:flex"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        )}
      </div>

      {/* KPI Cards - Responsive grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`৳${stats?.overview?.total_revenue?.toLocaleString() || '0'}`}
          description="from last month"
          icon={DollarSign}
          trend={{ value: salesGrowth, label: 'from last month', isPositive: salesGrowth >= 0 }}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.overview?.total_orders?.toLocaleString() || '0'}
          description="from last month"
          icon={ShoppingCart}
          trend={{ value: ordersGrowth, label: 'from last month', isPositive: ordersGrowth >= 0 }}
        />
        <StatsCard
          title="Total Customers"
          value={stats?.overview?.total_customers?.toLocaleString() || '0'}
          description="from last month"
          icon={Users}
          trend={{ value: customersGrowth, label: 'from last month', isPositive: customersGrowth >= 0 }}
        />
        <StatsCard
          title="Total Products"
          value={stats?.overview?.total_products?.toLocaleString() || '0'}
          description="active products"
          icon={Package}
        />
      </div>

      {/* Charts Section - Responsive layout */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <SalesChart title="Sales Overview" height={300} />

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={products}
              columns={productColumns}
              searchable={false}
              pageSize={5}
              keyField="id"
            />
          </CardContent>
        </Card>
      </div>

      {/* Activity and Recent Orders - Responsive layout */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <ActivityFeed title="Recent Activity" maxItems={6} />

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={orders}
              columns={orderColumns}
              searchPlaceholder="Search orders..."
              pageSize={5}
              keyField="id"
            />
          </CardContent>
        </Card>
      </div>
    </div>
    );
  } catch (error) {
    console.error('AdminDashboardContent - Rendering error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Dashboard Error</h2>
          <p className="text-muted-foreground">There was an error loading the admin dashboard.</p>
          <p className="text-sm text-muted-foreground">Check the console for more details.</p>
        </div>
      </div>
    );
  }
}
