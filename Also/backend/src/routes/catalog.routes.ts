import { Router } from 'express';
import * as catalogController from '../controllers/catalog.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/marketplaces
 * @desc    Get available marketplaces
 * @access  Protected
 */
router.get('/marketplaces', catalogController.getMarketplaces);

/**
 * @route   GET /api/marketplaces/:id/services
 * @desc    Get available services for a marketplace
 * @access  Protected
 */
router.get('/marketplaces/:id/services', catalogController.getServicesForMarketplace);

/**
 * @route   GET /api/services/eligible/:accountId
 * @desc    Check which services a customer can subscribe to
 * @access  Protected
 */
router.get('/services/eligible/:accountId', catalogController.getEligibleServices);

/**
 * @route   GET /api/services/:serviceId/fields/:accountId
 * @desc    Get provisioning fields for a service
 * @access  Protected
 */
router.get('/services/:serviceId/fields/:accountId', catalogController.getServiceFields);

export default router;
