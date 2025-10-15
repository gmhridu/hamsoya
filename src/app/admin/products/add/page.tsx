/**
 * Add Product Page - Admin
 * Server-side rendered page for creating new products
 */

import { AddProductClient } from '@/components/admin/products/add-product-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Product - Hamsoya Admin | Create New Product',
  description: 'Add a new product to the catalog with images, pricing, and inventory information.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
        <p className="text-muted-foreground">
          Create a new product for your catalog with images, pricing, and inventory details.
        </p>
      </div>
      <AddProductClient />
    </div>
  );
}
