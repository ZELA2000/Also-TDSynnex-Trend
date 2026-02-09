import { apiClient } from '../utils/apiClient';
import { Cart, CartItem, CheckoutResponse } from '../types';

class CartService {
    /**
     * Create a new cart
     */
    public async createCart(customerId: string, initialData?: any): Promise<Cart> {
        const url = `/api/v3/customers/${customerId}/carts`;

        try {
            const response = await apiClient.post<Cart>(url, initialData || {});
            return response;
        } catch (error: any) {
            console.error('Failed to create cart:', error.message);
            throw new Error('Failed to create cart');
        }
    }

    /**
     * Get cart details
     */
    public async getCart(customerId: string, cartId: string): Promise<Cart> {
        const url = `/api/v3/customers/${customerId}/carts/${cartId}`;

        try {
            const response = await apiClient.get<Cart>(url);
            return response;
        } catch (error: any) {
            console.error('Failed to get cart:', error.message);
            throw new Error('Failed to get cart');
        }
    }

    /**
     * Add item to cart
     */
    public async addCartItem(customerId: string, cartId: string, itemData: Partial<CartItem>): Promise<CartItem> {
        const url = `/api/v3/customers/${customerId}/carts/${cartId}/cartItems`;

        try {
            const response = await apiClient.post<CartItem>(url, itemData);
            return response;
        } catch (error: any) {
            console.error('Failed to add cart item:', error.message);
            throw new Error('Failed to add cart item');
        }
    }

    /**
     * Update cart item
     */
    public async updateCartItem(customerId: string, cartId: string, itemId: string, itemData: Partial<CartItem>): Promise<CartItem> {
        const url = `/api/v3/customers/${customerId}/carts/${cartId}/cartItems/${itemId}`;

        try {
            const response = await apiClient.put<CartItem>(url, itemData);
            return response;
        } catch (error: any) {
            console.error('Failed to update cart item:', error.message);
            throw new Error('Failed to update cart item');
        }
    }

    /**
     * Remove cart item
     */
    public async removeCartItem(customerId: string, cartId: string, itemId: string): Promise<void> {
        const url = `/api/v3/customers/${customerId}/carts/${cartId}/cartItems/${itemId}`;

        try {
            await apiClient.delete(url);
        } catch (error: any) {
            console.error('Failed to remove cart item:', error.message);
            throw new Error('Failed to remove cart item');
        }
    }

    /**
     * Checkout cart
     */
    public async checkout(customerId: string, cartId: string, checkoutData?: { poNumber?: string }): Promise<CheckoutResponse> {
        const url = `/api/v3/customers/${customerId}/carts/${cartId}:checkout`;

        try {
            const response = await apiClient.post<CheckoutResponse>(url, checkoutData || {});
            return response;
        } catch (error: any) {
            console.error('Failed to checkout cart:', error.message);
            throw new Error('Failed to checkout cart');
        }
    }
}

export const cartService = new CartService();
