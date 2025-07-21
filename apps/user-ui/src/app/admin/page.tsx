'use client';

import { subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { ChartWrapper } from '../../components/admin/dashboard/ChartWrapper';
import { DateRangePicker } from '../../components/admin/dashboard/DateRangePicker';
import { KpiCard } from '../../components/admin/dashboard/KpiCard';
import {
  AdminGrid,
  AdminPageLayout,
} from '../../components/admin/layout/AdminPageLayout';
import { DashboardSkeleton } from '../../components/admin/skeletons/AdminSkeletons';
import { dataProvider } from '../../lib/data';
import { DashboardKpi, DateRange } from '../../types/admin';

/**
 * Admin dashboard page
 */
export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 29),
    endDate: new Date(),
    label: 'Last 30 days',
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const kpiData = await dataProvider.getDashboardKpis(dateRange);
        setKpis(kpiData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dateRange]);

  // Generate chart data from KPIs
  const generateChartData = () => {
    const ordersOverTime = [
      { name: 'Mon', value: 120 },
      { name: 'Tue', value: 150 },
      { name: 'Wed', value: 180 },
      { name: 'Thu', value: 200 },
      { name: 'Fri', value: 250 },
      { name: 'Sat', value: 300 },
      { name: 'Sun', value: 280 },
    ];

    const revenueOverTime = [
      { name: 'Mon', value: 2400 },
      { name: 'Tue', value: 3200 },
      { name: 'Wed', value: 4100 },
      { name: 'Thu', value: 3800 },
      { name: 'Fri', value: 5200 },
      { name: 'Sat', value: 6100 },
      { name: 'Sun', value: 5800 },
    ];

    const orderStatusBreakdown = [
      { name: 'Delivered', value: 45 },
      { name: 'Processing', value: 25 },
      { name: 'Shipped', value: 20 },
      { name: 'Pending', value: 10 },
    ];

    return {
      ordersOverTime,
      revenueOverTime,
      orderStatusBreakdown,
    };
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const chartData = generateChartData();

  return (
    <AdminPageLayout
      title="Dashboard"
      description="Overview of your admin metrics"
      actions={<DateRangePicker value={dateRange} onChange={setDateRange} />}
    >
      {/* KPI Cards */}
      <AdminGrid columns={4}>
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </AdminGrid>

      {/* Charts */}
      <AdminGrid columns={2}>
        <ChartWrapper
          title="Orders Over Time"
          data={chartData.ordersOverTime}
          type="line"
        />
        <ChartWrapper
          title="Revenue Over Time"
          data={chartData.revenueOverTime}
          type="bar"
        />
      </AdminGrid>

      <AdminGrid columns={1}>
        <ChartWrapper
          title="Order Status Breakdown"
          data={chartData.orderStatusBreakdown}
          type="pie"
          height={400}
        />
      </AdminGrid>
    </AdminPageLayout>
  );
}
