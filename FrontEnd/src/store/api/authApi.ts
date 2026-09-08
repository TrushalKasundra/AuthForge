import type {
  AuthResponse,
  LoginPayload,
  MessageResponse,
  ProfileResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload
} from '@/types';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Register mutation
    register: builder.mutation<MessageResponse, RegisterPayload>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data,
      }),
    }),

    // Refresh token mutation
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenPayload>({
      query: (data) => ({
        url: '/refresh-token',
        method: 'POST',
        body: data,
      }),
    }),

    // Get profile query
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/profile',
      providesTags: ['User'],
    }),

    // Logout mutation
    logout: builder.mutation<MessageResponse, { refreshToken?: string } | void>({
      query: (data) => ({
        url: '/logout',
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export auto-generated hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLogoutMutation,
} = authApi;
