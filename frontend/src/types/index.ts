/**
 * Provider types
 */
export type Provider = 'also' | 'tdsynnex' | 'trend';

/**
 * Base API response
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Common subscription interface (unified across providers)
 */
export interface Subscription {
  id: string;
  provider: Provider;
  customerId: string;
  productId: string;
  status: 'active' | 'suspended' | 'cancelled' | 'pending';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  price: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

/**
 * Common product interface
 */
export interface Product {
  id: string;
  provider: Provider;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  available: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * User/Customer interface
 */
export interface Customer {
  id: string;
  provider: Provider;
  name: string;
  email: string;
  company?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

/**
 * Security alert interface (Trend)
 */
export interface SecurityAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  status: 'open' | 'acknowledged' | 'resolved';
  affectedEndpoints?: string[];
}

/**
 * User authentication interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalProducts: number;
  totalCustomers: number;
  criticalAlerts: number;
  subscriptionGrowth: number;
}


