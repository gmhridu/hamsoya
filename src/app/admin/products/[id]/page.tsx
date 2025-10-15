/**
 * Product Details Page - Admin
 * Server-side rendered page for viewing product details
 */

import { ProductDetailsClient } from '@/components/admin/products/product-details-client';
import { apiClient } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await apiClient.getAdminProduct(id) as any;
    const product = response?.data;

    return {
      title: `${product?.name || 'Product'} - Hamsoya Admin | Product Details`,
      description: `View and manage details for ${product?.name || 'product'} in the admin dashboard.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found - Hamsoya Admin',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { id } = await params;

  // Fetch product data on server-side for SSR
  let product = null;
  let error = null;

  try {
    const response = await apiClient.getAdminProduct(id) as any;
    product = response?.data;

    if (!product) {
      notFound();
    }
  } catch (err) {
    console.error('Failed to fetch product:', err);
    error = err;
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
        <p className="text-muted-foreground">
          View and manage product information, inventory, and settings.
        </p>
      </div>
      <ProductDetailsClient initialProduct={product} productId={id} />
    </div>
  );
}
