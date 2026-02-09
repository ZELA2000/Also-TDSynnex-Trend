import { Router, Request, Response } from 'express';
import { trendApiClient } from '../utils/trendApiClient';

const router = Router();

/**
 * Test authentication and connection to Trend Vision One
 * GET /api/auth/test
 */
router.get('/test', async (req: Request, res: Response) => {
    try {
        // Try to fetch account information to verify the API key works
        const response = await trendApiClient.get('/v3.0/iam/accounts');

        res.json({
            success: true,
            message: 'Successfully connected to Trend Vision One API',
            data: {
                connected: true,
                accountsFound: response.data?.items?.length || 0,
            },
        });
    } catch (error: any) {
        console.error('Authentication test failed:', error);

        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Failed to connect to Trend Vision One API',
            error: error.response?.data || error.message,
        });
    }
});

export default router;
