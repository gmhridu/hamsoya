'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from './product-form';
import { useUpdateProduct } from '@/hooks/use-admin-mutations';
import { useAdminProduct } from '@/hooks/use-admin-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface EditProductClientProps {
  productId: string;
}

export function EditProductClient({ productId }: EditProductClientProps) {
  const router = useRouter();
  const updateProductMutation = useUpdateProduct();

  // Fetch product data
  const {
    data: productResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useAdminProduct(productId);

  const product = (productResponse as any)?.data;

  const handleSubmit = async (data: any) => {
    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        ...data,
      });
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  const handleViewDetails = () => {
    router.push(`/admin/products/${productId}`);
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>

        {/* Form Skeleton */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        {/* Error Card */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Failed to Load Product</h3>
              <p className="text-muted-foreground">
                {error?.message || 'Unable to load product details. Please try again.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleCancel}>
                Back to Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <Button
          variant="outline"
          onClick={handleViewDetails}
          className="cursor-pointer"
        >
          View Details
        </Button>
      </div>

      {/* Product Form */}
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={updateProductMutation.isPending}
        submitButtonText="Update Product"
      />
    </div>
  );
}
