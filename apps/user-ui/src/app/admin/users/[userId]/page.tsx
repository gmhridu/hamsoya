'use client';

import {
  ArrowLeft,
  Ban,
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AdminGrid,
  AdminPageLayout,
  AdminSection,
} from '../../../../components/admin/layout/AdminPageLayout';
import { FormSkeleton } from '../../../../components/admin/skeletons/AdminSkeletons';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';
import { dataProvider } from '../../../../lib/data';
import { cn } from '../../../../lib/utils';
import { OrderStatus, UserDetail } from '../../../../types/domain';

/**
 * User detail page
 */
export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user details
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const userData = await dataProvider.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: {
        variant: 'secondary' as const,
        label: 'Pending',
      },
      [OrderStatus.PROCESSING]: {
        variant: 'default' as const,
        label: 'Processing',
      },
      [OrderStatus.SHIPPED]: { variant: 'default' as const, label: 'Shipped' },
      [OrderStatus.DELIVERED]: {
        variant: 'default' as const,
        label: 'Delivered',
      },
      [OrderStatus.CANCELLED]: {
        variant: 'destructive' as const,
        label: 'Cancelled',
      },
      [OrderStatus.REFUNDED]: {
        variant: 'outline' as const,
        label: 'Refunded',
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <AdminPageLayout
        title="User Details"
        description="Loading user information..."
      >
        <AdminSection>
          <FormSkeleton />
        </AdminSection>
      </AdminPageLayout>
    );
  }

  if (!user) {
    return (
      <AdminPageLayout
        title="User Not Found"
        description="The requested user could not be found"
      >
        <AdminSection>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              User not found
            </h3>
            <p className="text-gray-500 mb-4">
              The user you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </AdminSection>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={user.name}
      description={`User details and order history`}
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            className={cn(
              user.isActive
                ? 'text-orange-600 hover:text-orange-700'
                : 'text-green-600 hover:text-green-700'
            )}
          >
            <Ban className="mr-2 h-4 w-4" />
            {user.isActive ? 'Block User' : 'Unblock User'}
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      }
    >
      {/* User Overview */}
      <AdminGrid columns={3}>
        <AdminSection title="User Information">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
            {user.lastLogin && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Last login {formatDate(user.lastLogin)}
                </span>
              </div>
            )}
            <div className="pt-2">
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </AdminSection>

        <AdminSection title="Order Statistics">
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {user.orderCount}
              </div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(user.totalSpent)}
              </div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {user.orderCount > 0
                  ? formatCurrency(user.totalSpent / user.orderCount)
                  : '$0.00'}
              </div>
              <div className="text-sm text-gray-500">Average Order Value</div>
            </div>
          </div>
        </AdminSection>

        <AdminSection title="Account Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Status</span>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? 'Active' : 'Blocked'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Verified</span>
              <Badge variant="default">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Phone Verified</span>
              <Badge variant="secondary">Not Verified</Badge>
            </div>
          </div>
        </AdminSection>
      </AdminGrid>

      {/* Delivery Addresses */}
      {user.addresses && user.addresses.length > 0 && (
        <AdminSection title="Delivery Addresses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{address.name}</h4>
                  {address.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div>
                      <div>{address.street}</div>
                      <div>
                        {address.city}, {address.state} {address.zipCode}
                      </div>
                      <div>{address.country}</div>
                    </div>
                  </div>
                  {address.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{address.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AdminSection>
      )}

      {/* Order History */}
      <AdminSection title="Order History">
        {user.orders && user.orders.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {order.isPreOrder && (
                            <Badge variant="outline" className="text-xs mr-1">
                              Pre-order
                            </Badge>
                          )}
                          {order.paymentMethod}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{order.itemCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500">
              This user hasn&apos;t placed any orders.
            </p>
          </div>
        )}
      </AdminSection>

      {/* Notes */}
      {user.notes && (
        <AdminSection title="Admin Notes">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">{user.notes}</p>
          </div>
        </AdminSection>
      )}
    </AdminPageLayout>
  );
}
