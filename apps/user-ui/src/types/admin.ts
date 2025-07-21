/**
 * Admin-specific type definitions
 */

import { User } from './auth';

/**
 * Role enum for role-based access control
 */
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

/**
 * Extended user interface with role
 */
export interface AdminUser extends User {
  role: Role;
  permissions?: string[];
  lastLogin?: string;
}

/**
 * Admin session interface
 */
export interface AdminSession {
  userId: string;
  email: string;
  role: Role;
  expiresAt: number;
  permissions?: string[];
}

/**
 * Dashboard KPI metrics
 */
export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: number[];
  unit?: string;
  icon?: string;
}

/**
 * Date range for filtering
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
  label?: string;
}

/**
 * Predefined date range options
 */
export enum DateRangePreset {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  YEAR_TO_DATE = 'year_to_date',
  CUSTOM = 'custom',
}

/**
 * Role-based access control map
 */
export interface RbacMap {
  [key: string]: {
    roles: Role[];
    permissions?: string[];
  };
}

/**
 * Admin route configuration
 */
export interface AdminRouteConfig {
  path: string;
  roles: Role[];
  permissions?: string[];
  exact?: boolean;
}

/**
 * Admin audit log entry
 */
export interface AdminAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

/**
 * Admin notification
 */
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  link?: string;
}
