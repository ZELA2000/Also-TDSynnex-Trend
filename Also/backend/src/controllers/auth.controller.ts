import { Request, Response, NextFunction } from 'express';
import AlsoApiClient from '../client/AlsoApiClient';
import logger from '../utils/logger';
import { AuthenticateRequest } from '../types';

/**
 * Login - Get session token
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const credentials: AuthenticateRequest = req.body;

        if (!credentials.UserName || !credentials.Password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        const apiClient = new AlsoApiClient();
        const token = await apiClient.getSessionToken(credentials);

        res.json({
            success: true,
            token,
            message: 'Authentication successful',
        });
    } catch (error) {
        logger.error('Login failed:', error);
        next(error);
    }
};

/**
 * Validate session - PingPong
 */
export const validateSession = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(token);
        await apiClient.validateSession();

        res.json({
            success: true,
            message: 'Session is valid',
        });
    } catch (error) {
        logger.error('Session validation failed:', error);
        next(error);
    }
};

/**
 * Logout - Terminate session
 */
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(token);
        await apiClient.terminateSession();

        res.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        logger.error('Logout failed:', error);
        next(error);
    }
};
