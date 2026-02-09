import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class ApiClient {
    private client: AxiosInstance;
    private getToken: (() => Promise<string>) | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.TDSYNNEX_API_BASE_URL || 'https://ion.tdsynnex.com',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add authentication token
        this.client.interceptors.request.use(
            async (config) => {
                // Skip auth for token endpoint
                if (config.url?.includes('/oauth/token') || config.url?.includes('/oauth/validateAccess')) {
                    return config;
                }

                // Add Bearer token if available
                if (this.getToken) {
                    const token = await this.getToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response) {
                    // Server responded with error status
                    const errorMessage = (error.response.data as any)?.message || error.message;
                    console.error(`API Error [${error.response.status}]:`, errorMessage);
                } else if (error.request) {
                    // Request was made but no response
                    console.error('API Error: No response received', error.message);
                } else {
                    // Something else happened
                    console.error('API Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Set the token provider function
     * This will be called to get the current access token
     */
    public setTokenProvider(provider: () => Promise<string>) {
        this.getToken = provider;
    }

    /**
     * Make a GET request
     */
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * Make a POST request
     */
    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    /**
     * Make a PUT request
     */
    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    /**
     * Make a DELETE request
     */
    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    /**
     * Make a POST request with form data
     */
    public async postForm<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        const formConfig = {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const response = await this.client.post<T>(url, data, formConfig);
        return response.data;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
