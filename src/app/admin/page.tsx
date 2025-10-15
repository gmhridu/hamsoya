import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';
import { fetchAllDashboardData } from '@/lib/admin-data-fetchers';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Hamsoya | Overview & Analytics',
  description: 'Admin dashboard overview with sales analytics, order management, and system monitoring.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/auth/login?redirect=/admin');
  }

  return accessToken;
}

export default async function AdminDashboardPage() {
  try {
    await checkAdminAuth();

    const dashboardData = await fetchAllDashboardData();

    return (
      <div className="space-y-6">
        <AdminDashboardContent initialData={dashboardData} />
      </div>
    );
  } catch (error) {
    console.error('Admin dashboard error:', error);
    redirect('/auth/login?redirect=/admin');
  }
}
