import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AuthResponse, LoginRequest, SignupRequest, User } from '../types/auth';

// Configure axios instance for Next.js API routes
const apiClient = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Handle logout and prevent infinite loops
const handleLogout = () => {
  // Tokens are managed via HTTP-only cookies, no localStorage cleanup needed
  // Only redirect if not already on login page
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Execute queued requests after refresh
const onRefreshSuccess = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Request interceptor - tokens are handled via HTTP-only cookies
// No need to manually attach Authorization headers
apiClient.interceptors.request.use(
  (config) => {
    // HTTP-only cookies are automatically sent with requests
    // No manual token management needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for comprehensive error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    let message = 'An unexpected error occurred';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. Please check your connection and try again.';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Network error. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as { message?: string; error?: string };

      // Handle 401 errors with token refresh
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Skip refresh for login, signup, and refresh-token endpoints
        const skipRefreshUrls = ['/login', '/signup', '/refresh-token'];
        const shouldSkipRefresh = skipRefreshUrls.some((url) =>
          originalRequest.url?.includes(url)
        );

        if (!shouldSkipRefresh) {
          if (isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve) => {
              subscribeTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(apiClient(originalRequest));
              });
            });
          }

          isRefreshing = true;

          try {
            // Attempt to refresh the token via Next.js API route
            const refreshResponse = await apiClient.post('/refresh-token');

            if (refreshResponse.data.success) {
              // The new access token is now set in HTTP-only cookies
              // Clear any authorization headers since we use cookies
              if (originalRequest.headers) {
                delete originalRequest.headers.Authorization;
              }

              // Execute queued requests (they will get the token from cookies)
              onRefreshSuccess('refreshed');

              // Auth queries will be invalidated by RTK Query automatically

              // Retry the original request
              return apiClient(originalRequest);
            } else {
              throw new Error(
                refreshResponse.data.message || 'Token refresh failed'
              );
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            handleLogout();

            // Auth cache will be cleared by Redux automatically

            throw new Error(
              (refreshError as Error).message ||
                'Session expired. Please login again.'
            );
          } finally {
            isRefreshing = false;
          }
        }

        // For login/signup endpoints or if refresh fails, handle normally
        message = data?.message || 'Invalid credentials. Please try again.';
      } else {
        // Handle other status codes
        switch (status) {
          case 400:
            message =
              data?.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            message = data?.message || 'Invalid credentials. Please try again.';
            break;
          case 403:
            message =
              data?.message || 'Access denied. You do not have permission.';
            break;
          case 404:
            message =
              data?.message || 'Service not found. Please try again later.';
            break;
          case 409:
            message =
              data?.message || 'Conflict. This resource already exists.';
            break;
          case 422:
            message =
              data?.message || 'Validation failed. Please check your input.';
            break;
          case 429:
            message =
              data?.message || 'Too many requests. Please wait and try again.';
            break;
          case 500:
            message = data?.message || 'Server error. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            message =
              'Service temporarily unavailable. Please try again later.';
            break;
          default:
            message =
              data?.message || `Server error (${status}). Please try again.`;
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      message = 'No response from server. Please check your connection.';
    }

    // Log error details for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error Details:', {
        message,
        status: error.response?.status || 'No status',
        code: error.code || 'No code',
        url: error.config?.url || 'No URL',
        method: error.config?.method?.toUpperCase() || 'Unknown method',
        responseData: error.response?.data || 'No response data',
      });
    }

    throw new Error(message);
  }
);

class AuthAPI {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post(
      '/login',
      {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
      }
    );

    // Tokens are automatically stored in HTTP-only cookies by the backend
    // No manual token storage needed
    return response.data;
  }

  async getCurrentUser(): Promise<{ success: boolean; user?: User }> {
    const response = await apiClient.get('/user');
    return response.data;
  }

  async verifyOTP(data: {
    email: string;
    otp: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post('/verify-user', {
      email: data.email,
      otp: data.otp,
      password: data.password,
      name: data.name,
    });
    return response.data;
  }

  async resendOTP(data: {
    email: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/resend-otp', {
      email: data.email,
    });
    return response.data;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/logout');
    // HTTP-only cookies are cleared by the server
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post('/refresh-token');
    return response.data;
  }

  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/forgot-password', {
      email,
    });
    return response.data;
  }

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/reset-password', {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
    return response.data;
  }

  async verifyForgotPasswordOTP(data: {
    email: string;
    otp: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/verify-forgot-password-otp', {
      email: data.email,
      otp: data.otp,
    });
    return response.data;
  }

  async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/verify-email', { token });
    return response.data;
  }
}

// Export singleton instance
export const authAPI = new AuthAPI();
