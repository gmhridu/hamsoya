'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from './product-form';
import { useCreateProduct } from '@/hooks/use-admin-mutations';
import { CreateProductData } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function AddProductClient() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();

  const handleSubmit = async (data: any) => {
    try {
      await createProductMutation.mutateAsync(data);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Product Form */}
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createProductMutation.isPending}
        submitButtonText="Create Product"
      />
    </div>
  );
}
