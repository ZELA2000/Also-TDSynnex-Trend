import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AlsoApiErrorResponse {
    error: string;
    statusCode?: number;
    details?: any;
}

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error('Error caught by error handler:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    const statusCode = err.statusCode || 500;
    const errorResponse: AlsoApiErrorResponse = {
        error: err.message || 'Internal Server Error',
        statusCode,
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.details = err.details || err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
