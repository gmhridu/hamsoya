import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { cn } from '../../../lib/utils';
import { DashboardKpi } from '../../../types/admin';

interface KpiCardProps {
  kpi: DashboardKpi;
  className?: string;
}

/**
 * KPI card component for displaying dashboard metrics
 */
export const KpiCard: React.FC<KpiCardProps> = ({ kpi, className }) => {
  const formatValue = (value: number, unit?: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const getTrendIcon = () => {
    switch (kpi.changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(kpi.value, kpi.unit)}
          </p>
        </div>
        <div className="rounded-full bg-gray-100 p-3">
          {/* Icon placeholder - in a real app, you'd map kpi.icon to actual icons */}
          <div className="h-6 w-6 rounded bg-brand-primary/20" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={cn('text-sm font-medium', getTrendColor())}>
            {kpi.change > 0 ? '+' : ''}
            {kpi.change}%
          </span>
          <span className="text-sm text-gray-500">vs last period</span>
        </div>
      </div>

      {/* Mini trend chart */}
      {kpi.trend && kpi.trend.length > 0 && (
        <div className="mt-4">
          <div className="flex h-8 items-end space-x-1">
            {kpi.trend.map((value, index) => {
              const maxValue = Math.max(...kpi.trend);
              const height = (value / maxValue) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-brand-primary/20"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
