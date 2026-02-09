import { Response, NextFunction } from 'express';
import AlsoApiClient from '../client/AlsoApiClient';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';
import {
    CreateSubscription,
    UpdateSubscription,
    GetSubscriptionRequest,
    GetSubscriptionsRequest,
    TerminateAccountRequest,
} from '../types';

/**
 * Create a new subscription
 */
export const createSubscription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const subscriptionData: CreateSubscription = req.body;

        if (!subscriptionData.Subscription) {
            res.status(400).json({ error: 'Subscription data is required' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const subscription = await apiClient.createSubscription(subscriptionData);

        res.status(201).json({
            success: true,
            data: subscription,
            message: 'Subscription created successfully',
        });
    } catch (error) {
        logger.error('Failed to create subscription:', error);
        next(error);
    }
};

/**
 * Update an existing subscription
 */
export const updateSubscription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accountId = parseInt(req.params.id, 10);
        const subscriptionData: UpdateSubscription = req.body;

        if (!subscriptionData.Subscription) {
            res.status(400).json({ error: 'Subscription data is required' });
            return;
        }

        // Ensure AccountId matches the URL parameter
        subscriptionData.Subscription.AccountId = accountId;

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        await apiClient.updateSubscription(subscriptionData);

        res.json({
            success: true,
            message: 'Subscription updated successfully',
        });
    } catch (error) {
        logger.error('Failed to update subscription:', error);
        next(error);
    }
};

/**
 * Get a single subscription
 */
export const getSubscription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accountId = parseInt(req.params.id, 10);

        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const request: GetSubscriptionRequest = { AccountId: accountId };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const subscription = await apiClient.getSubscription(request);

        res.json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        logger.error('Failed to get subscription:', error);
        next(error);
    }
};

/**
 * Get all subscriptions for an account
 */
export const getSubscriptions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accountId = parseInt(req.params.accountId, 10);

        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const includeChildNodes = req.query.includeChildNodes === 'true';

        const request: GetSubscriptionsRequest = {
            AccountId: accountId,
            IncludeChildNodes: includeChildNodes,
        };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const subscriptions = await apiClient.getSubscriptions(request);

        res.json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        logger.error('Failed to get subscriptions:', error);
        next(error);
    }
};

/**
 * Terminate a subscription
 */
export const terminateSubscription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accountId = parseInt(req.params.id, 10);

        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const reason = req.body.Reason || 'Termination requested';

        const request: TerminateAccountRequest = {
            AccountId: accountId,
            Reason: reason,
        };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        await apiClient.terminateAccount(request);

        res.json({
            success: true,
            message: 'Subscription terminated successfully',
        });
    } catch (error) {
        logger.error('Failed to terminate subscription:', error);
        next(error);
    }
};
