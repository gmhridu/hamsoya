import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../../../lib/utils';

interface ChartWrapperProps {
  title: string;
  data: any[];
  type: 'line' | 'bar' | 'pie';
  className?: string;
  height?: number;
  colors?: string[];
}

/**
 * Chart wrapper component using Recharts
 */
export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  data,
  type,
  className,
  height = 300,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0] }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  const chart = renderChart();

  if (!chart) {
    return (
      <div
        className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}
      >
        <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex h-64 items-center justify-center text-gray-500">
          Unsupported chart type
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}>
      <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {chart}
      </ResponsiveContainer>
    </div>
  );
};
