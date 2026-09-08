// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'authforge_access_token',
  REFRESH_TOKEN: 'authforge_refresh_token',
  TOKEN: 'authforge_access_token', // Legacy alias
  USER: 'authforge_user',
} as const;

// App Configuration
export const APP_NAME = 'AuthForge';
