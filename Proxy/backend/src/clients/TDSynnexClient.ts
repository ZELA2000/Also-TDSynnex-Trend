import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '../config';
import logger from '../utils/logger';
import { TDSynnexAuthTokens } from '../types';

class TDSynnexClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshToken: string;
    private tokenExpiry: number | null = null;

    constructor() {
        this.refreshToken = config.tdsynnex.refreshToken;
        
        this.client = axios.create({
            baseURL: config.tdsynnex.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                logger.error('TDSynnex API error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });
                throw error;
            }
        );
    }

    /**
     * Get access token from refresh token
     */
    async authenticate(): Promise<string> {
        try {
            logger.info('Authenticating with TDSynnex API...');
            
            const response = await this.client.post('/api/auth/token', {
                refreshToken: this.refreshToken,
            });

            if (response.data.accessToken) {
                this.accessToken = response.data.accessToken;
                
                // Update refresh token if a new one is provided
                if (response.data.refreshToken) {
                    this.refreshToken = response.data.refreshToken;
                }
                
                // Set token expiry (usually 1 hour, setting to 50 minutes to be safe)
                this.tokenExpiry = Date.now() + (50 * 60 * 1000);
                
                logger.info('TDSynnex API authentication successful');
                return this.accessToken as string;
            }

            throw new Error('Authentication failed: No access token received');
        } catch (error: any) {
            logger.error('TDSynnex authentication failed:', error.message);
            throw error;
        }
    }

    /**
     * Get valid access token, refresh if needed
     */
    async getAuthToken(): Promise<string> {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken as string;
        }

        return await this.authenticate();
    }

    /**
     * Proxy request to TDSynnex API
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

            logger.info(`Proxying to TDSynnex API: ${method} ${path}`);
            const response = await this.client.request(config);
            
            return response.data;
        } catch (error: any) {
            logger.error('TDSynnex proxy request failed:', {
                method,
                path,
                error: error.message,
            });
            throw error;
        }
    }
}

export default new TDSynnexClient();
