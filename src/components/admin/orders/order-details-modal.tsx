'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatusBadge, PaymentStatusBadge } from './order-status-badge';
import { formatCurrency, calculateOrderSummary, getNextPossibleStatuses } from '@/lib/admin-utils';
import { OrderDetailsSkeleton } from '@/components/admin/ui/skeleton';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  CreditCard,
} from 'lucide-react';

// Print HTML generation function
function generatePrintHTML(order: any, summary: any): string {
  const currentDate = new Date().toLocaleDateString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order ${order.order_number} - Invoice</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .invoice-title {
          font-size: 18px;
          color: #666;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .info-section {
          flex: 1;
          margin-right: 20px;
        }
        .info-section:last-child {
          margin-right: 0;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
          color: #666;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th, .items-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .items-table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .items-table .text-right {
          text-align: right;
        }
        .summary-table {
          width: 300px;
          margin-left: auto;
          border-collapse: collapse;
        }
        .summary-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
        }
        .summary-table .total-row {
          font-weight: bold;
          border-top: 2px solid #333;
          border-bottom: 2px solid #333;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">Hamsoya</div>
        <div class="invoice-title">Order Invoice</div>
      </div>

      <div class="order-info">
        <div class="info-section">
          <div class="section-title">Order Details</div>
          <div><strong>Order Number:</strong> ${order.order_number}</div>
          <div><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</div>
          <div><strong>Status:</strong> ${order.status}</div>
          <div><strong>Payment Status:</strong> ${order.payment_status}</div>
        </div>

        <div class="info-section">
          <div class="section-title">Customer Information</div>
          <div><strong>Name:</strong> ${order.customer.name}</div>
          <div><strong>Email:</strong> ${order.customer.email}</div>
          ${order.customer.phone_number ? `<div><strong>Phone:</strong> ${order.customer.phone_number}</div>` : ''}
        </div>

        <div class="info-section">
          <div class="section-title">Shipping Address</div>
          ${order.shipping_address ? `
            <div>${order.shipping_address.name}</div>
            <div>${order.shipping_address.address_line_1}</div>
            ${order.shipping_address.address_line_2 ? `<div>${order.shipping_address.address_line_2}</div>` : ''}
            <div>${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}</div>
            <div>${order.shipping_address.country}</div>
          ` : '<div>No shipping address provided</div>'}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item: any) => `
            <tr>
              <td>${item.product.name}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.unit_price / 100)}</td>
              <td class="text-right">${formatCurrency(item.total_price / 100)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <table class="summary-table">
        <tr>
          <td>Subtotal:</td>
          <td class="text-right">${formatCurrency(summary.subtotal)}</td>
        </tr>
        ${summary.taxAmount > 0 ? `
          <tr>
            <td>Tax:</td>
            <td class="text-right">${formatCurrency(summary.taxAmount)}</td>
          </tr>
        ` : ''}
        ${summary.shippingAmount > 0 ? `
          <tr>
            <td>Shipping:</td>
            <td class="text-right">${formatCurrency(summary.shippingAmount)}</td>
          </tr>
        ` : ''}
        ${summary.discountAmount > 0 ? `
          <tr>
            <td>Discount:</td>
            <td class="text-right">-${formatCurrency(summary.discountAmount)}</td>
          </tr>
        ` : ''}
        <tr class="total-row">
          <td><strong>Total:</strong></td>
          <td class="text-right"><strong>${formatCurrency(summary.total)}</strong></td>
        </tr>
      </table>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Printed on ${currentDate}</p>
      </div>
    </body>
    </html>
  `;
}

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}



export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}: OrderDetailsModalProps) {
  if (!order || !order._original) return null;

  const originalOrder = order._original;
  const orderSummary = calculateOrderSummary(originalOrder);
  const possibleStatuses = getNextPossibleStatuses(originalOrder);

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(order.orderNumber, newStatus);
    onClose();
  };

  const handlePrintOrder = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate print-optimized HTML
    const printContent = generatePrintHTML(originalOrder, orderSummary);

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNumber}</span>
            <div className="flex gap-2">
              <OrderStatusBadge status={originalOrder.status} />
              <PaymentStatusBadge status={originalOrder.payment_status} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {originalOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.total_price / 100)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.unit_price / 100)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderSummary.subtotal)}</span>
                </div>
                {orderSummary.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(orderSummary.taxAmount)}</span>
                  </div>
                )}
                {orderSummary.shippingAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(orderSummary.shippingAmount)}</span>
                  </div>
                )}
                {orderSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(orderSummary.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Order Info */}
          <div className="space-y-4">
            {/* Customer Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{originalOrder.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{originalOrder.customer.email}</span>
                </div>
                {originalOrder.customer.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{originalOrder.customer.phone_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  {originalOrder.shipping_address ? (
                    <div>
                      <div>{originalOrder.shipping_address.name}</div>
                      <div>{originalOrder.shipping_address.address_line_1}</div>
                      {originalOrder.shipping_address.address_line_2 && (
                        <div>{originalOrder.shipping_address.address_line_2}</div>
                      )}
                      <div>
                        {originalOrder.shipping_address.city}, {originalOrder.shipping_address.state} {originalOrder.shipping_address.postal_code}
                      </div>
                      <div>{originalOrder.shipping_address.country}</div>
                      {originalOrder.shipping_address.phone && (
                        <div className="mt-1 text-muted-foreground">
                          Phone: {originalOrder.shipping_address.phone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No shipping address provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Order Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(originalOrder.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Payment Method: {originalOrder.payment_method || 'Not specified'}
                  </span>
                </div>
                {originalOrder.tracking_number && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Tracking: {originalOrder.tracking_number}
                    </span>
                  </div>
                )}
                {originalOrder.notes && (
                  <div className="flex items-start gap-2">
                    <div className="h-4 w-4 text-muted-foreground mt-0.5">📝</div>
                    <span className="text-sm">
                      Notes: {originalOrder.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update */}
            {possibleStatuses.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="space-y-3">
                  <Select value={originalOrder.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={originalOrder.status}>
                        {originalOrder.status} (Current)
                      </SelectItem>
                      {possibleStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handlePrintOrder()}
                  >
                    Print Order
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
