import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config';
import { TrendApiError } from '../types';

class TrendApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.trendBaseUrl,
            headers: {
                'Authorization': `Bearer ${config.trendApiKey}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
            timeout: 30000,
        });

        // Request interceptor for logging
        this.client.interceptors.request.use(
            (request) => {
                console.log(`[Trend API] ${request.method?.toUpperCase()} ${request.url}`);
                return request;
            },
            (error) => {
                console.error('[Trend API] Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for logging and error handling
        this.client.interceptors.response.use(
            (response) => {
                console.log(`[Trend API] Response ${response.status} from ${response.config.url}`);
                return response;
            },
            (error: AxiosError<TrendApiError>) => {
                if (error.response) {
                    console.error(`[Trend API] Error ${error.response.status}:`, error.response.data);
                } else if (error.request) {
                    console.error('[Trend API] No response received:', error.message);
                } else {
                    console.error('[Trend API] Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    public getClient(): AxiosInstance {
        return this.client;
    }
}

export const trendApiClient = new TrendApiClient().getClient();
