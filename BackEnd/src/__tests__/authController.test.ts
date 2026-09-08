import { getProfile, login, logout, register } from '@/controllers/authController.js';
import type { AuthRequest } from '@/middleware/auth.js';
import { authService } from '@/services/auth.service.js';
import type { IUserAttributes } from '@/models/User.js';
import type { Request, Response, NextFunction } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the auth service
vi.mock('@/services/auth.service.js');

describe('authController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
    mockReq = {
      body: {},
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should return 201 on successful registration', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      vi.mocked(authService.register).mockResolvedValue(undefined);

      // Call the async handler wrapper result
      await register(mockReq as Request, mockRes as Response, mockNext);

      expect(authService.register).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
      });
    });

    it('should call next with error when service throws', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123',
      };

      const error = new Error('User with this email already exists');
      vi.mocked(authService.register).mockRejectedValue(error);

      // The asyncHandler returns immediately, need to wait for promise to settle
      register(mockReq as Request, mockRes as Response, mockNext);
      
      // Wait for microtasks to complete
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockNext).toHaveBeenCalled();
      expect((mockNext as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(error);
    });
  });

  describe('login', () => {
    it('should return 200 with tokens on successful login', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      vi.mocked(authService.login).mockResolvedValue(mockResult);

      await login(mockReq as Request, mockRes as Response, mockNext);

      expect(authService.login).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: mockResult.user.id,
          name: mockResult.user.name,
          email: mockResult.user.email,
          createdAt: mockResult.user.createdAt,
        },
      });
    });

    it('should call next with error when service throws', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid email or password');
      vi.mocked(authService.login).mockRejectedValue(error);

      // The asyncHandler returns immediately, need to wait for promise to settle
      login(mockReq as Request, mockRes as Response, mockNext);
      
      // Wait for microtasks to complete
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockNext).toHaveBeenCalled();
      expect((mockNext as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(error);
    });
  });

  describe('getProfile', () => {
    it('should return 200 with user profile', async () => {
      const mockUser: IUserAttributes = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const authReq: Partial<AuthRequest> = {
        user: mockUser,
      };

      await getProfile(authReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt,
        },
      });
    });
  });

  describe('logout', () => {
    it('should return 200 on logout', async () => {
      const authReq: Partial<AuthRequest> = {
        body: { refreshToken: 'test-refresh-token' },
      };

      vi.mocked(authService.logout).mockResolvedValue(undefined);

      await logout(authReq as AuthRequest, mockRes as Response, mockNext);

      expect(authService.logout).toHaveBeenCalledWith('test-refresh-token');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });

    it('should return 200 even without refreshToken', async () => {
      const authReq: Partial<AuthRequest> = {
        body: {},
      };

      await logout(authReq as AuthRequest, mockRes as Response, mockNext);

      expect(authService.logout).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});
