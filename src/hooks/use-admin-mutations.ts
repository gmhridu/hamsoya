/**
 * Admin Mutation Hooks
 * Provides mutation hooks for admin operations with optimistic updates and error handling
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { toastService } from '@/lib/toast-service';
import { useAuthStore } from '@/store/auth-store';
import type {
  CreateProductData,
  UpdateProductData,
  CreateCategoryData,
  UpdateCategoryData,
  UpdateCustomerData,
  AdminSettings
} from '@/types/admin';

// Order Status Update Mutation
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.updateAdminOrderStatusEnhanced(id, status, notes);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toast.success('Order status updated', {
        description: `Order status changed to ${variables.status}`,
      });
    },
    onError: (error: any) => {
      toast.error('Failed to update order status', {
        description: error?.message || 'Please try again.',
        action: {
          label: 'Retry',
          onClick: () => {
            // Could implement retry logic here
          },
        },
      });
    },
  });
}

// Product Creation Mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async (productData: CreateProductData) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.createAdminProductEnhanced(productData);
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Product created successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to create product. Please try again.'
      );
    },
  });
}

// Product Update Mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async ({ id, ...productData }: UpdateProductData) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.updateAdminProductEnhanced(id, productData);
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Product updated successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to update product. Please try again.'
      );
    },
  });
}

// Product Deletion Mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.deleteAdminProductEnhanced(id);
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to delete product. Please try again.'
      );
    },
  });
}

// Category Creation Mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async (categoryData: CreateCategoryData) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.createAdminCategoryEnhanced(categoryData);
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Category created successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to create category. Please try again.'
      );
    },
  });
}

// Category Update Mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async ({ id, ...categoryData }: UpdateCategoryData) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.updateAdminCategoryEnhanced(id, categoryData);
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Category updated successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to update category. Please try again.'
      );
    },
  });
}

// Category Deletion Mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.deleteAdminCategoryEnhanced(id);
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to delete category. Please try again.'
      );
    },
  });
}

// Customer Update Mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async ({ id, ...customerData }: { id: string } & UpdateCustomerData) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.updateAdminCustomerEnhanced(id, customerData);
    },
    onSuccess: () => {
      // Invalidate and refetch customers
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Customer updated successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to update customer. Please try again.'
      );
    },
  });
}

// Customer Deletion Mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.deleteAdminCustomerEnhanced(id);
    },
    onSuccess: () => {
      // Invalidate and refetch customers
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });

      toastService.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to delete customer. Please try again.'
      );
    },
  });
}

// Settings Update Mutation
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async (settingsData: Partial<AdminSettings>) => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.updateAdminSettingsEnhanced(settingsData);
    },
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });

      toastService.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to update settings. Please try again.'
      );
    },
  });
}

// Settings Reset Mutation
export function useResetSettings() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return useMutation({
    mutationFn: async () => {
      if (!isAdmin) {
        throw new Error('Admin access required');
      }
      return apiClient.resetAdminSettingsEnhanced();
    },
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });

      toastService.success('Settings reset to defaults successfully');
    },
    onError: (error: any) => {
      toastService.error(
        error?.message || 'Failed to reset settings. Please try again.'
      );
    },
  });
}
