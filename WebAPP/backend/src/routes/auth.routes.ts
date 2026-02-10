import { Router, Request, Response } from 'express';
import { userService } from '../services/UserService';
import { authService } from '../services/AuthService';
import { LoginRequest, RefreshTokenRequest } from '../types';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginRequest;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Validate credentials
    const user = await userService.validateCredentials(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    await userService.updateLastLogin(user.id);

    // Generate tokens
    const token = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    res.json({
      success: true,
      token,
      refreshToken,
      user: userService.sanitizeUser(user),
      expiresIn: '24h',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshTokenRequest;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const payload = authService.verifyToken(refreshToken);

    if (!payload || payload.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Get user
    const user = await userService.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new tokens
    const newToken = authService.generateAccessToken(user);
    const newRefreshToken = authService.generateRefreshToken(user);

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req: any, res: Response) => {
  try {
    const user = await userService.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: userService.sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user info',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
