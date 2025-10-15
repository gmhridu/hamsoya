// Simple API client for making requests to the Next.js API routes

import { API_CONFIG, urlBuilder } from './api-config';

const API_BASE_URL = '/api';

// Custom error class for API errors
export class ApiError extends Error {
  public statusCode?: number;
  public errorCode?: string;
  public userFriendly: boolean;

  constructor(
    message: string,
    options?: { statusCode?: number; errorCode?: string; userFriendly?: boolean }
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.errorCode = options?.errorCode;
    this.userFriendly = options?.userFriendly ?? false;
  }
}

// Helper function to get user-friendly error messages
function getUserFriendlyErrorMessage(status: number, errorData: any): string {
  // Priority order for extracting error messages:
  // 1. Specific backend error from details.error (most specific)
  // 2. Main error message from error field
  // 3. Legacy message field
  // 4. Fallback to status code mapping

  // Check for specific backend error in details
  if (errorData.details?.error && typeof errorData.details.error === 'string') {
    return errorData.details.error;
  }

  // Check for main error message
  if (
    errorData.error &&
    typeof errorData.error === 'string' &&
    !errorData.error.includes('HTTP error!')
  ) {
    return errorData.error;
  }

  // Check for legacy message field
  if (
    errorData.message &&
    typeof errorData.message === 'string' &&
    !errorData.message.includes('HTTP error!')
  ) {
    return errorData.message;
  }

  // Map status codes to user-friendly messages as fallback
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'You need to log in to access this feature.';
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return 'This email address is not registered. Please check your email or create a new account.';
    case 409:
      return 'This action conflicts with existing data. Please refresh and try again.';
    case 422:
      return 'The provided data is invalid. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'Something went wrong. Please try again later.';
  }
}

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAccessToken(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; accessToken=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();

      // Check if token is expired and clean it up
      if (cookieValue) {
        try {
          const payload = JSON.parse(atob(cookieValue.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);

          // If token is expired, remove it and return null
          if (payload.exp && payload.exp < now) {
            // Use enhanced cookie deletion
            this.deleteAccessTokenCookie();
            return null;
          }
        } catch (error) {
          // If token is malformed, remove it
          this.deleteAccessTokenCookie();
          return null;
        }
      }

      return cookieValue || null;
    }

    return null;
  }

  /**
   * Enhanced cookie deletion for access tokens
   */
  private deleteAccessTokenCookie(): void {
    if (typeof document === 'undefined') return;

    const isSecure = window.location.protocol === 'https:' || process.env.NODE_ENV === 'production';
    const secureAttr = isSecure ? '; Secure' : '';

    // Try multiple deletion approaches for maximum compatibility
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${secureAttr}`;
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secureAttr}`;
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${secureAttr}`;
  }

  private async refreshTokens(): Promise<boolean> {
    try {
      // Call the refresh token endpoint
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'same-origin', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Token refresh successful
        return true;
      } else {
        // Token refresh failed
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get access token from cookie for Authorization header
    const accessToken = this.getAccessToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      credentials: 'same-origin', // Include cookies for same-origin requests
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 errors with automatic token refresh
      if (
        response.status === 401 &&
        !endpoint.includes('/auth/refresh-token') &&
        !endpoint.includes('/auth/login')
      ) {
        const refreshSuccess = await this.refreshTokens();

        if (refreshSuccess) {
          // Update config with new access token for retry
          const newAccessToken = this.getAccessToken();
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              ...(newAccessToken && { Authorization: `Bearer ${newAccessToken}` }),
            },
          };

          // Retry original request after successful token refresh
          const retryResponse = await fetch(url, retryConfig);

          if (retryResponse.ok) {
            return await retryResponse.json();
          }

          // If retry still fails, handle the error
          const errorData = await retryResponse.json().catch(() => ({}));
          const userFriendlyMessage = getUserFriendlyErrorMessage(retryResponse.status, errorData);

          throw new ApiError(userFriendlyMessage, {
            statusCode: retryResponse.status,
            errorCode: errorData.errorCode || errorData.details?.errorCode,
            userFriendly: true,
          });
        } else {
          // Refresh failed, user needs to login again
          if (typeof window !== 'undefined') {
            const { authStore } = await import('@/store/auth-store');
            authStore.logout();
            window.location.href = '/login';
          }

          throw new ApiError('Session expired. Please login again.', {
            statusCode: 401,
            errorCode: 'SESSION_EXPIRED',
            userFriendly: true,
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const userFriendlyMessage = getUserFriendlyErrorMessage(response.status, errorData);

        // Error details available for debugging in development
        if (process.env.NODE_ENV === 'development') {
          // Only log in development mode
        }

        throw new ApiError(userFriendlyMessage, {
          statusCode: response.status,
          errorCode: errorData.errorCode || errorData.details?.errorCode,
          userFriendly: true,
        });
      }

      return await response.json();
    } catch (error) {
      // If it's already an ApiError, re-throw it
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your internet connection.', {
          errorCode: 'NETWORK_ERROR',
          userFriendly: true,
        });
      }

      // Handle other unexpected errors
      throw new ApiError('An unexpected error occurred. Please try again.', {
        errorCode: 'UNKNOWN_ERROR',
        userFriendly: true,
      });
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Products API
  async getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';

    return this.get(endpoint);
  }

  async getProduct(id: string) {
    return this.get(`/products/${id}`);
  }

  async getFeaturedProducts(limit?: number) {
    const params = limit ? `?featured=true&limit=${limit}` : '?featured=true';
    return this.get(`/products${params}`);
  }

  async getProductsByCategory(category: string, limit?: number) {
    const params = limit ? `?category=${category}&limit=${limit}` : `?category=${category}`;
    return this.get(`/products${params}`);
  }

  async searchProducts(query: string, limit?: number) {
    const params = limit
      ? `?search=${encodeURIComponent(query)}&limit=${limit}`
      : `?search=${encodeURIComponent(query)}`;
    return this.get(`/products${params}`);
  }

  // Categories API
  async getCategories() {
    return this.get('/categories');
  }

  async getCategory(slug: string) {
    return this.get(`/categories/${slug}`);
  }

  // Authentication API (placeholder for future implementation)
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'SELLER' | 'ADMIN';
    phone_number?: string;
    profile_image_url?: string;
  }) {
    return this.post('/auth/register', data);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async refreshToken() {
    return this.post('/auth/refresh-token');
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  async verifyEmail(email: string, otp: string) {
    return this.post('/auth/verify', { email, otp });
  }

  async resendVerification(email: string) {
    return this.post('/auth/resend-verification', { email });
  }

  // Forgot Password API methods
  async forgotPassword(email: string) {
    return this.post('/auth/forgot-password', { email });
  }

  async verifyForgotPasswordOTP(email: string, otp: string) {
    return this.post('/auth/verify-forgot-password', { email, otp });
  }

  async verifyForgotPasswordOTPEnhanced(email: string, otp: string) {
    return this.post('/auth/verify-forgot-password-enhanced', { email, otp });
  }

  async checkPasswordResetVerification(email: string) {
    return this.post('/auth/check-password-reset-verification', { email });
  }

  async resetPassword(email: string, password: string) {
    return this.post('/auth/reset-password', { email, password });
  }

  async getCooldownStatus(email: string) {
    return this.get(`/auth/cooldown-status?email=${encodeURIComponent(email)}`);
  }

  // Backward compatibility method using POST
  async getCooldownStatusPost(email: string) {
    return this.post('/auth/cooldown-status', { email });
  }

  // Admin API methods
  // Dashboard
  async getAdminDashboardStats(timeRange?: string) {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return this.get(`/admin/dashboard/stats${params}`);
  }

  async getAdminDashboardOverview() {
    return this.get('/admin/dashboard/overview');
  }

  // Orders
  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return this.get(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminRecentOrders() {
    return this.get('/admin/orders/recent');
  }

  async getAdminOrderStats() {
    return this.get('/admin/orders/stats');
  }

  async getAdminOrder(id: string) {
    return this.get(`/admin/orders/${id}`);
  }

  async updateAdminOrderStatus(id: string, status: string) {
    return this.put(`/admin/orders/${id}/status`, { status });
  }

  async cancelAdminOrder(id: string) {
    return this.delete(`/admin/orders/${id}`);
  }

  // Customers
  async getAdminCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    verified?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return this.get(`/admin/customers${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminRecentCustomers() {
    return this.get('/admin/customers/recent');
  }

  async getAdminCustomerStats() {
    return this.get('/admin/customers/stats');
  }

  async getAdminCustomer(id: string) {
    return this.get(`/admin/customers/${id}`);
  }

  async updateAdminCustomer(id: string, data: any) {
    return this.put(`/admin/customers/${id}`, data);
  }

  async deleteAdminCustomer(id: string) {
    return this.delete(`/admin/customers/${id}`);
  }

  // Products
  async getAdminProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: string;
    inStock?: string;
    active?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return this.get(`/admin/products${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminTopProducts() {
    return this.get('/admin/products/top');
  }

  async createAdminProduct(data: any) {
    return this.post('/admin/products', data);
  }

  async getAdminProduct(id: string) {
    return this.get(`/admin/products/${id}`);
  }

  async updateAdminProduct(id: string, data: any) {
    return this.put(`/admin/products/${id}`, data);
  }

  async updateAdminProductFeatured(id: string, featured: boolean) {
    return this.put(`/admin/products/${id}/featured`, { featured });
  }

  async updateAdminProductStock(id: string, stock_quantity: number, in_stock?: boolean) {
    return this.put(`/admin/products/${id}/stock`, { stock_quantity, in_stock });
  }

  async deleteAdminProduct(id: string) {
    return this.delete(`/admin/products/${id}`);
  }

  // Categories
  async getAdminCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    active?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return this.get(`/admin/categories${queryString ? `?${queryString}` : ''}`);
  }

  async getAllAdminCategories() {
    return this.get('/admin/categories/all');
  }

  async createAdminCategory(data: any) {
    return this.post('/admin/categories', data);
  }

  async getAdminCategory(id: string) {
    return this.get(`/admin/categories/${id}`);
  }

  async updateAdminCategory(id: string, data: any) {
    return this.put(`/admin/categories/${id}`, data);
  }

  async deleteAdminCategory(id: string) {
    return this.delete(`/admin/categories/${id}`);
  }

  async getAdminCategoryProducts(id: string) {
    return this.get(`/admin/categories/${id}/products`);
  }

  // Settings
  async getAdminSettings() {
    return this.get('/admin/settings');
  }

  async updateAdminSettings(data: any) {
    return this.put('/admin/settings', data);
  }

  async getAdminPublicSettings() {
    return this.get('/admin/settings/public');
  }

  async resetAdminSettings() {
    return this.post('/admin/settings/reset');
  }

  async getAdminSettingsBackup() {
    return this.get('/admin/settings/backup');
  }

  async restoreAdminSettings(data: any) {
    return this.post('/admin/settings/restore', data);
  }

  // Logs
  async getAdminLogs(params?: {
    page?: number;
    limit?: number;
    level?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return this.get(`/admin/logs${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminLogStats() {
    return this.get('/admin/logs/stats');
  }

  async getAdminRecentLogs() {
    return this.get('/admin/logs/recent');
  }

  async getAdminErrorLogs(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    return this.get(`/admin/logs/errors${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminEmailPerformanceLogs() {
    return this.get('/admin/logs/email-performance');
  }

  async clearAdminLogs(data: { olderThan: string; level?: string }) {
    return this.post('/admin/logs/clear', data);
  }

  // Email Performance
  async getAdminEmailPerformanceStats(timeRange?: string) {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return this.get(`/admin/email-performance/stats${params}`);
  }

  async getAdminEmailPerformanceReport(timeRange?: string) {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    return this.get(`/admin/email-performance/report${params}`);
  }

  async getAdminEmailPerformanceStatus() {
    return this.get('/admin/email-performance/status');
  }

  async getAdminEmailPerformanceHealth() {
    return this.get('/admin/email-performance/health');
  }

  // Enhanced Admin API Methods with Error Handling

  // Dashboard Methods
  async getAdminDashboardStatsEnhanced(timeRange?: string) {
    try {
      const params = timeRange ? `?timeRange=${timeRange}` : '';
      return await this.get(`/admin/dashboard/stats${params}`);
    } catch (error) {
      return {
        success: true,
        data: {
          totalSales: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalProducts: 0,
          verifiedCustomers: 0,
          activeProducts: 0,
          featuredProducts: 0,
          totalCategories: 0,
          salesGrowth: 0,
          ordersGrowth: 0,
          customersGrowth: 0,
          productsGrowth: 0,
          timeRange: parseInt(timeRange || '30', 10),
        },
        message: 'Dashboard statistics (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getAdminDashboardOverviewEnhanced() {
    try {
      return await this.get('/admin/dashboard/overview');
    } catch (error) {
      return {
        success: true,
        data: {
          recentUsers: [],
          topProducts: [],
          recentOrders: [],
        },
        message: 'Dashboard overview (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Orders Methods
  async getAdminOrdersEnhanced(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    payment_status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
      }
      const queryString = searchParams.toString();
      return await this.get(`/admin/orders${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      return {
        success: true,
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: 'Orders (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getAdminOrderStatsEnhanced(timeRange?: string) {
    try {
      const params = timeRange ? `?timeRange=${timeRange}` : '';
      return await this.get(`/admin/orders/stats${params}`);
    } catch (error) {
      return {
        success: true,
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          ordersGrowthRate: 0,
        },
        message: 'Order statistics (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async updateAdminOrderStatusEnhanced(id: string, status: string, notes?: string) {
    try {
      return await this.put(`/admin/orders/${id}/status`, { status, notes });
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  // Customers Methods
  async getAdminCustomersEnhanced(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    verified?: boolean;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
      }
      const queryString = searchParams.toString();
      return await this.get(`/admin/customers${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      return {
        success: true,
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: 'Customers (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getAdminCustomerStatsEnhanced() {
    try {
      return await this.get('/admin/customers/stats');
    } catch (error) {
      return {
        success: true,
        data: {
          totalCustomers: 0,
          verifiedCustomers: 0,
          unverifiedCustomers: 0,
          activeCustomers: 0,
          newCustomersThisMonth: 0,
          customerGrowthRate: 0,
        },
        message: 'Customer statistics (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async updateAdminCustomerEnhanced(id: string, data: any) {
    try {
      return await this.put(`/admin/customers/${id}`, data);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async getAdminCustomerEnhanced(id: string) {
    try {
      return await this.get(`/admin/customers/${id}`);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async deleteAdminCustomerEnhanced(id: string) {
    try {
      return await this.delete(`/admin/customers/${id}`);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  // Products Methods
  async getAdminProductsEnhanced(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    featured?: boolean;
    in_stock?: boolean;
    is_active?: boolean;
    low_stock?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
      }
      const queryString = searchParams.toString();
      return await this.get(`/admin/products${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      return {
        success: true,
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: 'Products (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async createAdminProductEnhanced(productData: any) {
    try {
      return await this.post('/admin/products', productData);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async updateAdminProductEnhanced(id: string, productData: any) {
    try {
      return await this.put(`/admin/products/${id}`, productData);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async getAdminProductEnhanced(id: string) {
    try {
      return await this.get(`/admin/products/${id}`);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async deleteAdminProductEnhanced(id: string) {
    try {
      return await this.delete(`/admin/products/${id}`);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async getAdminProductStatsEnhanced() {
    try {
      return await this.get('/admin/products/stats');
    } catch (error) {
      return {
        success: true,
        data: {
          totalProducts: 0,
          activeProducts: 0,
          featuredProducts: 0,
          outOfStockProducts: 0,
          lowStockProducts: 0,
          totalCategories: 0,
          averagePrice: 0,
          totalInventoryValue: 0,
        },
        message: 'Product statistics (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Categories Methods
  async getAdminCategoriesEnhanced(params?: {
    page?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
      }
      const queryString = searchParams.toString();
      return await this.get(`/admin/categories${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      return {
        success: true,
        data: [],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message: 'Categories (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async createAdminCategoryEnhanced(categoryData: any) {
    try {
      return await this.post('/admin/categories', categoryData);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async updateAdminCategoryEnhanced(id: string, categoryData: any) {
    try {
      return await this.put(`/admin/categories/${id}`, categoryData);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async deleteAdminCategoryEnhanced(id: string) {
    try {
      return await this.delete(`/admin/categories/${id}`);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  // Settings Methods
  async getAdminSettingsEnhanced() {
    try {
      return await this.get('/admin/settings');
    } catch (error) {
      return {
        success: true,
        data: {
          site_name: 'Hamsoya',
          site_description: 'Premium organic products from Bangladesh',
          contact_email: 'contact@hamsoya.com',
          contact_phone: '+880-1234-567890',
          address: 'Dhaka, Bangladesh',
          currency: 'BDT',
          tax_rate: 0,
          shipping_fee: 100,
          free_shipping_threshold: 2000,
          maintenance_mode: false,
          allow_registration: true,
          email_notifications: true,
          sms_notifications: false,
          social_media: {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: '',
          },
          seo: {
            meta_title: 'Hamsoya - Premium Organic Products',
            meta_description: 'Discover premium organic honey, ghee, and traditional foods from Bangladesh',
            meta_keywords: 'organic, honey, ghee, bangladesh, natural, premium',
          },
          analytics: {
            google_analytics_id: '',
            facebook_pixel_id: '',
          },
        },
        message: 'Settings (fallback data)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async updateAdminSettingsEnhanced(settingsData: any) {
    try {
      return await this.put('/admin/settings', settingsData);
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }

  async resetAdminSettingsEnhanced() {
    try {
      return await this.post('/admin/settings/reset');
    } catch (error) {
      throw error; // Re-throw for proper error handling in UI
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or custom instances
export { ApiClient };
