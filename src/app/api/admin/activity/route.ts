import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

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
  created_at: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'system',
    title: 'System Online',
    description: 'Admin dashboard is ready and operational',
    timestamp: 'Just now',
    status: 'success',
    created_at: new Date().toISOString(),
  },
];

function sanitizeActivity(activity: any): ActivityItem {
  return {
    id: String(activity.id || Math.random().toString(36)),
    type: activity.type || 'system',
    title: String(activity.title || activity.action || ''),
    description: String(activity.description || activity.details || ''),
    timestamp: activity.timestamp || formatTimestamp(activity.created_at),
    user: activity.user ? {
      name: String(activity.user.name || ''),
      avatar: activity.user.avatar || activity.user.profile_image_url,
    } : undefined,
    status: activity.status || 'info',
    created_at: String(activity.created_at || new Date().toISOString()),
  };
}

function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'Unknown';
  }
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
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const type = searchParams.get('type'); // Filter by activity type

    try {
      // Try to fetch from backend
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      if (type) queryParams.append('type', type);

      const backendUrl = `${API_CONFIG.backend.base}/admin/activity?${queryParams.toString()}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        const sanitizedActivities = Array.isArray(data.data) 
          ? data.data.map(sanitizeActivity).slice(0, limit)
          : DEFAULT_ACTIVITIES;

        return NextResponse.json({
          success: true,
          data: sanitizedActivities,
          total: sanitizedActivities.length,
          limit,
          message: data.message || 'Activity feed retrieved successfully',
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

      console.warn(`Backend activity API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      console.warn('Backend activity API unavailable, using fallback data:', backendError);
    }

    // Return default data when backend is unavailable
    return NextResponse.json({
      success: true,
      data: DEFAULT_ACTIVITIES.slice(0, limit),
      total: DEFAULT_ACTIVITIES.length,
      limit,
      message: 'Activity feed retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Activity feed API error:', error);

    return NextResponse.json({
      success: false,
      data: DEFAULT_ACTIVITIES,
      total: 0,
      limit: 10,
      error: 'Internal server error',
      message: 'Failed to retrieve activity feed, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
