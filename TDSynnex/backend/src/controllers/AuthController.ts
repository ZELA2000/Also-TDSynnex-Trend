import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
    /**
     * POST /api/auth/token
     * Get a new access token using refresh token or credentials
     */
    public async getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { grant_type, username, password, refresh_token } = req.body;

            let tokenResponse;

            if (grant_type === 'password' && username && password) {
                tokenResponse = await authService.login(username, password);
            } else if (grant_type === 'refresh_token' && refresh_token) {
                // Temporarily use the provided refresh token
                const response = await authService.refreshToken();
                tokenResponse = response;
            } else {
                throw new AppError('Invalid grant_type or missing credentials', 400);
            }

            res.json({
                success: true,
                data: tokenResponse,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/refresh
     * Refresh the current access token
     */
    public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tokenResponse = await authService.refreshToken();

            res.json({
                success: true,
                data: tokenResponse,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/validate
     * Validate an access token
     */
    public async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { access_token } = req.body;

            if (!access_token) {
                throw new AppError('access_token is required', 400);
            }

            const validationResponse = await authService.validateToken(access_token);

            res.json({
                success: true,
                data: validationResponse,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/status
     * Get current authentication status
     */
    public async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tokenInfo = authService.getTokenInfo();

            res.json({
                success: true,
                data: tokenInfo,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Clear cached tokens
     */
    public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            authService.clearCache();

            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
