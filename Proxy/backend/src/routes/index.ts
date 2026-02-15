import { Router, Request, Response } from 'express';
import alsoRoutes from './also.routes';
import tdsynnexRoutes from './tdsynnex.routes';
import trendRoutes from './trend.routes';
import reportsRoutes from './reports.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Unified API Proxy',
        uptime: process.uptime(),
        apis: {
            also: 'available',
            tdsynnex: 'available',
            trend: 'available',
        },
    });
});

// API Status endpoint
router.get('/status', (req: Request, res: Response) => {
    res.json({
        version: '1.0.0',
        apis: [
            {
                name: 'Also Marketplace',
                prefix: '/api/also',
                status: 'active',
                description: 'Marketplace, subscriptions, account management',
            },
            {
                name: 'TDSynnex StreamOne',
                prefix: '/api/tdsynnex',
                status: 'active',
                description: 'Cloud products, customers, orders',
            },
            {
                name: 'Trend Vision One',
                prefix: '/api/trend',
                status: 'active',
                description: 'XDR security, alerts, endpoint management',
            },
        ],
    });
});

// Mount API routes
router.use('/also', alsoRoutes);
router.use('/tdsynnex', tdsynnexRoutes);
router.use('/trend', trendRoutes);
router.use('/reports', reportsRoutes);

export default router;
