import { Badge } from '@/components/ui/badge'

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const variants = {
    [OrderStatus.PENDING]: 'secondary',
    [OrderStatus.PROCESSING]: 'default',
    [OrderStatus.SHIPPED]: 'outline',
    [OrderStatus.DELIVERED]: 'default',
    [OrderStatus.CANCELLED]: 'destructive',
    [OrderStatus.REFUNDED]: 'destructive'
  } as const

  const labels = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.PROCESSING]: 'Processing',
    [OrderStatus.SHIPPED]: 'Shipped',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
    [OrderStatus.REFUNDED]: 'Refunded'
  }

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  )
}

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const variants = {
    [PaymentStatus.PENDING]: 'secondary',
    [PaymentStatus.PAID]: 'default',
    [PaymentStatus.FAILED]: 'destructive',
    [PaymentStatus.REFUNDED]: 'outline'
  } as const

  const labels = {
    [PaymentStatus.PENDING]: 'Pending',
    [PaymentStatus.PAID]: 'Paid',
    [PaymentStatus.FAILED]: 'Failed',
    [PaymentStatus.REFUNDED]: 'Refunded'
  }

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  )
}
