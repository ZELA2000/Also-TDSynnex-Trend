import { apiClient } from '../utils/apiClient';
import { Customer, CloudProfile, PaginatedResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

class CustomerService {
    private accountId: string;

    constructor() {
        this.accountId = process.env.TDSYNNEX_ACCOUNT_ID || '';
        if (!this.accountId) {
            console.warn('TDSYNNEX_ACCOUNT_ID not set in environment variables');
        }
    }

    /**
     * List all customers for the account
     */
    public async listCustomers(params?: {
        pageSize?: number;
        offset?: number;
        filterName?: string;
    }): Promise<PaginatedResponse<Customer>> {
        const queryParams = new URLSearchParams();

        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params?.offset) queryParams.append('offset', params.offset.toString());
        if (params?.filterName) queryParams.append('filter.customerName', params.filterName);

        const url = `/api/v3/accounts/${this.accountId}/customers?${queryParams.toString()}`;

        try {
            const response = await apiClient.get<any>(url);

            // Handle different response formats
            if (response.items) {
                return response as PaginatedResponse<Customer>;
            } else if (Array.isArray(response)) {
                return {
                    items: response,
                    total: response.length,
                    pageSize: params?.pageSize || response.length,
                };
            } else {
                return {
                    items: [],
                    total: 0,
                    pageSize: params?.pageSize || 10,
                };
            }
        } catch (error: any) {
            console.error('Failed to list customers:', error.message);
            throw new Error('Failed to list customers');
        }
    }

    /**
     * Create a new customer
     */
    public async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
        const url = `/api/v3/accounts/${this.accountId}/customers`;

        try {
            const response = await apiClient.post<Customer>(url, customerData);
            return response;
        } catch (error: any) {
            console.error('Failed to create customer:', error.message);
            throw new Error('Failed to create customer');
        }
    }

    /**
     * Get customer details by ID
     */
    public async getCustomerDetails(customerId: string): Promise<Customer> {
        const url = `/api/v3/accounts/${this.accountId}/customers/${customerId}`;

        try {
            const response = await apiClient.get<Customer>(url);
            return response;
        } catch (error: any) {
            console.error('Failed to get customer details:', error.message);
            throw new Error('Failed to get customer details');
        }
    }

    /**
     * Get customer cloud profiles (e.g., Microsoft Tenant ID)
     */
    public async getCloudProfiles(customerId: string): Promise<CloudProfile[]> {
        const url = `/api/v3/accounts/${this.accountId}/customers/${customerId}/cloudProfiles`;

        try {
            const response = await apiClient.get<any>(url);

            // Handle different response formats
            if (Array.isArray(response)) {
                return response;
            } else if (response.items) {
                return response.items;
            } else {
                return [];
            }
        } catch (error: any) {
            console.error('Failed to get cloud profiles:', error.message);
            throw new Error('Failed to get cloud profiles');
        }
    }

    /**
     * Update account ID (useful for multi-account scenarios)
     */
    public setAccountId(accountId: string): void {
        this.accountId = accountId;
    }
}

export const customerService = new CustomerService();
