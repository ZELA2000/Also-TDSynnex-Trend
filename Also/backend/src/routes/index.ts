import { Router } from 'express';
import authRoutes from './auth.routes';
import accountRoutes from './account.routes';
import catalogRoutes from './catalog.routes';
import subscriptionRoutes from './subscription.routes';
import reportsRoutes from './reports.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'also-marketplace-backend',
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/', accountRoutes);
router.use('/', catalogRoutes);
router.use('/', subscriptionRoutes);
router.use('/', reportsRoutes);

export default router;
