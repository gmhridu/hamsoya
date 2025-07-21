'use client';

import {
  endOfMonth,
  format,
  startOfMonth,
  startOfYear,
  subDays,
} from 'date-fns';
import { Calendar, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { DateRange, DateRangePreset } from '../../../types/admin';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
}

/**
 * Date range picker component for dashboard filtering
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(
    DateRangePreset.LAST_30_DAYS
  );

  const presetOptions = [
    {
      label: 'Today',
      value: DateRangePreset.TODAY,
      getRange: () => ({
        startDate: new Date(),
        endDate: new Date(),
        label: 'Today',
      }),
    },
    {
      label: 'Yesterday',
      value: DateRangePreset.YESTERDAY,
      getRange: () => {
        const yesterday = subDays(new Date(), 1);
        return {
          startDate: yesterday,
          endDate: yesterday,
          label: 'Yesterday',
        };
      },
    },
    {
      label: 'Last 7 days',
      value: DateRangePreset.LAST_7_DAYS,
      getRange: () => ({
        startDate: subDays(new Date(), 6),
        endDate: new Date(),
        label: 'Last 7 days',
      }),
    },
    {
      label: 'Last 30 days',
      value: DateRangePreset.LAST_30_DAYS,
      getRange: () => ({
        startDate: subDays(new Date(), 29),
        endDate: new Date(),
        label: 'Last 30 days',
      }),
    },
    {
      label: 'This month',
      value: DateRangePreset.THIS_MONTH,
      getRange: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
        label: 'This month',
      }),
    },
    {
      label: 'Last month',
      value: DateRangePreset.LAST_MONTH,
      getRange: () => {
        const lastMonth = subDays(startOfMonth(new Date()), 1);
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
          label: 'Last month',
        };
      },
    },
    {
      label: 'Year to date',
      value: DateRangePreset.YEAR_TO_DATE,
      getRange: () => ({
        startDate: startOfYear(new Date()),
        endDate: new Date(),
        label: 'Year to date',
      }),
    },
  ];

  const handlePresetSelect = (preset: DateRangePreset) => {
    const option = presetOptions.find((opt) => opt.value === preset);
    if (option) {
      const range = option.getRange();
      setSelectedPreset(preset);
      onChange(range);
    }
  };

  const formatDateRange = () => {
    if (value.label) {
      return value.label;
    }

    const start = format(value.startDate, 'MMM d');
    const end = format(value.endDate, 'MMM d, yyyy');

    if (format(value.startDate, 'yyyy') === format(value.endDate, 'yyyy')) {
      return `${start} - ${end}`;
    }

    return `${format(value.startDate, 'MMM d, yyyy')} - ${end}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <Calendar className="mr-2 h-4 w-4" />
          {formatDateRange()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {presetOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handlePresetSelect(option.value)}
            className={selectedPreset === option.value ? 'bg-gray-100' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
