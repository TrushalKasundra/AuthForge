import { AuthenticationError } from '@/errors/index.js';
import { auth, type AuthRequest } from '@/middleware/auth.js';
import User, { IUserAttributes } from '@/models/User.js';
import { verifyToken } from '@/utils/jwt.js';
import type { Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/utils/jwt.js');
vi.mock('@/models/User.js');

// Mock user instance type for testing
type MockUserInstance = Partial<IUserAttributes> & {
  get: ReturnType<typeof vi.fn>;
};

describe('auth middleware', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: ReturnType<typeof vi.fn>;
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
      headers: {},
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('protect', () => {
    it('should call next with AuthenticationError if no authorization header', async () => {
      mockReq.headers = {};

      await auth(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
      const error = mockNext.mock.calls[0][0] as AuthenticationError;
      expect(error.message).toBe('Not authorized, no token provided');
      expect(error.statusCode).toBe(401);
    });

    it('should call next with AuthenticationError if authorization header does not start with Bearer', async () => {
      mockReq.headers = { authorization: 'Basic token123' };

      await auth(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
      const error = mockNext.mock.calls[0][0] as AuthenticationError;
      expect(error.message).toBe('Not authorized, no token provided');
    });

    it('should call next with AuthenticationError if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      vi.mocked(verifyToken).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await auth(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
      const error = mockNext.mock.calls[0][0] as AuthenticationError;
      expect(error.message).toBe('Not authorized, token invalid or expired');
    });

    it('should call next with AuthenticationError if user not found', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };

      vi.mocked(verifyToken).mockReturnValue({ userId: 1 });
      vi.mocked(User.findByPk).mockResolvedValue(null);

      await auth(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
      const error = mockNext.mock.calls[0][0] as AuthenticationError;
      expect(error.message).toBe('User not found');
    });

    it('should call next() and attach user on valid token', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };

      const mockUser: MockUserInstance = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        get: vi.fn().mockReturnValue({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        }),
      };

      vi.mocked(verifyToken).mockReturnValue({ userId: 1 });
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as unknown as User);

      await auth(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer header', async () => {
      mockReq.headers = { authorization: 'Bearer my-secret-token' };

      const mockUser: MockUserInstance = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        get: vi.fn().mockReturnValue({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        }),
      };

      vi.mocked(verifyToken).mockReturnValue({ userId: 1 });
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as unknown as User);

      await auth(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('my-secret-token');
    });
  });
});
