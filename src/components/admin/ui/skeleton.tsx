import { cn } from "@/lib/utils"

// Base Skeleton Component
const Skeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("animate-pulse rounded-md bg-muted", className)}
    {...props}
  />
)

export { Skeleton }

// Customer Table Skeleton
export const CustomerTableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-8 w-[100px]" />
      </div>
    ))}
  </div>
)

// Order Details Skeleton
export const OrderDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-6 w-[150px]" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  </div>
)

// Metric Card Skeleton
export const MetricCardSkeleton = () => (
  <div className="p-6 border rounded-lg">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-6 w-[150px]" />
      </div>
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
)

// Customer Empty State Component
export const CustomerEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
      <svg
        className="w-8 h-8 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
    <p className="text-muted-foreground max-w-sm">
      There are no customers registered in the system yet. New customers will appear here once they register.
    </p>
  </div>
)
