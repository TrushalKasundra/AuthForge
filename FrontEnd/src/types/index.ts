// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Register payload
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Refresh token payload
export interface RefreshTokenPayload {
  refreshToken: string;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
