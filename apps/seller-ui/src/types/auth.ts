// Seller-specific user interface
export interface Seller {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isVerified: boolean;
  isActive: boolean;
  role: 'seller';
  createdAt: string;
  updatedAt: string;
  // Seller-specific fields
  businessLicense?: string;
  taxId?: string;
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  commissionRate?: number;
  totalSales?: number;
  rating?: number;
  reviewCount?: number;
}

// Auth response for seller login
export interface SellerAuthResponse {
  success: boolean;
  message: string;
  seller?: Seller;
  accessToken?: string;
  refreshToken?: string;
}

// Login request interface
export interface SellerLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Signup request interface
export interface SellerSignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  businessName: string;
  businessType: string;
  phone: string;
  acceptTerms: boolean;
}

// OTP verification request
export interface SellerOTPRequest {
  email: string;
  otp: string;
}

// Password reset request
export interface SellerPasswordResetRequest {
  email: string;
}

// Password reset confirmation
export interface SellerPasswordResetConfirmRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Auth state interface
export interface SellerAuthState {
  seller: Seller | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastActivity: number | null;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}
