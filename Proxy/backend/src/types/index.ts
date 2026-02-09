import { Request } from 'express';

export interface ProxyRequest extends Request {
    apiToken?: string;
    apiService?: 'also' | 'tdsynnex' | 'trend';
}

export interface ApiError {
    success: false;
    message: string;
    error?: any;
    statusCode?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: any;
}

// Also API Types
export interface AlsoAuthToken {
    token: string;
    expiresAt?: number;
}

// TDSynnex API Types
export interface TDSynnexAuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

// Trend API Types
export interface TrendApiConfig {
    apiKey: string;
    baseUrl: string;
}
