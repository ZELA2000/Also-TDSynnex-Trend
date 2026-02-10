import { apiClient } from './api-client';
import type { 
  Subscription, 
  Product, 
  Customer, 
  SecurityAlert, 
  LoginResponse,
  DashboardStats 
} from '@/types';

/**
 * Also API endpoints
 */
export const alsoApi = {
  // Authentication
  login: (credentials: { username: string; password: string }) =>
    apiClient.post<LoginResponse>('/also/auth/login', credentials),

  // Subscriptions
  getSubscriptions: (params?: { page?: number; limit?: number }) =>
    apiClient.getPaginated<Subscription>('/also/subscriptions', params),

  getSubscription: (id: string) =>
    apiClient.get<Subscription>(`/also/subscriptions/${id}`),

  createSubscription: (data: Partial<Subscription>) =>
    apiClient.post<Subscription>('/also/subscriptions', data),

  updateSubscription: (id: string, data: Partial<Subscription>) =>
    apiClient.put<Subscription>(`/also/subscriptions/${id}`, data),

  cancelSubscription: (id: string) =>
    apiClient.delete(`/also/subscriptions/${id}`),

  // Catalog
  getProducts: (params?: { page?: number; limit?: number; category?: string }) =>
    apiClient.getPaginated<Product>('/also/catalog', params),

  getProduct: (id: string) =>
    apiClient.get<Product>(`/also/catalog/${id}`),

  // Accounts
  getAccount: (id: string) =>
    apiClient.get(`/also/accounts/${id}`),
};

/**
 * TDSynnex API endpoints
 */
export const tdsynnexApi = {
  // Authentication
  authenticate: () =>
    apiClient.post('/tdsynnex/auth/token'),

  // Customers
  getCustomers: (params?: { page?: number; limit?: number }) =>
    apiClient.getPaginated<Customer>('/tdsynnex/customers', params),

  getCustomer: (id: string) =>
    apiClient.get<Customer>(`/tdsynnex/customers/${id}`),

  createCustomer: (data: Partial<Customer>) =>
    apiClient.post<Customer>('/tdsynnex/customers', data),

  // Subscriptions
  getSubscriptions: (params?: { customerId?: string; page?: number; limit?: number }) =>
    apiClient.getPaginated<Subscription>('/tdsynnex/subscriptions', params),

  getSubscription: (id: string) =>
    apiClient.get<Subscription>(`/tdsynnex/subscriptions/${id}`),

  createSubscription: (data: Partial<Subscription>) =>
    apiClient.post<Subscription>('/tdsynnex/subscriptions', data),

  // Products
  getProducts: (params?: { page?: number; limit?: number }) =>
    apiClient.getPaginated<Product>('/tdsynnex/products', params),

  searchProducts: (query: string) =>
    apiClient.get<Product[]>(`/tdsynnex/products/search?q=${encodeURIComponent(query)}`),
};

/**
 * Trend Vision One API endpoints
 */
export const trendApi = {
  // Alerts
  getAlerts: (params?: { severity?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.getPaginated<SecurityAlert>('/trend/alerts', params),

  getAlert: (id: string) =>
    apiClient.get<SecurityAlert>(`/trend/alerts/${id}`),

  acknowledgeAlert: (id: string) =>
    apiClient.post(`/trend/alerts/${id}/acknowledge`),

  resolveAlert: (id: string) =>
    apiClient.post(`/trend/alerts/${id}/resolve`),

  // Endpoints
  getEndpoints: (params?: { page?: number; limit?: number }) =>
    apiClient.getPaginated('/trend/endpoints', params),

  getEndpoint: (id: string) =>
    apiClient.get(`/trend/endpoints/${id}`),

  // Workbench
  getWorkbenchAlerts: () =>
    apiClient.get('/trend/workbench/alerts'),
};

/**
 * Unified endpoints (aggregated data from multiple providers)
 */
export const unifiedApi = {
  // Get all subscriptions from all providers
  getAllSubscriptions: async () => {
    const [alsoSubs, tdSubs] = await Promise.all([
      alsoApi.getSubscriptions(),
      tdsynnexApi.getSubscriptions(),
    ]);

    return {
      success: true,
      data: [...(alsoSubs.data || []), ...(tdSubs.data || [])],
    };
  },

  // Get all products from all providers
  getAllProducts: async () => {
    const [alsoProducts, tdProducts] = await Promise.all([
      alsoApi.getProducts(),
      tdsynnexApi.getProducts(),
    ]);

    return {
      success: true,
      data: [...(alsoProducts.data || []), ...(tdProducts.data || [])],
    };
  },

  // Dashboard overview
  getDashboardStats: async () => {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  },
};
