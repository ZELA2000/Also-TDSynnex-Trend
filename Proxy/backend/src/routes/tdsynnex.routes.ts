import { Router, Request, Response } from 'express';
import tdsynnexClient from '../clients/TDSynnexClient';
import logger from '../utils/logger';

const router = Router();

/**
 * Proxy all requests to TDSynnex API
 * Removes the /tdsynnex prefix and forwards to the TDSynnex backend
 */
router.all('/*', async (req: Request, res: Response) => {
    try {
        // Remove /api/tdsynnex prefix and keep the rest of the path
        const apiPath = req.originalUrl.replace('/api/tdsynnex', '/api');
        
        logger.info(`Proxying TDSynnex request: ${req.method} ${apiPath}`);

        const response = await tdsynnexClient.proxyRequest(
            req.method,
            apiPath,
            req.body,
            req.headers
        );

        res.json(response);
    } catch (error: any) {
        logger.error('TDSynnex proxy route error:', error.message);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data || { 
            success: false, 
            message: error.message 
        };
        
        res.status(statusCode).json(errorMessage);
    }
});

export default router;
