import { apiClient } from '../utils/apiClient';
import { Product, ProductPricing, PaginatedResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

class ProductService {
    private accountId: string;

    constructor() {
        this.accountId = process.env.TDSYNNEX_ACCOUNT_ID || '';
    }

    /**
     * Search/list products
     */
    public async searchProducts(params?: {
        limit?: number;
        offset?: number;
        q?: string;
        filters?: string;
    }): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams();

        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.offset) queryParams.append('offset', params.offset.toString());
        if (params?.q) queryParams.append('q', params.q);
        if (params?.filters) queryParams.append('filters', params.filters);

        const url = `/api/v3/accounts/${this.accountId}/products?${queryParams.toString()}`;

        try {
            const response = await apiClient.get<any>(url);

            if (response.items) {
                return response as PaginatedResponse<Product>;
            } else if (Array.isArray(response)) {
                return { items: response, total: response.length, pageSize: params?.limit || response.length };
            } else {
                return { items: [], total: 0, pageSize: params?.limit || 10 };
            }
        } catch (error: any) {
            console.error('Failed to search products:', error.message);
            throw new Error('Failed to search products');
        }
    }

    /**
     * Get product details
     */
    public async getProductDetails(productId: string): Promise<Product> {
        const url = `/api/v3/accounts/${this.accountId}/products/${productId}`;

        try {
            const response = await apiClient.get<Product>(url);
            return response;
        } catch (error: any) {
            console.error('Failed to get product details:', error.message);
            throw new Error('Failed to get product details');
        }
    }

    /**
     * Get pricing for products
     */
    public async getProductPricing(productIds: string[]): Promise<ProductPricing[]> {
        const url = `/api/v3/accounts/${this.accountId}/products:pricing`;

        try {
            const response = await apiClient.post<any>(url, { productIds });

            if (Array.isArray(response)) {
                return response;
            } else if (response.items) {
                return response.items;
            } else {
                return [];
            }
        } catch (error: any) {
            console.error('Failed to get product pricing:', error.message);
            throw new Error('Failed to get product pricing');
        }
    }

    /**
     * Enable a product
     */
    public async enableProduct(productId: string): Promise<any> {
        const url = `/api/v3/accounts/${this.accountId}/products/${productId}:enable`;

        try {
            const response = await apiClient.post<any>(url);
            return response;
        } catch (error: any) {
            console.error('Failed to enable product:', error.message);
            throw new Error('Failed to enable product');
        }
    }

    /**
     * Disable a product
     */
    public async disableProduct(productId: string): Promise<any> {
        const url = `/api/v3/accounts/${this.accountId}/products/${productId}:disable`;

        try {
            const response = await apiClient.post<any>(url);
            return response;
        } catch (error: any) {
            console.error('Failed to disable product:', error.message);
            throw new Error('Failed to disable product');
        }
    }
}

export const productService = new ProductService();
