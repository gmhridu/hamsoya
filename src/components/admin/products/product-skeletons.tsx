import { Skeleton } from '@/components/admin/ui/skeleton'

// Product Details Skeleton
export const ProductDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Image skeleton */}
      <div className="lg:col-span-1">
        <Skeleton className="w-full aspect-square rounded-lg" />
      </div>

      {/* Product info skeleton */}
      <div className="lg:col-span-2 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>

    {/* Additional details skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>

    {/* Action buttons skeleton */}
    <div className="flex gap-4">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-32" />
    </div>
  </div>
)

// Product List Item Skeleton
export const ProductListItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg">
    <Skeleton className="h-16 w-16 rounded" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <div className="flex items-center space-x-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
)

// Product Form Skeleton
export const ProductFormSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full rounded" />

        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>

    <div className="flex gap-4">
      <Skeleton className="h-12 w-24" />
      <Skeleton className="h-12 w-24" />
    </div>
  </div>
)
