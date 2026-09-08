import { AuthenticationError } from '@/errors/index.js';
import User, { type IUserAttributes } from '@/models/User.js';
import { verifyToken } from '@/utils/jwt.js';
import type { NextFunction, Request, Response } from 'express';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: IUserAttributes;
}

// Authentication middleware
export const auth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found
    if (!token) {
      throw new AuthenticationError('Not authorized, no token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token (password excluded by default scope)
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Attach user to request
    req.user = user.get({ plain: true }) as IUserAttributes;
    next();
  } catch (error) {
    // Re-throw AuthenticationError as-is, wrap others
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Not authorized, token invalid or expired'));
    }
  }
};
