'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/admin/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomerDetailsModal } from './customer-details-modal';
import { CustomerTableSkeleton, CustomerEmptyState } from '@/components/admin/ui/skeleton';

import { useAdminCustomers } from '@/hooks/use-admin-data';
import { useUpdateCustomer } from '@/hooks/use-admin-mutations';
import { toast } from 'sonner';
import {
  Eye,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Mail,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { CustomerStatusBadge } from './customer-actions';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

interface EmailData {
  subject: string;
  message: string;
}

export function CustomersManagement() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Fetch customers with filters
  const {
    data: customersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminCustomers({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const updateCustomerMutation = useUpdateCustomer();

  const customers = (customersResponse as any)?.data || [];
  const pagination = (customersResponse as any)?.pagination;

  const handleStatusUpdate = async (customerId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await updateCustomerMutation.mutateAsync({
        id: customerId,
        status: newStatus,
      });
      toast.success(`Customer ${newStatus === 'suspended' ? 'blocked' : 'unblocked'} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update customer status');
    }
  };

  const handleSendEmail = async (customerId: string, emailData: EmailData) => {
    // For now, we'll use mailto link as a fallback
    const customer = customers.find((c: any) => c.id === customerId);
    if (customer) {
      const subject = encodeURIComponent(emailData.subject);
      const body = encodeURIComponent(emailData.message);
      const mailtoUrl = `mailto:${customer.email}?subject=${subject}&body=${body}`;
      window.open(mailtoUrl, '_blank');
      toast.success('Email client opened');
    }
  };

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleRefresh = () => {
    refetch();
  };

  const customerColumns = useMemo(() => [
    {
      key: 'customer',
      title: 'Customer',
      sortable: true,
      render: (_: any, customer: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={customer.avatar} />
            <AvatarFallback>
              {customer.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.name || 'Unknown User'}</div>
            <div className="text-sm text-muted-foreground">{customer.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'id',
      title: 'Customer ID',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'phone_number',
      title: 'Phone',
      render: (value: string) => (
        <span className="text-sm">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'orders_count',
      title: 'Orders',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value || 0}</span>
      ),
    },
    {
      key: 'total_spent',
      title: 'Total Spent',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">৳{(value || 0).toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string, customer: any) => (
        <div className="flex items-center gap-2">
          <CustomerStatusBadge status={value as any} />
          {customer.is_verified && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              Verified
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'registration_date',
      title: 'Join Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, customer: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleViewCustomer(customer.id)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSendEmail(customer.id, { subject: '', message: '' })}
              className="cursor-pointer"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            {customer.status === 'active' ? (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(customer.id, 'suspended')}
                className="text-destructive cursor-pointer"
              >
                <UserX className="mr-2 h-4 w-4" />
                Block User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(customer.id, 'active')}
                className="text-green-600 cursor-pointer"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Unblock User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">Customers</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none min-h-[44px] cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 cursor-pointer">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CustomerTableSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">Customers</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex-1 sm:flex-none min-h-[44px] cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Retry</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to Load Customers</h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'Unable to fetch customer data. Please try again.'}
            </p>
            <Button onClick={handleRefresh} variant="outline" className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">
              Customers {pagination?.total ? `(${pagination.total})` : ''}
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="cursor-pointer"
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none min-h-[44px] cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Filters - Responsive layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 cursor-pointer">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customers Table or Empty State */}
          {customers.length === 0 ? (
            <CustomerEmptyState />
          ) : (
            <DataTable
              data={customers}
              columns={customerColumns}
              searchable={false}
              emptyMessage="No customers found"
              keyField="id"
            />
          )}
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      {selectedCustomerId && (
        <CustomerDetailsModal
          customerId={selectedCustomerId}
          isOpen={!!selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </>
  );
}
