import { Response, NextFunction } from 'express';
import AlsoApiClient from '../client/AlsoApiClient';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { GetPossibleServicesForParentRequest, GetFieldsForServiceRequest } from '../types';

/**
 * Get available marketplaces
 */
export const getMarketplaces = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const marketplaces = await apiClient.getMarketplaces();

        res.json({
            success: true,
            data: marketplaces,
        });
    } catch (error) {
        logger.error('Failed to get marketplaces:', error);
        next(error);
    }
};

/**
 * Get available services for a marketplace
 */
export const getServicesForMarketplace = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const marketplaceId = parseInt(req.params.id, 10);

        if (isNaN(marketplaceId)) {
            res.status(400).json({ error: 'Invalid marketplace ID' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const services = await apiClient.getAvailableServicesForMarketplace(marketplaceId);

        res.json({
            success: true,
            data: services,
        });
    } catch (error) {
        logger.error('Failed to get services for marketplace:', error);
        next(error);
    }
};

/**
 * Check service eligibility for a customer
 */
export const getEligibleServices = async (
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

        const request: GetPossibleServicesForParentRequest = { AccountId: accountId };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const services = await apiClient.getPossibleServicesForParent(request);

        res.json({
            success: true,
            data: services,
        });
    } catch (error) {
        logger.error('Failed to get eligible services:', error);
        next(error);
    }
};

/**
 * Get provisioning fields for a service
 */
export const getServiceFields = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { accountId, serviceId } = req.params;
        const parsedAccountId = parseInt(accountId, 10);

        if (isNaN(parsedAccountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        if (!serviceId) {
            res.status(400).json({ error: 'Service ID is required' });
            return;
        }

        const request: GetFieldsForServiceRequest = {
            AccountId: parsedAccountId,
            ServiceId: serviceId,
        };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const fields = await apiClient.getFieldsForService(request);

        res.json({
            success: true,
            data: fields,
        });
    } catch (error) {
        logger.error('Failed to get service fields:', error);
        next(error);
    }
};
