/**
 * Domain model type definitions
 */

/**
 * User summary for admin dashboard
 */
export interface UserSummary {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  orderCount: number;
  totalSpent: number;
  isActive: boolean;
}

/**
 * User detail for admin dashboard
 */
export interface UserDetail extends UserSummary {
  phone?: string;
  addresses: DeliveryAddress[];
  orders: OrderSummary[];
  notes?: string;
  preferences?: Record<string, unknown>;
}

/**
 * Delivery address
 */
export interface DeliveryAddress {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Order status enum
 */
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Order summary
 */
export interface OrderSummary {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: DeliveryAddress;
  paymentMethod: string;
  isPreOrder: boolean;
}

/**
 * Order detail
 */
export interface OrderDetail extends OrderSummary {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

/**
 * Order item
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

/**
 * Product
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  sku: string;
  isActive: boolean;
  isPremium: boolean;
  hasOffer: boolean;
  offerLabel?: string;
  isPreOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hero content
 */
export interface HeroContent {
  id: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Feedback
 */
export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isDisplayedOnHomepage: boolean;
  createdAt: string;
  updatedAt: string;
  productId?: string;
  orderId?: string;
}

/**
 * Shop controls
 */
export interface ShopControls {
  id: string;
  isPreOrderEnabled: boolean;
  isOfferEnabled: boolean;
  isPremiumCollectionEnabled: boolean;
  maintenanceMode: boolean;
  updatedAt: string;
  updatedBy: string;
}
