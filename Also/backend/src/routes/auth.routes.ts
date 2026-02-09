import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate and get session token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/validate
 * @desc    Validate current session token
 * @access  Protected
 */
router.post('/validate', authController.validateSession);

/**
 * @route   POST /api/auth/logout
 * @desc    Terminate session
 * @access  Protected
 */
router.post('/logout', authController.logout);

export default router;
