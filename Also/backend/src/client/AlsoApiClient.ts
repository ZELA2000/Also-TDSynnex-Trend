import axios, { AxiosInstance, AxiosError } from 'axios';
import config from '../config';
import logger from '../utils/logger';
import {
    AuthenticateRequest,
    CompanyAccount,
    UpdateCompany,
    Company,
    CreateUserRequest,
    GetUsersRequest,
    Users,
    User,
    MarketplaceInfo,
    SimpleProductInfo,
    GetPossibleServicesForParentRequest,
    GetFieldsForServiceRequest,
    SubscriptionInputDefinition,
    CreateSubscription,
    UpdateSubscription,
    GetSubscriptionRequest,
    GetSubscriptionsRequest,
    Subscription,
    TerminateAccountRequest,
    SetCreditLimitRequest,
    SimpleCreditLimitRecord,
    GetCreditLimitRequest,
    Report,
    ExecuteReportRequest,
    ReportResult,
    AlsoApiError,
} from '../types';

export class AlsoApiClient {
    private axiosInstance: AxiosInstance;
    private sessionToken: string | null = null;

    constructor(baseURL?: string) {
        this.axiosInstance = axios.create({
            baseURL: baseURL || config.alsoApi.baseUrl,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            timeout: 30000,
        });

        // Response interceptor for error handling
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    /**
     * Set the session token for authenticated requests
     */
    setSessionToken(token: string): void {
        this.sessionToken = token;
        logger.info('Session token set');
    }

    /**
     * Clear the session token
     */
    clearSessionToken(): void {
        this.sessionToken = null;
        logger.info('Session token cleared');
    }

    /**
     * Get authentication header with session token
     */
    private getAuthHeader(): Record<string, string> {
        if (!this.sessionToken) {
            throw new Error('No session token available. Please authenticate first.');
        }
        return {
            Authenticate: `CCPSessionId ${this.sessionToken}`,
        };
    }

    /**
     * Handle API errors
     */
    private handleError(error: AxiosError): AlsoApiError {
        if (error.response) {
            logger.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
            });
            return {
                message: error.message || 'API request failed',
                statusCode: error.response.status,
                details: error.response.data,
            };
        } else if (error.request) {
            logger.error('API No Response:', error.request);
            return {
                message: 'No response received from API',
                details: error.request,
            };
        } else {
            logger.error('API Request Error:', error.message);
            return {
                message: error.message || 'Unknown error occurred',
            };
        }
    }

    // ============================================================================
    // Authentication Methods
    // ============================================================================

    /**
     * Get session token by exchanging credentials
     */
    async getSessionToken(credentials: AuthenticateRequest): Promise<string> {
        try {
            const response = await this.axiosInstance.post<string>(
                '/GetSessionToken',
                credentials
            );
            const token = response.data;
            this.setSessionToken(token);
            logger.info('Session token obtained successfully');
            return token;
        } catch (error) {
            logger.error('Failed to get session token', error);
            throw error;
        }
    }

    /**
     * Validate current session (PingPong)
     */
    async validateSession(): Promise<void> {
        try {
            await this.axiosInstance.post(
                '/PingPong',
                {},
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Session validated successfully');
        } catch (error) {
            logger.error('Session validation failed', error);
            throw error;
        }
    }

    /**
     * Terminate current session (logout)
     */
    async terminateSession(): Promise<void> {
        try {
            await this.axiosInstance.post(
                '/TerminateSessionToken',
                {},
                {
                    headers: this.getAuthHeader(),
                }
            );
            this.clearSessionToken();
            logger.info('Session terminated successfully');
        } catch (error) {
            logger.error('Failed to terminate session', error);
            throw error;
        }
    }

    // ============================================================================
    // Company Management Methods
    // ============================================================================

    /**
     * Create a new company
     */
    async createCompany(companyData: CompanyAccount): Promise<Company> {
        try {
            const response = await this.axiosInstance.post<Company>(
                '/CreateCompany',
                companyData,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Company created successfully', { accountId: response.data.AccountId });
            return response.data;
        } catch (error) {
            logger.error('Failed to create company', error);
            throw error;
        }
    }

    /**
     * Update an existing company
     */
    async updateCompany(companyData: UpdateCompany): Promise<void> {
        try {
            await this.axiosInstance.post('/UpdateCompany', companyData, {
                headers: this.getAuthHeader(),
            });
            logger.info('Company updated successfully', { accountId: companyData.Company.AccountId });
        } catch (error) {
            logger.error('Failed to update company', error);
            throw error;
        }
    }

    // ============================================================================
    // User Management Methods
    // ============================================================================

    /**
     * Create a new user
     */
    async createUser(userData: CreateUserRequest): Promise<User> {
        try {
            const response = await this.axiosInstance.post<User>(
                '/CreateUser',
                userData,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('User created successfully', { accountId: response.data.AccountId });
            return response.data;
        } catch (error) {
            logger.error('Failed to create user', error);
            throw error;
        }
    }

    /**
     * Get users for a company
     */
    async getUsers(request: GetUsersRequest): Promise<Users> {
        try {
            const response = await this.axiosInstance.post<Users>(
                '/GetUsers',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Users retrieved successfully', { count: response.data.Users?.length || 0 });
            return response.data;
        } catch (error) {
            logger.error('Failed to get users', error);
            throw error;
        }
    }

    // ============================================================================
    // Marketplace Catalog Methods
    // ============================================================================

    /**
     * Get available marketplaces
     */
    async getMarketplaces(): Promise<MarketplaceInfo[]> {
        try {
            const response = await this.axiosInstance.post<MarketplaceInfo[]>(
                '/GetMarketplaces',
                {},
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Marketplaces retrieved successfully', { count: response.data.length });
            return response.data;
        } catch (error) {
            logger.error('Failed to get marketplaces', error);
            throw error;
        }
    }

    /**
     * Get available services for a marketplace
     */
    async getAvailableServicesForMarketplace(marketplaceId: number): Promise<SimpleProductInfo[]> {
        try {
            const response = await this.axiosInstance.post<SimpleProductInfo[]>(
                '/GetAvailableServicesForMarketplace',
                { MarketplaceId: marketplaceId },
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Services retrieved successfully', { count: response.data.length });
            return response.data;
        } catch (error) {
            logger.error('Failed to get services for marketplace', error);
            throw error;
        }
    }

    /**
     * Get possible services for a parent account
     */
    async getPossibleServicesForParent(request: GetPossibleServicesForParentRequest): Promise<SimpleProductInfo[]> {
        try {
            const response = await this.axiosInstance.post<SimpleProductInfo[]>(
                '/GetPossibleServicesForParent',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Possible services retrieved successfully', { count: response.data.length });
            return response.data;
        } catch (error) {
            logger.error('Failed to get possible services', error);
            throw error;
        }
    }

    /**
     * Get provisioning fields for a service
     */
    async getFieldsForService(request: GetFieldsForServiceRequest): Promise<SubscriptionInputDefinition> {
        try {
            const response = await this.axiosInstance.post<SubscriptionInputDefinition>(
                '/GetFieldsForService',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Fields retrieved successfully', { fieldCount: response.data.Fields?.length || 0 });
            return response.data;
        } catch (error) {
            logger.error('Failed to get fields for service', error);
            throw error;
        }
    }

    // ============================================================================
    // Subscription Management Methods
    // ============================================================================

    /**
     * Create a new subscription
     */
    async createSubscription(subscriptionData: CreateSubscription): Promise<Subscription> {
        try {
            const response = await this.axiosInstance.post<Subscription>(
                '/CreateSubscription',
                subscriptionData,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Subscription created successfully', { accountId: response.data.AccountId });
            return response.data;
        } catch (error) {
            logger.error('Failed to create subscription', error);
            throw error;
        }
    }

    /**
     * Update an existing subscription
     */
    async updateSubscription(subscriptionData: UpdateSubscription): Promise<void> {
        try {
            await this.axiosInstance.post('/UpdateSubscription', subscriptionData, {
                headers: this.getAuthHeader(),
            });
            logger.info('Subscription updated successfully', { accountId: subscriptionData.Subscription.AccountId });
        } catch (error) {
            logger.error('Failed to update subscription', error);
            throw error;
        }
    }

    /**
     * Get a single subscription
     */
    async getSubscription(request: GetSubscriptionRequest): Promise<Subscription> {
        try {
            const response = await this.axiosInstance.post<Subscription>(
                '/GetSubscription',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Subscription retrieved successfully');
            return response.data;
        } catch (error) {
            logger.error('Failed to get subscription', error);
            throw error;
        }
    }

    /**
     * Get all subscriptions for an account
     */
    async getSubscriptions(request: GetSubscriptionsRequest): Promise<Subscription[]> {
        try {
            const response = await this.axiosInstance.post<Subscription[]>(
                '/GetSubscriptions',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Subscriptions retrieved successfully', { count: response.data.length });
            return response.data;
        } catch (error) {
            logger.error('Failed to get subscriptions', error);
            throw error;
        }
    }

    /**
     * Terminate an account (cancel subscription)
     */
    async terminateAccount(request: TerminateAccountRequest): Promise<void> {
        try {
            await this.axiosInstance.post('/TerminateAccount', request, {
                headers: this.getAuthHeader(),
            });
            logger.info('Account terminated successfully', { accountId: request.AccountId });
        } catch (error) {
            logger.error('Failed to terminate account', error);
            throw error;
        }
    }

    // ============================================================================
    // Credit Limit Methods
    // ============================================================================

    /**
     * Get credit limit for a company
     */
    async getCreditLimit(request: GetCreditLimitRequest): Promise<SimpleCreditLimitRecord> {
        try {
            const response = await this.axiosInstance.post<SimpleCreditLimitRecord>(
                '/GetCreditLimit',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Credit limit retrieved successfully');
            return response.data;
        } catch (error) {
            logger.error('Failed to get credit limit', error);
            throw error;
        }
    }

    /**
     * Set credit limit for a company
     */
    async setCreditLimit(request: SetCreditLimitRequest): Promise<void> {
        try {
            await this.axiosInstance.post('/SetCreditLimit', request, {
                headers: this.getAuthHeader(),
            });
            logger.info('Credit limit set successfully', { accountId: request.AccountId });
        } catch (error) {
            logger.error('Failed to set credit limit', error);
            throw error;
        }
    }

    // ============================================================================
    // Report Methods
    // ============================================================================

    /**
     * Get available reports
     */
    async getReports(): Promise<Report[]> {
        try {
            const response = await this.axiosInstance.post<Report[]>(
                '/GetReports',
                {},
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Reports retrieved successfully', { count: response.data.length });
            return response.data;
        } catch (error) {
            logger.error('Failed to get reports', error);
            throw error;
        }
    }

    /**
     * Execute a report
     */
    async executeReport(request: ExecuteReportRequest): Promise<ReportResult> {
        try {
            const response = await this.axiosInstance.post<ReportResult>(
                '/ExecuteReport',
                request,
                {
                    headers: this.getAuthHeader(),
                }
            );
            logger.info('Report executed successfully', { reportName: request.ReportName });
            return response.data;
        } catch (error) {
            logger.error('Failed to execute report', error);
            throw error;
        }
    }
}

export default AlsoApiClient;
