import {
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/constants/env.js';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: number;
}

// Generate access token (short-lived)
export const generateAccessToken = (userId: number): string => {
  const payload: TokenPayload = { userId };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId: number): string => {
  const payload: TokenPayload = { userId };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

// Legacy exports for backward compatibility
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
