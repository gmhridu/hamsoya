'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Admin page layout component with title and actions
 */
export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  children,
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

interface AdminSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Admin section component for grouping content
 */
export const AdminSection: React.FC<AdminSectionProps> = ({
  children,
  title,
  description,
  className,
}) => {
  return (
    <div className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-lg font-medium">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

interface AdminGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Admin grid component for responsive layouts
 */
export const AdminGrid: React.FC<AdminGridProps> = ({
  children,
  columns = 2,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
};
