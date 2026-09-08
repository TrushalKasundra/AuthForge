import { STORAGE_KEYS } from '@/constants';

// Access Token storage
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Refresh Token storage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// User storage
export const getStoredUser = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER);
};

export const setStoredUser = (user: object): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Clear all auth data
export const clearAuthStorage = (): void => {
  removeToken();
  removeRefreshToken();
  removeStoredUser();
};
