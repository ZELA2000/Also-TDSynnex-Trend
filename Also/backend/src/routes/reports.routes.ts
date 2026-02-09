import { Router } from 'express';
import * as reportsController from '../controllers/reports.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/reports
 * @desc    Get available reports
 * @access  Protected
 */
router.get('/reports', reportsController.getReports);

/**
 * @route   POST /api/reports/execute
 * @desc    Execute a report
 * @access  Protected
 */
router.post('/reports/execute', reportsController.executeReport);

/**
 * @route   GET /api/credit-limit/:accountId
 * @desc    Get credit limit for a company
 * @access  Protected
 */
router.get('/credit-limit/:accountId', reportsController.getCreditLimit);

/**
 * @route   PUT /api/credit-limit/:accountId
 * @desc    Set credit limit for a company
 * @access  Protected
 */
router.put('/credit-limit/:accountId', reportsController.setCreditLimit);

export default router;
