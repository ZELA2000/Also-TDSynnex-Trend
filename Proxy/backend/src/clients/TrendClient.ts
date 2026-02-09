import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '../config';
import logger from '../utils/logger';

class TrendClient {
    private client: AxiosInstance;
    private apiKey: string;

    constructor() {
        this.apiKey = config.trend.apiKey;
        
        this.client = axios.create({
            baseURL: config.trend.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                logger.error('Trend API error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });
                throw error;
            }
        );
    }

    /**
     * Proxy request to Trend Vision One API
     */
    async proxyRequest(
        method: string,
        path: string,
        data?: any,
        headers?: any
    ): Promise<any> {
        try {
            const config: AxiosRequestConfig = {
                method: method.toLowerCase() as any,
                url: path,
                headers: {
                    ...headers,
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            };

            if (data) {
                if (method.toUpperCase() === 'GET') {
                    config.params = data;
                } else {
                    config.data = data;
                }
            }

            logger.info(`Proxying to Trend API: ${method} ${path}`);
            const response = await this.client.request(config);
            
            return response.data;
        } catch (error: any) {
            logger.error('Trend proxy request failed:', {
                method,
                path,
                error: error.message,
            });
            throw error;
        }
    }
}

export default new TrendClient();
