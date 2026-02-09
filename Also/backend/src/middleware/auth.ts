import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    sessionToken?: string;
}

/**
 * Middleware to extract and validate session token from Authorization header
 */
export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'No authorization header provided' });
        return;
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: 'Invalid authorization header format. Expected: Bearer <token>' });
        return;
    }

    const token = parts[1];
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    req.sessionToken = token;
    next();
};

export default authMiddleware;
