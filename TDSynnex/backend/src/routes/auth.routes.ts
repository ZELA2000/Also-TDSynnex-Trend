import { Router } from 'express';
import { authController } from '../controllers/AuthController';

const router = Router();

// POST /api/auth/token - Get new token
router.post('/token', (req, res, next) => authController.getToken(req, res, next));

// POST /api/auth/refresh - Refresh token
router.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));

// POST /api/auth/validate - Validate token
router.post('/validate', (req, res, next) => authController.validateToken(req, res, next));

// GET /api/auth/status - Get auth status
router.get('/status', (req, res, next) => authController.getStatus(req, res, next));

// POST /api/auth/logout - Clear cache
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

export default router;
