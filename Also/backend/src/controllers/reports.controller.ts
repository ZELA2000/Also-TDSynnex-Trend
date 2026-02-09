import { Response, NextFunction } from 'express';
import AlsoApiClient from '../client/AlsoApiClient';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';
import {
    ExecuteReportRequest,
    GetCreditLimitRequest,
    SetCreditLimitRequest,
} from '../types';

/**
 * Get available reports
 */
export const getReports = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const reports = await apiClient.getReports();

        res.json({
            success: true,
            data: reports,
        });
    } catch (error) {
        logger.error('Failed to get reports:', error);
        next(error);
    }
};

/**
 * Execute a report
 */
export const executeReport = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const reportRequest: ExecuteReportRequest = req.body;

        if (!reportRequest.ReportName) {
            res.status(400).json({ error: 'Report name is required' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const result = await apiClient.executeReport(reportRequest);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        logger.error('Failed to execute report:', error);
        next(error);
    }
};

/**
 * Get credit limit for a company
 */
export const getCreditLimit = async (
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

        const request: GetCreditLimitRequest = { AccountId: accountId };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const creditLimit = await apiClient.getCreditLimit(request);

        res.json({
            success: true,
            data: creditLimit,
        });
    } catch (error) {
        logger.error('Failed to get credit limit:', error);
        next(error);
    }
};

/**
 * Set credit limit for a company
 */
export const setCreditLimit = async (
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

        const { CreditLimit } = req.body;

        const request: SetCreditLimitRequest = {
            AccountId: accountId,
            CreditLimit,
        };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        await apiClient.setCreditLimit(request);

        res.json({
            success: true,
            message: 'Credit limit set successfully',
        });
    } catch (error) {
        logger.error('Failed to set credit limit:', error);
        next(error);
    }
};
