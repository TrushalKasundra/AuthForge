import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth } from '@/hooks/useAuth';
import { authSlice } from '@/store/slices/authSlice';
import { uiSlice } from '@/store/slices/uiSlice';
import { authApi } from '@/store/api/authApi';
import type { ReactNode } from 'react';

// Create a test store factory
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      ui: uiSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
    preloadedState,
  });

describe('useAuth', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const createWrapper = (store: ReturnType<typeof createTestStore>) => {
    return ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  it('should return initial state when no user is logged in', async () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);
    
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should return user data when user is logged in', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    };

    const store = createTestStore({
      auth: {
        user: mockUser,
        token: 'test-token',
        isLoading: false,
        isInitialized: true,
      },
    });
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should throw error when used outside Provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('could not find react-redux context value');

    consoleSpy.mockRestore();
  });

  it('should provide login function', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.login).toBe('function');
  });

  it('should provide register function', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.register).toBe('function');
  });

  it('should provide logout function', () => {
    const store = createTestStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.logout).toBe('function');
  });

  it('should clear user on logout', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2024-01-01',
    };

    const store = createTestStore({
      auth: {
        user: mockUser,
        token: 'test-token',
        isLoading: false,
        isInitialized: true,
      },
    });
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Verify initial logged in state
    expect(result.current.isAuthenticated).toBe(true);

    // Call logout
    await result.current.logout();

    // Verify logged out state
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
