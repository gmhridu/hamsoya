/**
 * Admin Utility Functions
 * Data transformation and formatting utilities for admin interface
 */

import type { OrderWithDetails } from '@/types/admin';

// Transform backend OrderWithDetails to frontend table format
export interface TransformedOrder {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  total: number;
  status: string;
  paymentStatus: string;
  date: string;
  items: number;
  shippingAddress: string;
  orderNumber: string;
  // Keep original data for detailed operations
  _original: OrderWithDetails;
}

export function transformOrderForTable(order: OrderWithDetails): TransformedOrder {
  // Format shipping address
  const shippingAddress = order.shipping_address
    ? `${order.shipping_address.city}, ${order.shipping_address.country}`
    : 'No address provided';

  // Convert amount from cents to display format (assuming backend stores in cents)
  const total = order.total_amount / 100;

  // Format date
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id: order.order_number, // Use order number as display ID
    customer: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone_number,
    total,
    status: order.status.toLowerCase(), // Convert to lowercase for consistency
    paymentStatus: order.payment_status.toLowerCase(),
    date,
    items: order.items_count,
    shippingAddress,
    orderNumber: order.order_number,
    _original: order,
  };
}

export function transformOrdersForTable(orders: OrderWithDetails[]): TransformedOrder[] {
  return orders.map(transformOrderForTable);
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = '৳'): string {
  return `${currency}${amount.toLocaleString()}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date and time for display
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get status color variant for badges
export function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'paid':
      return 'default';
    case 'confirmed':
    case 'processing':
    case 'shipped':
      return 'secondary';
    case 'cancelled':
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

// Normalize status for consistent display
export function normalizeStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

// Get order status priority for sorting
export function getOrderStatusPriority(status: string): number {
  const priorities: Record<string, number> = {
    pending: 1,
    confirmed: 2,
    processing: 3,
    shipped: 4,
    delivered: 5,
    cancelled: 6,
  };
  return priorities[status.toLowerCase()] || 0;
}

// Get payment status priority for sorting
export function getPaymentStatusPriority(status: string): number {
  const priorities: Record<string, number> = {
    pending: 1,
    paid: 2,
    failed: 3,
    refunded: 4,
  };
  return priorities[status.toLowerCase()] || 0;
}

// Check if order can be cancelled
export function canCancelOrder(order: OrderWithDetails): boolean {
  const nonCancellableStatuses = ['DELIVERED', 'CANCELLED'];
  return !nonCancellableStatuses.includes(order.status);
}

// Check if order status can be updated
export function canUpdateOrderStatus(order: OrderWithDetails, newStatus: string): boolean {
  const currentStatus = order.status;

  // Define valid status transitions
  const validTransitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [], // Cannot change from delivered
    CANCELLED: [], // Cannot change from cancelled
  };

  return validTransitions[currentStatus]?.includes(newStatus.toUpperCase()) || false;
}

// Get next possible statuses for an order
export function getNextPossibleStatuses(order: OrderWithDetails): string[] {
  const validTransitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  return validTransitions[order.status] || [];
}

// Calculate order summary
export function calculateOrderSummary(order: OrderWithDetails) {
  return {
    subtotal: order.subtotal / 100,
    taxAmount: order.tax_amount ? order.tax_amount / 100 : 0,
    shippingAmount: order.shipping_cost ? order.shipping_cost / 100 : 0,
    discountAmount: order.discount_amount ? order.discount_amount / 100 : 0,
    total: order.total_amount / 100,
  };
}
