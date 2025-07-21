'use client';

import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main admin layout component with sidebar and topbar
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  className,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        {/* Topbar */}
        <AdminTopbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="p-6">
          {/* Breadcrumbs */}
          <AdminBreadcrumbs className="mb-6" />

          {/* Page content */}
          <div className={cn('space-y-6', className)}>{children}</div>
        </main>
      </div>
    </div>
  );
};
