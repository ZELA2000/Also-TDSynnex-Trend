import { Response, NextFunction } from 'express';
import AlsoApiClient from '../client/AlsoApiClient';
import { AuthenticatedRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { CompanyAccount, UpdateCompany, CreateUserRequest, GetUsersRequest } from '../types';

/**
 * Create a new company
 */
export const createCompany = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const companyData: CompanyAccount = req.body;

        if (!companyData.Company) {
            res.status(400).json({ error: 'Company data is required' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const company = await apiClient.createCompany(companyData);

        res.status(201).json({
            success: true,
            data: company,
            message: 'Company created successfully',
        });
    } catch (error) {
        logger.error('Failed to create company:', error);
        next(error);
    }
};

/**
 * Update an existing company
 */
export const updateCompany = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accountId = parseInt(req.params.id, 10);
        const companyData: UpdateCompany = req.body;

        if (!companyData.Company) {
            res.status(400).json({ error: 'Company data is required' });
            return;
        }

        // Ensure AccountId matches the URL parameter
        companyData.Company.AccountId = accountId;

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        await apiClient.updateCompany(companyData);

        res.json({
            success: true,
            message: 'Company updated successfully',
        });
    } catch (error) {
        logger.error('Failed to update company:', error);
        next(error);
    }
};

/**
 * Create a new user
 */
export const createUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userData: CreateUserRequest = req.body;

        if (!userData.User) {
            res.status(400).json({ error: 'User data is required' });
            return;
        }

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const user = await apiClient.createUser(userData);

        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully',
        });
    } catch (error) {
        logger.error('Failed to create user:', error);
        next(error);
    }
};

/**
 * Get users for a company
 */
export const getUsers = async (
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

        const request: GetUsersRequest = { AccountId: accountId };

        const apiClient = new AlsoApiClient();
        apiClient.setSessionToken(req.sessionToken!);
        const users = await apiClient.getUsers(request);

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        logger.error('Failed to get users:', error);
        next(error);
    }
};
