import { apiClient } from '../utils/apiClient';
import { Order, Subscription, PaginatedResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

class OrderService {
    private accountId: string;

    constructor() {
        this.accountId = process.env.TDSYNNEX_ACCOUNT_ID || '';
    }

    public async listOrders(params?: { pageSize?: number; offset?: number }): Promise<PaginatedResponse<Order>> {
        const queryParams = new URLSearchParams();
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params?.offset) queryParams.append('offset', params.offset.toString());

        const url = `/api/v3/accounts/${this.accountId}/orders?${queryParams.toString()}`;

        try {
            const response = await apiClient.get<any>(url);
            if (response.items) return response;
            if (Array.isArray(response)) return { items: response, total: response.length, pageSize: params?.pageSize || response.length };
            return { items: [], total: 0, pageSize: params?.pageSize || 10 };
        } catch (error: any) {
            throw new Error('Failed to list orders');
        }
    }

    public async listCustomerOrders(customerId: string, params?: { pageSize?: number }): Promise<PaginatedResponse<Order>> {
        const queryParams = new URLSearchParams();
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        const url = `/api/v3/accounts/${this.accountId}/customers/${customerId}/orders?${queryParams.toString()}`;

        try {
            const response = await apiClient.get<any>(url);
            if (response.items) return response;
            if (Array.isArray(response)) return { items: response, total: response.length, pageSize: params?.pageSize || response.length };
            return { items: [], total: 0, pageSize: params?.pageSize || 10 };
        } catch (error: any) {
            throw new Error('Failed to list customer orders');
        }
    }

    public async getOrderDetails(customerId: string, orderId: string): Promise<Order> {
        const url = `/api/v3/accounts/${this.accountId}/customers/${customerId}/orders/${orderId}`;

        try {
            return await apiClient.get<Order>(url);
        } catch (error: any) {
            throw new Error('Failed to get order details');
        }
    }

    public async listSubscriptions(params?: { pageSize?: number }): Promise<PaginatedResponse<Subscription>> {
        const queryParams = new URLSearchParams();
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

        const url = `/api/v3/accounts/${this.accountId}/subscriptions?${queryParams.toString()}`;

        try {
            const response = await apiClient.get<any>(url);
            if (response.items) return response;
            if (Array.isArray(response)) return { items: response, total: response.length, pageSize: params?.pageSize || response.length };
            return { items: [], total: 0, pageSize: params?.pageSize || 10 };
        } catch (error: any) {
            throw new Error('Failed to list subscriptions');
        }
    }

    public async getSubscriptionDetails(customerId: string, subscriptionId: string): Promise<Subscription> {
        const url = `/api/v3/accounts/${this.accountId}/customers/${customerId}/subscriptions/${subscriptionId}`;

        try {
            return await apiClient.get<Subscription>(url);
        } catch (error: any) {
            throw new Error('Failed to get subscription details');
        }
    }
}

export const orderService = new OrderService();
