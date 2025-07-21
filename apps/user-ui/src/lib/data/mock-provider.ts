/**
 * Mock data provider for admin dashboard
 * Simulates API calls with realistic latency and localStorage persistence
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

/**
 * Simulated API latency
 */
const MOCK_LATENCY = {
  min: 250,
  max: 750,
};

/**
 * Generate random delay
 */
const delay = (ms?: number): Promise<void> => {
  const randomMs =
    ms ||
    Math.random() * (MOCK_LATENCY.max - MOCK_LATENCY.min) + MOCK_LATENCY.min;
  return new Promise((resolve) => setTimeout(resolve, randomMs));
};

/**
 * Storage utilities
 */
const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  },
};

/**
 * Generate seed data
 */
const generateSeedData = () => {
  const users: UserSummary[] = Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    lastLogin:
      Math.random() > 0.3
        ? new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    orderCount: Math.floor(Math.random() * 20),
    totalSpent: Math.floor(Math.random() * 5000),
    isActive: Math.random() > 0.1,
  }));

  const orders: OrderSummary[] = Array.from({ length: 200 }, (_, i) => ({
    id: `order-${i + 1}`,
    userId: users[Math.floor(Math.random() * users.length)].id,
    orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
    status:
      Object.values(OrderStatus)[
        Math.floor(Math.random() * Object.values(OrderStatus).length)
      ],
    totalAmount: Math.floor(Math.random() * 500) + 50,
    itemCount: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    shippingAddress: {
      id: `addr-${i + 1}`,
      userId: users[Math.floor(Math.random() * users.length)].id,
      name: `Address ${i + 1}`,
      street: `${Math.floor(Math.random() * 9999)} Main St`,
      city: 'Sample City',
      state: 'ST',
      zipCode: '12345',
      country: 'US',
      phone: '+1234567890',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
    isPreOrder: Math.random() > 0.8,
  }));

  const products: Product[] = Array.from({ length: 100 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 20,
    compareAtPrice:
      Math.random() > 0.7 ? Math.floor(Math.random() * 300) + 100 : undefined,
    images: [`/images/product-${i + 1}.jpg`],
    category: ['Electronics', 'Clothing', 'Home', 'Books'][
      Math.floor(Math.random() * 4)
    ],
    tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1),
    stock: Math.floor(Math.random() * 100),
    sku: `SKU-${String(i + 1).padStart(6, '0')}`,
    isActive: Math.random() > 0.1,
    isPremium: Math.random() > 0.8,
    hasOffer: Math.random() > 0.7,
    offerLabel: Math.random() > 0.5 ? 'Sale' : 'New',
    isPreOrder: Math.random() > 0.9,
    createdAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const heroContent: HeroContent[] = Array.from({ length: 5 }, (_, i) => ({
    id: `hero-${i + 1}`,
    title: `Hero Title ${i + 1}`,
    subtitle: `Hero subtitle ${i + 1}`,
    ctaText: 'Shop Now',
    ctaLink: '/products',
    image: `/images/hero-${i + 1}.jpg`,
    isActive: i === 0,
    position: i + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const feedback: Feedback[] = Array.from({ length: 50 }, (_, i) => ({
    id: `feedback-${i + 1}`,
    userId: users[Math.floor(Math.random() * users.length)].id,
    userName: `User ${i + 1}`,
    userEmail: `user${i + 1}@example.com`,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: `This is feedback comment ${i + 1}`,
    isApproved: Math.random() > 0.3,
    isDisplayedOnHomepage: Math.random() > 0.7,
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    productId:
      Math.random() > 0.5
        ? products[Math.floor(Math.random() * products.length)].id
        : undefined,
    orderId:
      Math.random() > 0.5
        ? orders[Math.floor(Math.random() * orders.length)].id
        : undefined,
  }));

  const shopControls: ShopControls = {
    id: 'shop-controls-1',
    isPreOrderEnabled: true,
    isOfferEnabled: true,
    isPremiumCollectionEnabled: true,
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin',
  };

  return {
    users,
    orders,
    products,
    heroContent,
    feedback,
    shopControls,
  };
};

/**
 * Initialize data
 */
const initializeData = () => {
  const existingData = storage.get('admin-data', null);
  if (!existingData) {
    const seedData = generateSeedData();
    storage.set('admin-data', seedData);
    return seedData;
  }
  return existingData;
};

/**
 * Mock data provider class
 */
export class MockDataProvider {
  private data: ReturnType<typeof generateSeedData>;

  constructor() {
    this.data = initializeData();
  }

  /**
   * Get dashboard KPIs
   */
  async getDashboardKpis(dateRange: DateRange): Promise<DashboardKpi[]> {
    await delay();

    const ordersInRange = this.data.orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
    });

    const totalOrders = ordersInRange.length;
    const totalRevenue = ordersInRange.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = ordersInRange.reduce(
      (sum, order) => sum + order.itemCount,
      0
    );
    const newUsers = this.data.users.filter((user) => {
      const userDate = new Date(user.createdAt);
      return userDate >= dateRange.startDate && userDate <= dateRange.endDate;
    }).length;

    return [
      {
        id: 'total-orders',
        label: 'Total Orders',
        value: totalOrders,
        previousValue: Math.floor(totalOrders * 0.9),
        change: 10,
        changeType: 'increase',
        trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        icon: 'ShoppingCart',
      },
      {
        id: 'total-revenue',
        label: 'Total Revenue',
        value: totalRevenue,
        previousValue: Math.floor(totalRevenue * 0.85),
        change: 15,
        changeType: 'increase',
        trend: Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 1000)
        ),
        unit: '$',
        icon: 'DollarSign',
      },
      {
        id: 'avg-order-value',
        label: 'Average Order Value',
        value: Math.floor(avgOrderValue),
        previousValue: Math.floor(avgOrderValue * 0.95),
        change: 5,
        changeType: 'increase',
        trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200)),
        unit: '$',
        icon: 'TrendingUp',
      },
      {
        id: 'total-products',
        label: 'Products Ordered',
        value: totalProducts,
        previousValue: Math.floor(totalProducts * 0.88),
        change: 12,
        changeType: 'increase',
        trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
        icon: 'Package',
      },
      {
        id: 'new-users',
        label: 'New Users',
        value: newUsers,
        previousValue: Math.floor(newUsers * 0.92),
        change: 8,
        changeType: 'increase',
        trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20)),
        icon: 'Users',
      },
    ];
  }

  /**
   * Get users with pagination
   */
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
    await delay();

    let filteredUsers = this.data.users;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const users = filteredUsers.slice(startIndex, startIndex + limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserDetail | null> {
    await delay();

    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;

    const userOrders = this.data.orders.filter((order) => order.userId === id);

    return {
      ...user,
      phone: '+1234567890',
      addresses: [user.id].map((userId) => ({
        id: `addr-${userId}`,
        userId,
        name: 'Home Address',
        street: '123 Main St',
        city: 'Sample City',
        state: 'ST',
        zipCode: '12345',
        country: 'US',
        phone: '+1234567890',
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      orders: userOrders,
      notes: 'Sample user notes',
      preferences: {},
    };
  }

  /**
   * Get orders with pagination and filtering
   */
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
    await delay();

    let filteredOrders = this.data.orders;

    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const orders = filteredOrders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(startIndex, startIndex + limit);

    return {
      orders,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get products with pagination and filtering
   */
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
    await delay();

    let filteredProducts = this.data.products;

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower)
      );
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const products = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      products,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get hero content
   */
  async getHeroContent(): Promise<HeroContent[]> {
    await delay();
    return [...this.data.heroContent].sort((a, b) => a.position - b.position);
  }

  /**
   * Update hero content
   */
  async updateHeroContent(
    id: string,
    updates: Partial<HeroContent>
  ): Promise<HeroContent> {
    await delay();

    const index = this.data.heroContent.findIndex((hero) => hero.id === id);
    if (index === -1) {
      throw new Error('Hero content not found');
    }

    this.data.heroContent[index] = {
      ...this.data.heroContent[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();
    return this.data.heroContent[index];
  }

  /**
   * Get feedback with pagination and filtering
   */
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
    await delay();

    let filteredFeedback = this.data.feedback;

    if (typeof isApproved === 'boolean') {
      filteredFeedback = filteredFeedback.filter(
        (feedback) => feedback.isApproved === isApproved
      );
    }

    const total = filteredFeedback.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const feedback = filteredFeedback
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(startIndex, startIndex + limit);

    return {
      feedback,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get shop controls
   */
  async getShopControls(): Promise<ShopControls> {
    await delay();
    return this.data.shopControls;
  }

  /**
   * Update shop controls
   */
  async updateShopControls(
    updates: Partial<ShopControls>
  ): Promise<ShopControls> {
    await delay();

    this.data.shopControls = {
      ...this.data.shopControls,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();
    return this.data.shopControls;
  }

  /**
   * Save data to storage
   */
  private saveData(): void {
    storage.set('admin-data', this.data);
  }
}

/**
 * Export singleton instance
 */
export const mockDataProvider = new MockDataProvider();
