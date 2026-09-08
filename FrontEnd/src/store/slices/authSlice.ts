import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';
import {
  getToken,
  getRefreshToken,
  setToken as saveAccessToken,
  setRefreshToken as saveRefreshToken,
  clearAuthStorage,
} from '@/utils/storage';
import type { RootState } from '../index';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

// Initialize tokens from localStorage
const initialState: AuthState = {
  user: null,
  accessToken: getToken(),
  refreshToken: getRefreshToken(),
  isLoading: true,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
      state.isInitialized = true;
      saveAccessToken(action.payload.accessToken);
      saveRefreshToken(action.payload.refreshToken);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isInitialized = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      saveAccessToken(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      if (action.payload) {
        state.isLoading = false;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.isInitialized = true;
      clearAuthStorage();
    },
  },
});

export const {
  setCredentials,
  setUser,
  setAccessToken,
  setLoading,
  setInitialized,
  logout,
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectToken = (state: RootState) => state.auth.accessToken; // Legacy alias
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized;

export default authSlice.reducer;
