'use client';

import { Check, Eye, Filter, Home, Mail, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AdminPageLayout,
  AdminSection,
} from '../../../components/admin/layout/AdminPageLayout';
import { TableSkeleton } from '../../../components/admin/skeletons/AdminSkeletons';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
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
import { cn } from '../../../lib/utils';
import { Feedback } from '../../../types/domain';

/**
 * Feedback management page
 */
export default function FeedbackManagementPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFeedback, setTotalFeedback] = useState(0);

  const pageSize = 10;

  // Load feedback
  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const result = await dataProvider.getFeedback(
          currentPage,
          pageSize,
          approvalFilter === 'approved'
            ? true
            : approvalFilter === 'pending'
            ? false
            : undefined
        );
        setFeedback(result.feedback);
        setTotalPages(result.totalPages);
        setTotalFeedback(result.total);
      } catch (error) {
        console.error('Failed to load feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [currentPage, approvalFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  const handleApprove = async (id: string) => {
    try {
      // In a real implementation, this would call the API
      console.log('Approving feedback:', id);

      // Update local state for immediate UI feedback
      setFeedback(
        feedback.map((item) =>
          item.id === id ? { ...item, isApproved: true } : item
        )
      );
    } catch (error) {
      console.error('Failed to approve feedback:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      // In a real implementation, this would call the API
      console.log('Rejecting feedback:', id);

      // Update local state for immediate UI feedback
      setFeedback(
        feedback.map((item) =>
          item.id === id ? { ...item, isApproved: false } : item
        )
      );
    } catch (error) {
      console.error('Failed to reject feedback:', error);
    }
  };

  const handleToggleHomepage = async (id: string, currentValue: boolean) => {
    try {
      // In a real implementation, this would call the API
      console.log('Toggling homepage display:', id, !currentValue);

      // Update local state for immediate UI feedback
      setFeedback(
        feedback.map((item) =>
          item.id === id
            ? { ...item, isDisplayedOnHomepage: !currentValue }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to toggle homepage display:', error);
    }
  };

  const handleSendEmailRequest = async () => {
    try {
      // In a real implementation, this would call the API
      console.log('Sending feedback request emails');
      alert('Feedback request emails would be sent here');
    } catch (error) {
      console.error('Failed to send feedback request emails:', error);
    }
  };

  if (loading && feedback.length === 0) {
    return (
      <AdminPageLayout
        title="Feedback Management"
        description="Moderate customer feedback and reviews"
      >
        <AdminSection>
          <TableSkeleton rows={10} />
        </AdminSection>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Feedback Management"
      description={`Moderate customer feedback and reviews (${totalFeedback} total)`}
      actions={
        <Button onClick={handleSendEmailRequest}>
          <Mail className="mr-2 h-4 w-4" />
          Send Feedback Requests
        </Button>
      }
    >
      <AdminSection>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feedback</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Feedback Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.userEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRatingStars(item.rating)}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.comment}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDate(item.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={item.isApproved ? 'default' : 'secondary'}
                      >
                        {item.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      {item.isDisplayedOnHomepage && (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800"
                        >
                          Homepage
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {!item.isApproved ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(item.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          item.isDisplayedOnHomepage
                            ? 'text-blue-600 hover:text-blue-700'
                            : 'text-gray-600 hover:text-gray-700'
                        )}
                        onClick={() =>
                          handleToggleHomepage(
                            item.id,
                            item.isDisplayedOnHomepage
                          )
                        }
                      >
                        <Home className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
              {Math.min(currentPage * pageSize, totalFeedback)} of{' '}
              {totalFeedback} feedback items
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {feedback.filter((f) => f.isApproved).length}
            </div>
            <div className="text-sm text-gray-500">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {feedback.filter((f) => !f.isApproved).length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {feedback.filter((f) => f.isDisplayedOnHomepage).length}
            </div>
            <div className="text-sm text-gray-500">On Homepage</div>
          </div>
        </div>
      </AdminSection>
    </AdminPageLayout>
  );
}
