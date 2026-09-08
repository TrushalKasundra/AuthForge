import type { AuthRequest } from '@/middleware/auth.js';
import { asyncHandler } from '@/middleware/errorHandler.js';
import { authService } from '@/services/index.js';
import type { Request, Response } from 'express';

// @desc    Register new user
// @route   POST /api/register
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  }
);

// @desc    Login user
// @route   POST /api/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { accessToken, refreshToken, user } = await authService.login(req.body);

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  }
);

// @desc    Refresh access token
// @route   POST /api/refresh-token
// @access  Public (requires valid refresh token in body)
export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    const { accessToken } = await authService.refreshToken(token);

    res.status(200).json({
      success: true,
      accessToken,
    });
  }
);

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user!;

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  }
);

// @desc    Logout user - revoke refresh token
// @route   POST /api/logout
// @access  Private
export const logout = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);
