'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  User,
  Package,
  Settings,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'product' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

async function fetchActivityFeed(limit: number): Promise<ActivityItem[]> {
  const response = await fetch(`/api/admin/activity?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activity feed: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'order':
      return ShoppingCart;
    case 'user':
      return User;
    case 'product':
      return Package;
    case 'system':
      return Settings;
    default:
      return AlertCircle;
  }
};

const getStatusIcon = (status: ActivityItem['status']) => {
  switch (status) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertCircle;
    case 'error':
      return AlertCircle;
    default:
      return AlertCircle;
  }
};

const getStatusColor = (status: ActivityItem['status']) => {
  switch (status) {
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-blue-600';
  }
};

interface ActivityFeedProps {
  title?: string;
  maxItems?: number;
}

export function ActivityFeed({ title = 'Recent Activity', maxItems = 6 }: ActivityFeedProps) {
  const { data: activityData, isLoading, isError } = useQuery({
    queryKey: ['admin', 'activity', maxItems],
    queryFn: () => fetchActivityFeed(maxItems),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  const activities = activityData || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);

            return (
              <div key={activity.id} className="flex items-start gap-3">
                {/* Activity Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    {activity.status && (
                      <StatusIcon
                        className={`h-3 w-3 ${getStatusColor(activity.status)}`}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.user && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {activity.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {activity.user.name}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-primary hover:underline">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
