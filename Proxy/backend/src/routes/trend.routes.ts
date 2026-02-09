import { Router, Request, Response } from 'express';
import trendClient from '../clients/TrendClient';
import logger from '../utils/logger';

const router = Router();

/**
 * Proxy all requests to Trend Vision One API
 * Removes the /trend prefix and forwards to the Trend backend
 */
router.all('/*', async (req: Request, res: Response) => {
    try {
        // Remove /api/trend prefix and keep the rest of the path
        const apiPath = req.originalUrl.replace('/api/trend', '/api');
        
        logger.info(`Proxying Trend request: ${req.method} ${apiPath}`);

        const response = await trendClient.proxyRequest(
            req.method,
            apiPath,
            req.body,
            req.headers
        );

        res.json(response);
    } catch (error: any) {
        logger.error('Trend proxy route error:', error.message);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data || { 
            success: false, 
            message: error.message 
        };
        
        res.status(statusCode).json(errorMessage);
    }
});

export default router;
