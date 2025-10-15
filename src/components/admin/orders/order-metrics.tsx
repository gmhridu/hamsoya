'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricCardSkeleton } from '@/components/admin/ui/skeleton';
import { formatCurrency } from '@/lib/admin-utils';
import type { TransformedOrder } from '@/lib/admin-utils';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from 'lucide-react';

interface OrderMetricsProps {
  orders: TransformedOrder[];
  isLoading?: boolean;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

interface MetricData {
  title: string;
  value: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function OrderMetrics({ orders, isLoading, dateRange }: OrderMetricsProps) {
  const metrics = useMemo(() => {
    if (isLoading || orders.length === 0) {
      return null;
    }

    // Calculate current period metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate unique customers
    const uniqueCustomers = new Set(orders.map(order => order.email)).size;

    // Calculate status distribution
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate conversion rate (delivered orders / total orders)
    const deliveredOrders = statusCounts['delivered'] || 0;
    const conversionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // For demo purposes, generate mock comparison data
    // In a real app, you'd fetch comparison data from the API
    const generateMockChange = (baseValue: number) => {
      const changePercent = (Math.random() - 0.5) * 20; // -10% to +10%
      const type: 'increase' | 'decrease' | 'neutral' = changePercent > 2 ? 'increase' : changePercent < -2 ? 'decrease' : 'neutral';
      return {
        value: Math.abs(changePercent),
        type,
        period: 'vs last period'
      };
    };

    const metricsData: MetricData[] = [
      {
        title: 'Total Orders',
        value: totalOrders.toLocaleString(),
        change: generateMockChange(totalOrders),
        icon: ShoppingCart,
        description: 'Total number of orders'
      },
      {
        title: 'Revenue',
        value: formatCurrency(totalRevenue),
        change: generateMockChange(totalRevenue),
        icon: DollarSign,
        description: 'Total revenue generated'
      },
      {
        title: 'Average Order Value',
        value: formatCurrency(averageOrderValue),
        change: generateMockChange(averageOrderValue),
        icon: TrendingUp,
        description: 'Average value per order'
      },
      {
        title: 'Customers',
        value: uniqueCustomers.toLocaleString(),
        change: generateMockChange(uniqueCustomers),
        icon: Users,
        description: 'Unique customers'
      }
    ];

    return metricsData;
  }, [orders, isLoading]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <ArrowUpIcon className="h-3 w-3" />;
      case 'decrease':
        return <ArrowDownIcon className="h-3 w-3" />;
      default:
        return <MinusIcon className="h-3 w-3" />;
    }
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <div className="flex items-center space-x-1">
                    <div className={`flex items-center space-x-1 text-xs ${getChangeColor(metric.change.type)}`}>
                      {getChangeIcon(metric.change.type)}
                      <span>{metric.change.value.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {metric.change.period}
                    </span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Order status distribution component
interface OrderStatusDistributionProps {
  orders: TransformedOrder[];
  isLoading?: boolean;
}

export function OrderStatusDistribution({ orders, isLoading }: OrderStatusDistributionProps) {
  const statusData = useMemo(() => {
    if (isLoading || orders.length === 0) {
      return [];
    }

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = orders.length;

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / total) * 100
    }));
  }, [orders, isLoading]);

  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  if (statusData.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-purple-500',
      shipped: 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Order Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {statusData.map(({ status, count, percentage }) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                <span className="text-sm capitalize">{status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{count}</span>
                <Badge variant="outline" className="text-xs">
                  {percentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
