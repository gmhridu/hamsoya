'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '../../../lib/utils';

interface AdminBreadcrumbsProps {
  className?: string;
}

/**
 * Admin breadcrumbs navigation component
 */
export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({
  className,
}) => {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);

    // Remove 'admin' from segments since it's the root
    const adminIndex = segments.indexOf('admin');
    const adminSegments = segments.slice(adminIndex + 1);

    const breadcrumbs = [
      {
        label: 'Dashboard',
        href: '/admin',
        isActive: pathname === '/admin',
      },
    ];

    let currentPath = '/admin';

    adminSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === adminSegments.length - 1;

      // Convert segment to readable label
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs if we're on the dashboard
  if (pathname === '/admin') {
    return null;
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      <Link
        href="/admin"
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {breadcrumb.isActive ? (
            <span className="font-medium text-gray-900">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {breadcrumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
