import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Authentication required', 401);
    }

    // Extract token (optional validation can be added here)
    const token = authHeader.substring(7);

    // Attach token to request for later use
    (req as any).token = token;

    next();
};
