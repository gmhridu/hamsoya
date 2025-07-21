/**
 * Data layer exports
 */

// Export data provider interface and factory
export {
  createDataProvider,
  dataProvider,
  type DataProvider,
} from './data-provider';

// Export mock data provider for development
export { mockDataProvider } from './mock-provider';

// Re-export domain types
export type {
  DeliveryAddress,
  Feedback,
  HeroContent,
  OrderDetail,
  OrderItem,
  OrderStatus,
  OrderSummary,
  Product,
  ShopControls,
  UserDetail,
  UserSummary,
} from '../../types/domain';

// Re-export admin types
export type {
  AdminAuditLog,
  AdminNotification,
  AdminRouteConfig,
  AdminSession,
  AdminUser,
  DashboardKpi,
  DateRange,
} from '../../types/admin';

export { Role } from '../../types/admin';
