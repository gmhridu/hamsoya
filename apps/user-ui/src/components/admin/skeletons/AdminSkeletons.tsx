import React from 'react';
import { Skeleton } from '../../ui/skeleton';
import {
  AdminGrid,
  AdminPageLayout,
  AdminSection,
} from '../layout/AdminPageLayout';

/**
 * Dashboard skeleton
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <AdminPageLayout
      title="Dashboard"
      description="Overview of your admin metrics"
    >
      {/* KPI Cards */}
      <AdminGrid columns={4}>
        {Array.from({ length: 5 }).map((_, i) => (
          <AdminSection key={i}>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </AdminSection>
        ))}
      </AdminGrid>

      {/* Charts */}
      <AdminGrid columns={2}>
        <AdminSection>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </AdminSection>
        <AdminSection>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        </AdminSection>
      </AdminGrid>
    </AdminPageLayout>
  );
};

/**
 * Table skeleton
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-4">
      {/* Table header */}
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
};

/**
 * Form skeleton
 */
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

/**
 * Card grid skeleton
 */
export const CardGridSkeleton: React.FC<{
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}> = ({ count = 6, columns = 3 }) => {
  return (
    <AdminGrid columns={columns}>
      {Array.from({ length: count }).map((_, i) => (
        <AdminSection key={i}>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </AdminSection>
      ))}
    </AdminGrid>
  );
};

/**
 * Stats skeleton
 */
export const StatsSkeleton: React.FC = () => {
  return (
    <AdminGrid columns={4}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </AdminGrid>
  );
};
