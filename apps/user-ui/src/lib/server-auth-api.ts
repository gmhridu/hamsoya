import axios, { AxiosError } from 'axios';
import { AuthResponse, LoginRequest, SignupRequest } from '../types/auth';
import { serverConfig } from './server-config';

const serverApiClient = axios.create({
  baseURL: serverConfig.api.authServiceUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: serverConfig.api.timeout,
});

serverApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = 'An unexpected error occurred';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      const errorData = error.response.data as any;

      switch (statusCode) {
        case 400:
          message = errorData?.message || 'Invalid request data';
          break;
        case 401:
          message = errorData?.message || 'Authentication failed';
          break;
        case 403:
          message = errorData?.message || 'Access denied';
          break;
        case 404:
          message = errorData?.message || 'Service not found';
          break;
        case 409:
          message = errorData?.message || 'Conflict - resource already exists';
          break;
        case 422:
          message = errorData?.message || 'Validation failed';
          break;
        case 429:
          message =
            errorData?.message || 'Too many requests. Please try again later';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          message = 'Server error. Please try again later';
          break;
        default:
          message =
            errorData?.message || `Request failed with status ${statusCode}`;
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection';
      statusCode = 503;
    } else {
      message = 'Request configuration error';
      statusCode = 500;
    }

    console.error('Server Auth API Error:', {
      message,
      statusCode,
      url: error.config?.url,
      method: error.config?.method,
    });

    const standardError = new Error(message) as any;
    standardError.statusCode = statusCode;
    standardError.originalError = error;

    throw standardError;
  }
);

class ServerAuthAPI {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await serverApiClient.post('/user-registration', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await serverApiClient.post(
      '/login-user',
      {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  async verifyOTP(data: {
    email: string;
    otp: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const response = await serverApiClient.post('/verify-user', {
      email: data.email,
      otp: data.otp,
      password: data.password,
      name: data.name,
    });
    return response.data;
  }

  async resendOTP(data: {
    email: string;
    name?: string;
    password?: string;
  }): Promise<AuthResponse> {
    // For forgot password flow, resend OTP by calling the forgot password endpoint again
    // This reuses the same logic and ensures proper email delivery
    const response = await serverApiClient.post('/forgot-user-password', {
      email: data.email,
    });
    return response.data;
  }

  async forgotPassword(data: { email: string }): Promise<AuthResponse> {
    const response = await serverApiClient.post('/forgot-user-password', {
      email: data.email,
    });
    return response.data;
  }

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<AuthResponse> {
    const response = await serverApiClient.post('/reset-user-password', {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
    return response.data;
  }

  async verifyForgotPasswordOTP(data: {
    email: string;
    otp: string;
  }): Promise<AuthResponse> {
    const response = await serverApiClient.post('/verify-forgot-password-otp', {
      email: data.email,
      otp: data.otp,
    });
    return response.data;
  }

  async getCurrentUser(
    cookieHeader?: string
  ): Promise<{ success: boolean; user?: any }> {
    const config: any = {
      withCredentials: true,
    };

    // Forward cookies from the request if provided
    if (cookieHeader) {
      config.headers = {
        Cookie: cookieHeader,
      };
    }

    const response = await serverApiClient.get('/logged-in-user', config);
    return response.data;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    // For logout, we just need to clear cookies on the client side
    // The backend doesn't have a specific logout endpoint since it uses HTTP-only cookies
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async refreshToken(cookieHeader?: string): Promise<AuthResponse> {
    const config: any = {
      withCredentials: true,
    };

    // Forward cookies from the request if provided
    if (cookieHeader) {
      config.headers = {
        Cookie: cookieHeader,
      };
    }

    const response = await serverApiClient.post(
      '/refresh-token-user',
      {},
      config
    );
    return response.data;
  }

  async verifyEmail(data: { token: string }): Promise<AuthResponse> {
    const response = await serverApiClient.post('/verify-email', {
      token: data.token,
    });
    return response.data;
  }
}

// Export singleton instance
export const serverAuthAPI = new ServerAuthAPI();
