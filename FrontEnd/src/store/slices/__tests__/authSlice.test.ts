import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  authSlice,
  setCredentials,
  setUser,
  setAccessToken,
  setLoading,
  setInitialized,
  logout,
  selectUser,
  selectAccessToken,
  selectRefreshToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialized,
  type AuthState,
} from '../authSlice';

// Mock storage utilities
vi.mock('@/utils/storage', () => ({
  getToken: vi.fn(() => null),
  getRefreshToken: vi.fn(() => null),
  setToken: vi.fn(),
  setRefreshToken: vi.fn(),
  clearAuthStorage: vi.fn(),
}));

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isInitialized: false,
  };

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2024-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return initial state', () => {
      const result = authSlice.reducer(undefined, { type: 'unknown' });
      expect(result.user).toBeNull();
      expect(result.isLoading).toBe(true);
      expect(result.isInitialized).toBe(false);
    });

    it('should handle setCredentials', () => {
      const payload = {
        user: mockUser,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      };
      const result = authSlice.reducer(initialState, setCredentials(payload));

      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('test-access-token');
      expect(result.refreshToken).toBe('test-refresh-token');
      expect(result.isLoading).toBe(false);
      expect(result.isInitialized).toBe(true);
    });

    it('should handle setUser', () => {
      const result = authSlice.reducer(initialState, setUser(mockUser));

      expect(result.user).toEqual(mockUser);
      expect(result.isLoading).toBe(false);
      expect(result.isInitialized).toBe(true);
    });

    it('should handle setAccessToken', () => {
      const result = authSlice.reducer(initialState, setAccessToken('new-token'));

      expect(result.accessToken).toBe('new-token');
    });

    it('should handle setLoading', () => {
      const result = authSlice.reducer(initialState, setLoading(false));

      expect(result.isLoading).toBe(false);
    });

    it('should handle setInitialized', () => {
      const result = authSlice.reducer(initialState, setInitialized(true));

      expect(result.isInitialized).toBe(true);
      expect(result.isLoading).toBe(false);
    });

    it('should handle logout', () => {
      const loggedInState: AuthState = {
        user: mockUser,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        isLoading: false,
        isInitialized: true,
      };

      const result = authSlice.reducer(loggedInState, logout());

      expect(result.user).toBeNull();
      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
      expect(result.isLoading).toBe(false);
      expect(result.isInitialized).toBe(true);
    });
  });

  describe('selectors', () => {
    const mockState = {
      auth: {
        user: mockUser,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        isLoading: false,
        isInitialized: true,
      },
      ui: { sidebarOpen: true, globalLoading: false },
      authApi: {},
    };

    it('should select user', () => {
      expect(selectUser(mockState as never)).toEqual(mockUser);
    });

    it('should select accessToken', () => {
      expect(selectAccessToken(mockState as never)).toBe('test-access-token');
    });

    it('should select refreshToken', () => {
      expect(selectRefreshToken(mockState as never)).toBe('test-refresh-token');
    });

    it('should select isAuthenticated as true when user exists', () => {
      expect(selectIsAuthenticated(mockState as never)).toBe(true);
    });

    it('should select isAuthenticated as false when user is null', () => {
      const stateWithoutUser = {
        ...mockState,
        auth: { ...mockState.auth, user: null },
      };
      expect(selectIsAuthenticated(stateWithoutUser as never)).toBe(false);
    });

    it('should select isLoading', () => {
      expect(selectIsLoading(mockState as never)).toBe(false);
    });

    it('should select isInitialized', () => {
      expect(selectIsInitialized(mockState as never)).toBe(true);
    });
  });
});
