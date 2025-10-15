export interface AdminDashboardStats {
  users: {
    total_users: number;
    verified_users: number;
    unverified_users: number;
    users_this_month: number;
    users_growth_rate: number;
  };
  products: {
    total_products: number;
    active_products: number;
    inactive_products: number;
    featured_products: number;
    out_of_stock_products: number;
    low_stock_products: number;
    products_this_month: number;
    products_growth_rate: number;
    average_product_price: number;
  };
  categories: {
    total_categories: number;
    active_categories: number;
    inactive_categories: number;
    categories_this_month: number;
    categories_growth_rate: number;
    average_products_per_category: number;
  };
  orders: {
    total_orders: number;
    pending_orders: number;
    confirmed_orders: number;
    processing_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_this_month: number;
    orders_growth_rate: number;
    revenue_this_month: number;
    revenue_growth_rate: number;
  };
  overview: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_products: number;
    revenue_growth: number;
    order_growth: number;
    customer_growth: number;
    product_growth: number;
  };
}

export interface AdminDashboardOverview {
  recentUsers: AdminCustomer[];
  topProducts: AdminProduct[];
  recentOrders: AdminOrder[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  profile_image_url?: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string;
  days_since_registration?: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  cost_price?: number;
  sku?: string;
  stock_quantity: number;
  low_stock_threshold?: number;
  category_id?: string;
  category_name?: string;
  images: string[];
  featured: boolean;
  is_active: boolean;
  in_stock: boolean;
  weight?: number;
  dimensions?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  sales_count: number;
  revenue: number;
  average_rating?: number;
  review_count?: number;
  total_revenue?: number;
  last_sold_date?: string;
  days_since_created?: number;
  is_low_stock?: boolean;
  origin?: string;
  benefits?: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone_number?: string;
  };
  items: AdminOrderItem[];
  items_count: number;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'cod' | 'card' | 'mobile_banking';
  shipping_address: {
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  days_since_created?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    images: string[];
    slug?: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  is_active: boolean;
  product_count?: number;
  active_product_count?: number;
  featured_product_count?: number;
  days_since_created?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
  message?: string;
  timestamp: string;
}

export interface BackendPaginatedData<T> {
  products: T[];
  pagination: PaginationInfo;
}

export interface BackendPaginatedResponse<T> {
  success: boolean;
  data: BackendPaginatedData<T>;
  message?: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface AdminProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  featured?: boolean;
  in_stock?: boolean;
  is_active?: boolean;
  low_stock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminOrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminCustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  verified?: boolean;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  cost_price?: number;
  sku?: string;
  stock_quantity: number;
  low_stock_threshold?: number;
  category_id?: string;
  images: string[];
  featured?: boolean;
  is_active?: boolean;
  weight?: number;
  dimensions?: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CreateOrderData {
  user_id: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
  shipping_address: {
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: 'cod' | 'card' | 'mobile_banking';
  notes?: string;
}

export interface UpdateOrderData {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  slug?: string;
  image?: string;
  is_active?: boolean;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone_number?: string;
  profile_image_url?: string;
  role?: 'USER' | 'SELLER' | 'ADMIN';
  is_verified?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface AdminSettings {
  site_name?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  currency?: string;
  timezone?: string;
  maintenance_mode?: boolean;
  allow_registration?: boolean;
  require_email_verification?: boolean;
  max_upload_size?: number;
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_password?: string;
  payment_gateways?: string[];
  shipping_methods?: string[];
  tax_rate?: number;
  default_language?: string;
  analytics_tracking_id?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface AdminStats {
  dashboard: AdminDashboardStats;
  overview: AdminDashboardOverview;
}

export interface AdminPermission {
  resource: string;
  action: string;
  granted: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  profile_image_url?: string;
  avatar?: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  is_verified: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  permissions?: AdminPermission[];
  orders_count?: number;
  total_spent?: number;
  registration_date?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface OptimisticUpdate<T> {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: T;
  originalData?: T;
  timestamp: number;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export interface CacheInvalidationEvent {
  type: 'invalidate' | 'update' | 'delete';
  resource: 'products' | 'orders' | 'customers' | 'dashboard' | 'categories';
  id?: string;
  data?: any;
  timestamp: number;
}

export interface RealTimeEvent {
  type: 'order_created' | 'order_updated' | 'product_updated' | 'customer_registered' | 'stats_updated';
  data: any;
  timestamp: number;
}

export interface OrderWithDetails extends AdminOrder {
  details?: any;
}
