import { Router, Request, Response } from 'express';
import alsoClient from '../clients/AlsoClient';
import logger from '../utils/logger';

const router = Router();

/**
 * Proxy all requests to Also API
 * Removes the /also prefix and forwards to the Also backend
 */
router.all('/*', async (req: Request, res: Response) => {
    try {
        // Remove /api/also prefix and keep the rest of the path
        const apiPath = req.originalUrl.replace('/api/also', '/api');
        
        logger.info(`Proxying Also request: ${req.method} ${apiPath}`);

        const response = await alsoClient.proxyRequest(
            req.method,
            apiPath,
            req.body,
            req.headers
        );

        res.json(response);
    } catch (error: any) {
        logger.error('Also proxy route error:', error.message);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data || { 
            success: false, 
            message: error.message 
        };
        
        res.status(statusCode).json(errorMessage);
    }
});

export default router;
