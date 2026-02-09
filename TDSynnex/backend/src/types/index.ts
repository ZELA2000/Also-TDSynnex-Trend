// Authentication Types
export interface TokenRequest {
    grant_type: string;
    refresh_token?: string;
    username?: string;
    password?: string;
}

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
}

export interface ValidateTokenRequest {
    access_token: string;
}

export interface ValidateTokenResponse {
    access_expires_in: number;
    refresh_expires_in: number;
}

// Customer Types
export interface Customer {
    id: string;
    customerOrganization: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerAddress?: Address;
    languageCode?: string;
    status?: string;
    userName?: string;
    password?: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface CloudProfile {
    id: string;
    provider: string;
    tenantId?: string;
    customerId: string;
}

// Product Types
export interface Product {
    id: string;
    name: string;
    description?: string;
    vendor?: string;
    category?: string;
    configurations?: any;
    constraints?: any;
}

export interface ProductPricingRequest {
    productIds: string[];
}

export interface ProductPricing {
    productId: string;
    unitPrice: number;
    retailPrice: number;
    currency: string;
}

// Cart Types
export interface Cart {
    id: string;
    customerId: string;
    items?: CartItem[];
    totalPrice?: number;
    status?: string;
}

export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    attributes?: Record<string, any>;
}

export interface CheckoutRequest {
    poNumber?: string;
}

export interface CheckoutResponse {
    orderId?: string;
    orders?: Order[];
}

// Order Types
export interface Order {
    id: string;
    customerId: string;
    accountId: string;
    status: string;
    statusDetail?: string;
    createdAt?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price?: number;
}

// Subscription Types
export interface Subscription {
    id: string;
    subscriptionId: string;
    customerId: string;
    productId: string;
    product?: Product;
    status: string;
    quantity: number;
    startDate?: string;
    endDate?: string;
}

// Report Types
export interface Report {
    id: string;
    name: string;
    description?: string;
}

export interface ReportGenerationRequest {
    startDate: string;
    endDate: string;
}

export interface ProvisioningTemplate {
    id: string;
    vendor: string;
    product?: string;
    schema: any;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    pageSize: number;
    offset?: number;
}

// Error Types
export interface ApiError {
    code: string;
    message: string;
    details?: any;
}
