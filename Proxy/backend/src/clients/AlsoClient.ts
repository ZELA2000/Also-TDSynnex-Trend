import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '../config';
import logger from '../utils/logger';
import { AlsoAuthToken } from '../types';

class AlsoClient {
    private client: AxiosInstance;
    private authToken: string | null = null;
    private tokenExpiry: number | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: config.also.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                logger.error('Also API error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });
                throw error;
            }
        );
    }

    /**
     * Authenticate with Also API
     */
    async authenticate(): Promise<string> {
        try {
            logger.info('Authenticating with Also API...');
            
            const response = await this.client.post('/api/auth/login', {
                UserName: config.also.username,
                Password: config.also.password,
            });

            if (response.data.success && response.data.token) {
                this.authToken = response.data.token;
                // Set token expiry to 23 hours from now (assuming 24h validity)
                this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
                
                logger.info('Also API authentication successful');
                return this.authToken as string;
            }

            throw new Error('Authentication failed: No token received');
        } catch (error: any) {
            logger.error('Also authentication failed:', error.message);
            throw error;
        }
    }

    /**
     * Get valid auth token, refresh if needed
     */
    async getAuthToken(): Promise<string> {
        if (this.authToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.authToken;
        }

        return await this.authenticate();
    }

    /**
     * Proxy request to Also API
     */
    async proxyRequest(
        method: string,
        path: string,
        data?: any,
        headers?: any
    ): Promise<any> {
        try {
            const token = await this.getAuthToken();
            
            const config: AxiosRequestConfig = {
                method: method.toLowerCase() as any,
                url: path,
                headers: {
                    ...headers,
                    'Authorization': `Bearer ${token}`,
                },
            };

            if (data) {
                if (method.toUpperCase() === 'GET') {
                    config.params = data;
                } else {
                    config.data = data;
                }
            }

            logger.info(`Proxying to Also API: ${method} ${path}`);
            const response = await this.client.request(config);
            
            return response.data;
        } catch (error: any) {
            logger.error('Also proxy request failed:', {
                method,
                path,
                error: error.message,
            });
            throw error;
        }
    }
}

export default new AlsoClient();
