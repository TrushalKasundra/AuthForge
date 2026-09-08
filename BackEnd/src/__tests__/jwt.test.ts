import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt.js';

// Mock environment
vi.stubEnv('JWT_SECRET', 'test-secret-key');

describe('jwt utilities', () => {
  const mockUserId = 123;

  describe('generateAccessToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateAccessToken(mockUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include userId in token payload', () => {
      const token = generateAccessToken(mockUserId);
      const decoded = jwt.decode(token) as { userId: number };

      expect(decoded.userId).toBe(mockUserId);
    });

    it('should set expiration in token', () => {
      const token = generateAccessToken(mockUserId);
      const decoded = jwt.decode(token) as { exp: number; iat: number };

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      // Access token should expire in 15 minutes (900 seconds)
      expect(decoded.exp - decoded.iat).toBe(900);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid token', () => {
      const token = generateAccessToken(mockUserId);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(mockUserId);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create an expired token manually
      const expiredToken = jwt.sign(
        { userId: mockUserId },
        process.env.JWT_SECRET as string,
        { expiresIn: '-1s' } // Already expired
      );

      expect(() => verifyAccessToken(expiredToken)).toThrow();
    });

    it('should throw error for token with wrong secret', () => {
      const wrongSecretToken = jwt.sign(
        { userId: mockUserId },
        'wrong-secret',
        { expiresIn: '1d' }
      );

      expect(() => verifyAccessToken(wrongSecretToken)).toThrow();
    });

    it('should throw error for malformed token', () => {
      expect(() => verifyAccessToken('not.a.valid.jwt.token')).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(mockUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should set 7 day expiration', () => {
      const token = generateRefreshToken(mockUserId);
      const decoded = jwt.decode(token) as { exp: number; iat: number };

      // Refresh token should expire in 7 days (604800 seconds)
      expect(decoded.exp - decoded.iat).toBe(604800);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const token = generateRefreshToken(mockUserId);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockUserId);
    });
  });
});
