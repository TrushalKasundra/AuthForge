import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectUser,
  selectAccessToken,
  selectRefreshToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialized,
  setCredentials,
  setUser,
  logout as logoutAction,
  setInitialized,
} from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLazyGetProfileQuery,
} from '@/store/api/authApi';
import type { LoginPayload, RegisterPayload } from '@/types';

export interface UseAuthReturn {
  user: ReturnType<typeof selectUser>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector(selectRefreshToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isInitialized = useAppSelector(selectIsInitialized);

  // RTK Query mutations
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [getProfile] = useLazyGetProfileQuery();

  // Initialize auth state on mount - fetch profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken && !isInitialized) {
        try {
          const result = await getProfile().unwrap();
          if (result.success && result.user) {
            dispatch(setUser(result.user));
          } else {
            dispatch(logoutAction());
          }
        } catch {
          dispatch(logoutAction());
        }
      } else if (!accessToken) {
        dispatch(setInitialized(true));
      }
    };

    initAuth();
  }, [accessToken, isInitialized, getProfile, dispatch]);

  // Login
  const login = useCallback(
    async (data: LoginPayload) => {
      const response = await loginMutation(data).unwrap();
      if (response.success && response.accessToken && response.refreshToken && response.user) {
        dispatch(setCredentials({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    },
    [loginMutation, dispatch]
  );

  // Register
  const register = useCallback(
    async (data: RegisterPayload) => {
      const response = await registerMutation(data).unwrap();
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
    },
    [registerMutation]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutMutation({ refreshToken: refreshToken || undefined }).unwrap();
    } catch {
      // Continue with logout even if API fails
    }
    dispatch(logoutAction());
  }, [logoutMutation, refreshToken, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
