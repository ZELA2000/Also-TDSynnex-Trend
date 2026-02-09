import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription
 * @access  Protected
 */
router.post('/subscriptions', subscriptionController.createSubscription);

/**
 * @route   PUT /api/subscriptions/:id
 * @desc    Update an existing subscription
 * @access  Protected
 */
router.put('/subscriptions/:id', subscriptionController.updateSubscription);

/**
 * @route   GET /api/subscriptions/:id
 * @desc    Get a single subscription
 * @access  Protected
 */
router.get('/subscriptions/:id', subscriptionController.getSubscription);

/**
 * @route   GET /api/subscriptions/account/:accountId
 * @desc    Get all subscriptions for an account
 * @access  Protected
 */
router.get('/subscriptions/account/:accountId', subscriptionController.getSubscriptions);

/**
 * @route   DELETE /api/subscriptions/:id
 * @desc    Terminate a subscription
 * @access  Protected
 */
router.delete('/subscriptions/:id', subscriptionController.terminateSubscription);

export default router;
