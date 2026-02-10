import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload, User } from '../types';
import config from '../config';

class AuthService {
  /**
   * Generate access token
   */
  generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      type: 'access',
    };

    // @ts-ignore - TypeScript version mismatch with jsonwebtoken types
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      type: 'refresh',
    };

    // @ts-ignore - TypeScript version mismatch with jsonwebtoken types
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  }

  /**
   * Verify token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
