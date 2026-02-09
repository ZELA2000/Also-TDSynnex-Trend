import { apiClient } from '../utils/apiClient';
import { TokenResponse, ValidateTokenResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

interface TokenCache {
    access_token: string;
    refresh_token: string;
    access_expires_at: number;
    refresh_expires_at: number;
}

class AuthService {
    private tokenCache: TokenCache | null = null;

    /**
     * Get a valid access token (from cache or by refreshing)
     */
    public async getAccessToken(): Promise<string> {
        // Check if we have a valid cached token
        if (this.tokenCache && this.tokenCache.access_expires_at > Date.now()) {
            return this.tokenCache.access_token;
        }

        // Token expired or not available, refresh it
        await this.refreshToken();

        if (!this.tokenCache) {
            throw new Error('Failed to obtain access token');
        }

        return this.tokenCache.access_token;
    }

    /**
     * Request a new token using refresh_token grant type
     */
    public async refreshToken(): Promise<TokenResponse> {
        const refreshToken = this.tokenCache?.refresh_token || process.env.TDSYNNEX_REFRESH_TOKEN;

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);

        try {
            const response = await apiClient.postForm<TokenResponse>(
                '/oauth/token',
                params.toString()
            );

            // Cache the new token
            this.cacheToken(response);

            return response;
        } catch (error: any) {
            console.error('Token refresh failed:', error.message);
            throw new Error('Failed to refresh token');
        }
    }

    /**
     * Request a new token using password grant type
     */
    public async login(username: string, password: string): Promise<TokenResponse> {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);

        try {
            const response = await apiClient.postForm<TokenResponse>(
                '/oauth/token',
                params.toString()
            );

            // Cache the new token
            this.cacheToken(response);

            return response;
        } catch (error: any) {
            console.error('Login failed:', error.message);
            throw new Error('Authentication failed');
        }
    }

    /**
     * Validate an access token
     */
    public async validateToken(accessToken: string): Promise<ValidateTokenResponse> {
        const params = new URLSearchParams();
        params.append('access_token', accessToken);

        try {
            const response = await apiClient.postForm<ValidateTokenResponse>(
                '/oauth/validateAccess',
                params.toString()
            );

            return response;
        } catch (error: any) {
            console.error('Token validation failed:', error.message);
            throw new Error('Token validation failed');
        }
    }

    /**
     * Cache token with expiration times
     */
    private cacheToken(tokenResponse: TokenResponse): void {
        const now = Date.now();

        this.tokenCache = {
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            access_expires_at: now + (tokenResponse.expires_in * 1000) - 60000, // 1 minute buffer
            refresh_expires_at: now + (32 * 24 * 60 * 60 * 1000), // 32 days
        };

        console.log('Token cached successfully. Expires in:', tokenResponse.expires_in, 'seconds');
    }

    /**
     * Clear the token cache (logout)
     */
    public clearCache(): void {
        this.tokenCache = null;
    }

    /**
     * Get current token info (for debugging)
     */
    public getTokenInfo(): { hasToken: boolean; expiresIn?: number } {
        if (!this.tokenCache) {
            return { hasToken: false };
        }

        const expiresIn = Math.floor((this.tokenCache.access_expires_at - Date.now()) / 1000);
        return {
            hasToken: true,
            expiresIn: expiresIn > 0 ? expiresIn : 0,
        };
    }
}

// Export singleton instance
export const authService = new AuthService();
