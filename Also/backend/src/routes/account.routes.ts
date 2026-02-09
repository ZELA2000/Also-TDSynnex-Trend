import { Router } from 'express';
import * as accountController from '../controllers/account.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/companies
 * @desc    Create a new company
 * @access  Protected
 */
router.post('/companies', accountController.createCompany);

/**
 * @route   PUT /api/companies/:id
 * @desc    Update an existing company
 * @access  Protected
 */
router.put('/companies/:id', accountController.updateCompany);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Protected
 */
router.post('/users', accountController.createUser);

/**
 * @route   GET /api/users/:accountId
 * @desc    Get all users for a company
 * @access  Protected
 */
router.get('/users/:accountId', accountController.getUsers);

export default router;
