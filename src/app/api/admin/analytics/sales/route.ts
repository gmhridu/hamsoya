import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

interface SalesDataPoint {
  name: string;
  sales: number;
  orders: number;
  date: string;
}

const DEFAULT_SALES_DATA: Record<string, SalesDataPoint[]> = {
  daily: [
    { name: 'Mon', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Tue', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Wed', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Thu', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Fri', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Sat', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Sun', sales: 0, orders: 0, date: new Date().toISOString() },
  ],
  weekly: [
    { name: 'Week 1', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Week 2', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Week 3', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Week 4', sales: 0, orders: 0, date: new Date().toISOString() },
  ],
  monthly: [
    { name: 'Jan', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Feb', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Mar', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Apr', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'May', sales: 0, orders: 0, date: new Date().toISOString() },
    { name: 'Jun', sales: 0, orders: 0, date: new Date().toISOString() },
  ],
};

function sanitizeSalesData(data: any[]): SalesDataPoint[] {
  return data.map((item: any) => ({
    name: String(item.name || item.period || ''),
    sales: Number(item.sales || item.total_sales || item.revenue || 0),
    orders: Number(item.orders || item.total_orders || item.order_count || 0),
    date: String(item.date || item.created_at || new Date().toISOString()),
  }));
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
    const period = searchParams.get('period') || 'daily';
    const chartType = searchParams.get('chartType') || 'area';

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid period',
          message: 'Period must be daily, weekly, or monthly',
        },
        { status: 400 }
      );
    }

    try {
      // Try to fetch from backend
      const backendUrl = `${API_CONFIG.backend.base}/admin/analytics/sales?period=${period}`;

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
        const sanitizedData = Array.isArray(data.data) 
          ? sanitizeSalesData(data.data)
          : DEFAULT_SALES_DATA[period];

        return NextResponse.json({
          success: true,
          data: sanitizedData,
          period,
          chartType,
          message: data.message || 'Sales data retrieved successfully',
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

      console.warn(`Backend sales analytics API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      console.warn('Backend sales analytics API unavailable, using fallback data:', backendError);
    }

    // Return default data when backend is unavailable
    return NextResponse.json({
      success: true,
      data: DEFAULT_SALES_DATA[period],
      period,
      chartType,
      message: 'Sales data retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sales analytics API error:', error);

    return NextResponse.json({
      success: false,
      data: DEFAULT_SALES_DATA.daily,
      period: 'daily',
      chartType: 'area',
      error: 'Internal server error',
      message: 'Failed to retrieve sales data, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
