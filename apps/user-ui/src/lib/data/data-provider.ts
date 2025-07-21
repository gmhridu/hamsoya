/**
 * Data provider interface and factory
 */

import { DashboardKpi, DateRange } from '../../types/admin';
import {
  Feedback,
  HeroContent,
  OrderStatus,
  OrderSummary,
  Product,
  ShopControls,
  UserDetail,
  UserSummary,
} from '../../types/domain';
import { config } from '../config';
import { mockDataProvider } from './mock-provider';

/**
 * Data provider interface
 */
export interface DataProvider {
  // Dashboard
  getDashboardKpis(dateRange: DateRange): Promise<DashboardKpi[]>;

  // Users
  getUsers(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{
    users: UserSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getUserById(id: string): Promise<UserDetail | null>;

  // Orders
  getOrders(
    page?: number,
    limit?: number,
    status?: OrderStatus,
    search?: string
  ): Promise<{
    orders: OrderSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  // Products
  getProducts(
    page?: number,
    limit?: number,
    category?: string,
    search?: string
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  // Hero Content
  getHeroContent(): Promise<HeroContent[]>;
  updateHeroContent(
    id: string,
    updates: Partial<HeroContent>
  ): Promise<HeroContent>;

  // Feedback
  getFeedback(
    page?: number,
    limit?: number,
    isApproved?: boolean
  ): Promise<{
    feedback: Feedback[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  // Shop Controls
  getShopControls(): Promise<ShopControls>;
  updateShopControls(updates: Partial<ShopControls>): Promise<ShopControls>;
}

/**
 * HTTP API data provider
 * This would be implemented to connect to real backend APIs
 */
class HttpDataProvider implements DataProvider {
  constructor(baseUrl: string) {
    // TODO: Use baseUrl when implementing real API calls
    console.log('HttpDataProvider initialized with baseUrl:', baseUrl);
  }

  async getDashboardKpis(dateRange: DateRange): Promise<DashboardKpi[]> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getDashboardKpis(dateRange);
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    users: UserSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getUsers(page, limit, search);
  }

  async getUserById(id: string): Promise<UserDetail | null> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getUserById(id);
  }

  async getOrders(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    search?: string
  ): Promise<{
    orders: OrderSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getOrders(page, limit, status, search);
  }

  async getProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getProducts(page, limit, category, search);
  }

  async getHeroContent(): Promise<HeroContent[]> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getHeroContent();
  }

  async updateHeroContent(
    id: string,
    updates: Partial<HeroContent>
  ): Promise<HeroContent> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.updateHeroContent(id, updates);
  }

  async getFeedback(
    page: number = 1,
    limit: number = 10,
    isApproved?: boolean
  ): Promise<{
    feedback: Feedback[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getFeedback(page, limit, isApproved);
  }

  async getShopControls(): Promise<ShopControls> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.getShopControls();
  }

  async updateShopControls(
    updates: Partial<ShopControls>
  ): Promise<ShopControls> {
    // In a real implementation, this would make an API call
    // For now, use the mock provider
    return mockDataProvider.updateShopControls(updates);
  }
}

/**
 * Create data provider based on configuration
 */
export function createDataProvider(): DataProvider {
  if (config.api.enableMockApi) {
    return mockDataProvider;
  }

  // In production, use HTTP provider
  return new HttpDataProvider('/api/admin');
}

/**
 * Export singleton instance
 */
export const dataProvider = createDataProvider();
