'use client';

import { Ban, Eye, Filter, Search, Trash2, UserPlus } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { dataProvider } from '../../../lib/data';
import { cn } from '../../../lib/utils';
import { UserSummary } from '../../../types/domain';

/**
 * User management page
 */
export default function UserManagementPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const pageSize = 10;

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const result = await dataProvider.getUsers(
          currentPage,
          pageSize,
          searchTerm || undefined
        );
        setUsers(result.users);
        setTotalPages(result.totalPages);
        setTotalUsers(result.total);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
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

  const getStatusBadge = (user: UserSummary) => {
    if (!user.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }

    if (user.lastLogin) {
      const lastLogin = new Date(user.lastLogin);
      const daysSinceLogin = Math.floor(
        (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLogin <= 7) {
        return <Badge className="bg-green-600">Active</Badge>;
      } else if (daysSinceLogin <= 30) {
        return <Badge variant="secondary">Recent</Badge>;
      }
    }

    return <Badge variant="outline">Dormant</Badge>;
  };

  if (loading && users.length === 0) {
    return (
      <AdminPageLayout
        title="User Management"
        description="Manage user accounts and permissions"
      >
        <AdminSection>
          <TableSkeleton rows={10} />
        </AdminSection>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="User Management"
      description={`Manage user accounts and permissions (${totalUsers} total users)`}
      actions={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
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
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{user.orderCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(user.totalSpent)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <span className="text-sm">
                        {formatDate(user.lastLogin)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDate(user.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/admin/users/${user.id}`, '_blank')
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          user.isActive
                            ? 'text-orange-600 hover:text-orange-700'
                            : 'text-green-600 hover:text-green-700'
                        )}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers}{' '}
              users
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
      </AdminSection>
    </AdminPageLayout>
  );
}
