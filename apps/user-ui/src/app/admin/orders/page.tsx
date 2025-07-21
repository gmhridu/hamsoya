'use client';

import { Download, Eye, Filter, Package, Search, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  AdminPageLayout,
  AdminSection,
} from '../../../components/admin/layout/AdminPageLayout';
import { TableSkeleton } from '../../../components/admin/skeletons/AdminSkeletons';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { dataProvider } from '../../../lib/data';
import { OrderStatus, OrderSummary } from '../../../types/domain';

/**
 * Orders management page
 */
export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const pageSize = 10;

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const result = await dataProvider.getOrders(
          currentPage,
          pageSize,
          statusFilter === 'all' ? undefined : statusFilter,
          searchTerm || undefined
        );
        setOrders(result.orders);
        setTotalPages(result.totalPages);
        setTotalOrders(result.total);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentPage, statusFilter, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleExport = () => {
    // In a real implementation, this would trigger a CSV/Excel export
    console.log('Exporting orders...');
    alert('Export functionality would be implemented here');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: {
        variant: 'secondary' as const,
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800',
      },
      [OrderStatus.PROCESSING]: {
        variant: 'default' as const,
        label: 'Processing',
        className: 'bg-blue-100 text-blue-800',
      },
      [OrderStatus.SHIPPED]: {
        variant: 'default' as const,
        label: 'Shipped',
        className: 'bg-purple-100 text-purple-800',
      },
      [OrderStatus.DELIVERED]: {
        variant: 'default' as const,
        label: 'Delivered',
        className: 'bg-green-100 text-green-800',
      },
      [OrderStatus.CANCELLED]: {
        variant: 'destructive' as const,
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800',
      },
      [OrderStatus.REFUNDED]: {
        variant: 'outline' as const,
        label: 'Refunded',
        className: 'bg-gray-100 text-gray-800',
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.SHIPPED:
        return <Truck className="h-4 w-4" />;
      case OrderStatus.DELIVERED:
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <AdminPageLayout
        title="Orders Management"
        description="Manage customer orders and fulfillment"
      >
        <AdminSection>
          <TableSkeleton rows={10} />
        </AdminSection>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Orders Management"
      description={`Manage customer orders and fulfillment (${totalOrders} total orders)`}
      actions={
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      }
    >
      <AdminSection>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders by number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as OrderStatus | 'all')
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
              <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
              <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
              <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={OrderStatus.REFUNDED}>Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Orders Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        {order.isPreOrder && (
                          <Badge variant="outline" className="text-xs">
                            Pre-order
                          </Badge>
                        )}
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.shippingAddress.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      {getOrderStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{order.itemCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                      {order.updatedAt !== order.createdAt && (
                        <div className="text-xs text-gray-500">
                          Updated {formatDate(order.updatedAt)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/admin/orders/${order.id}`, '_blank')
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === OrderStatus.PROCESSING && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalOrders)} of {totalOrders}{' '}
              orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.status === OrderStatus.PENDING).length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.status === OrderStatus.PROCESSING).length}
            </div>
            <div className="text-sm text-gray-500">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.status === OrderStatus.SHIPPED).length}
            </div>
            <div className="text-sm text-gray-500">Shipped</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter((o) => o.status === OrderStatus.DELIVERED).length}
            </div>
            <div className="text-sm text-gray-500">Delivered</div>
          </div>
        </div>
      </AdminSection>
    </AdminPageLayout>
  );
}
