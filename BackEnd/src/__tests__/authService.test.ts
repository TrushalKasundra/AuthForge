import { authService } from '@/services/auth.service.js';
import type { LoginInput, RegisterInputBackend } from '@authforge/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the User model and jwt utils at the service level
vi.mock('@/models/User.js');
vi.mock('@/models/RefreshToken.js', () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
    destroy: vi.fn(),
    belongsTo: vi.fn(),
  },
}));
vi.mock('@/utils/jwt.js');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictError if user already exists', async () => {
      const { default: User } = await import('@/models/User.js');

      const registerData: RegisterInputBackend = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123',
      };

      vi.mocked(User.findOne).mockResolvedValue({ email: 'existing@example.com' } as never);

      await expect(authService.register(registerData)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should create user successfully', async () => {
      const { default: User } = await import('@/models/User.js');

      const registerData: RegisterInputBackend = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      };

      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(User.create).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      } as never);

      await expect(authService.register(registerData)).resolves.toBeUndefined();

      expect(User.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  describe('login', () => {
    it('should throw AuthenticationError if user not found', async () => {
      const { default: User } = await import('@/models/User.js');

      const loginData: LoginInput = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      vi.mocked(User.scope).mockReturnValue({
        findOne: vi.fn().mockResolvedValue(null),
      } as never);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw AuthenticationError if password is incorrect', async () => {
      const { default: User } = await import('@/models/User.js');

      const loginData: LoginInput = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        comparePassword: vi.fn().mockResolvedValue(false),
      };

      vi.mocked(User.scope).mockReturnValue({
        findOne: vi.fn().mockResolvedValue(mockUser),
      } as never);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should return tokens and user on successful login', async () => {
      const { default: User } = await import('@/models/User.js');
      const { generateAccessToken, generateRefreshToken } = await import('@/utils/jwt.js');

      const loginData: LoginInput = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(User.scope).mockReturnValue({
        findOne: vi.fn().mockResolvedValue(mockUser),
      } as never);
      vi.mocked(generateAccessToken).mockReturnValue('mock-access-token');
      vi.mocked(generateRefreshToken).mockReturnValue('mock-refresh-token');

      // Mock RefreshToken.create
      const { default: RefreshToken } = await import('@/models/RefreshToken.js');
      vi.mocked(RefreshToken.create).mockResolvedValue({} as never);

      const result = await authService.login(loginData);

      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
      expect(result.user.id).toBe(1);
      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('getUserById', () => {
    it('should throw NotFoundError if user not found', async () => {
      const { default: User } = await import('@/models/User.js');

      vi.mocked(User.findByPk).mockResolvedValue(null);

      await expect(authService.getUserById(999)).rejects.toThrow(
        'User not found'
      );
    });

    it('should return user without password', async () => {
      const { default: User } = await import('@/models/User.js');

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(User.findByPk).mockResolvedValue(mockUser as never);

      const result = await authService.getUserById(1);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('password');
    });
  });
});
