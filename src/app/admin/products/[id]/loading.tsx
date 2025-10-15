/**
 * Loading skeleton for admin product details page
 * Matches the actual ProductDetailsClient component structure
 */

import { ProductDetailsSkeleton } from '@/components/admin/products/product-skeletons';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-9 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      </div>
      <ProductDetailsSkeleton />
    </div>
  );
}
