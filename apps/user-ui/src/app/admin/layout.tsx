import { Metadata } from 'next';
import { AdminRouteGuard } from '../../components/admin/AdminRouteGuard';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Hamsoya',
  description: 'Admin dashboard for managing Hamsoya platform',
  robots: 'noindex, nofollow',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin root layout with authentication guard
 */
export default function AdminRootLayout({ children }: AdminLayoutProps) {
  return (
    <AdminRouteGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminRouteGuard>
  );
}
