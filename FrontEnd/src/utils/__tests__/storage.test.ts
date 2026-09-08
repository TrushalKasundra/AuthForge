import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuthStorage,
} from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants';

describe('storage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Token storage', () => {
    it('should return null when no token exists', () => {
      expect(getToken()).toBeNull();
    });

    it('should set and get token', () => {
      setToken('test-token-123');
      expect(getToken()).toBe('test-token-123');
    });

    it('should remove token', () => {
      setToken('test-token-123');
      expect(getToken()).toBe('test-token-123');

      removeToken();
      expect(getToken()).toBeNull();
    });

    it('should overwrite existing token', () => {
      setToken('first-token');
      setToken('second-token');
      expect(getToken()).toBe('second-token');
    });
  });

  describe('User storage', () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
    };

    it('should return null when no user exists', () => {
      expect(getStoredUser()).toBeNull();
    });

    it('should set and get user (as JSON string)', () => {
      setStoredUser(mockUser);
      expect(getStoredUser()).toBe(JSON.stringify(mockUser));
    });

    it('should remove user', () => {
      setStoredUser(mockUser);
      expect(getStoredUser()).not.toBeNull();

      removeStoredUser();
      expect(getStoredUser()).toBeNull();
    });

    it('should store user as JSON', () => {
      setStoredUser(mockUser);
      const storedValue = getStoredUser();
      expect(storedValue).toBe(JSON.stringify(mockUser));

      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        expect(parsed).toEqual(mockUser);
      }
    });
  });

  describe('clearAuthStorage', () => {
    it('should clear both token and user', () => {
      setToken('test-token');
      setStoredUser({ id: '123', name: 'Test' });

      expect(getToken()).not.toBeNull();
      expect(getStoredUser()).not.toBeNull();

      clearAuthStorage();

      expect(getToken()).toBeNull();
      expect(getStoredUser()).toBeNull();
    });

    it('should not throw when storage is already empty', () => {
      expect(() => clearAuthStorage()).not.toThrow();
    });
  });

  describe('localStorage interaction', () => {
    it('should use correct keys for token', () => {
      setToken('test-token');
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('test-token');
    });

    it('should use correct keys for user', () => {
      setStoredUser({ id: '123' });
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify({ id: '123' }));
    });
  });
});
