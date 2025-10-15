/**
 * Edit Product Page - Admin
 * Server-side rendered page for editing existing products
 */

import { EditProductClient } from '@/components/admin/products/edit-product-client';
import type { Metadata } from 'next';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Edit Product - Hamsoya Admin | Product Management`,
    description: `Edit and update product details in the admin dashboard.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product information, images, pricing, and inventory details.
        </p>
      </div>
      <EditProductClient productId={id} />
    </div>
  );
}
