import { REFRESH_TOKEN_EXPIRES_IN_MS } from '@/constants/env.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '@/errors/index.js';
import RefreshToken from '@/models/RefreshToken.js';
import User, { type IUserAttributes } from '@/models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt.js';
import type { LoginInput, RegisterInputBackend } from '@authforge/shared';

// User data without password
export type SafeUser = Omit<IUserAttributes, 'password'>;

// Login response data
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

// Refresh response data
export interface RefreshResult {
  accessToken: string;
}

// Auth service class
class AuthService {
  // Register a new user
  async register(data: RegisterInputBackend): Promise<void> {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create new user (password hashing handled by model hook)
    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });
  }

  // Login user
  async login(data: LoginInput): Promise<LoginResult> {
    const { email, password } = data;

    // Find user by email with password included
    const user = await User.scope('withPassword').findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_MS),
    });

    // Return user data without password
    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { accessToken, refreshToken, user: safeUser };
  }

  // Refresh access token
  async refreshToken(token: string): Promise<RefreshResult> {
    // Verify the refresh token
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Find token in database
    const storedToken = await RefreshToken.findOne({
      where: { token },
    });

    if (!storedToken) {
      throw new AuthenticationError('Refresh token not found');
    }

    // Check if token is expired
    if (storedToken.isExpired()) {
      await storedToken.destroy();
      throw new AuthenticationError('Refresh token expired');
    }

    // Verify user still exists
    const user = await User.findByPk(payload.userId);
    if (!user) {
      await storedToken.destroy();
      throw new AuthenticationError('User not found');
    }

    // Generate new access token
    const accessToken = generateAccessToken(payload.userId);

    return { accessToken };
  }

  // Logout - revoke refresh token
  async logout(token: string): Promise<void> {
    await RefreshToken.destroy({
      where: { token },
    });
  }

  // Logout from all devices - revoke all refresh tokens for user
  async logoutAll(userId: number): Promise<void> {
    await RefreshToken.destroy({
      where: { userId },
    });
  }

  // Get user by ID
  async getUserById(id: number): Promise<SafeUser> {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
