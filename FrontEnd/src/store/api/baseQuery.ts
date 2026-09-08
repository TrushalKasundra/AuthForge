import { API_BASE_URL } from '@/constants';
import type { RootState } from '@/store';
import { logout, setAccessToken } from '@/store/slices/authSlice';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Simple lock to prevent multiple refresh requests
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Base query configuration with authentication headers
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/**
 * Base query with automatic token refresh on 401 errors
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url = typeof args === 'string' ? args : args.url;
    const isAuthEndpoint = ['/login', '/register', '/refresh-token'].includes(url);

    if (!isAuthEndpoint) {
      // If already refreshing, wait for it
      if (isRefreshing && refreshPromise) {
        const success = await refreshPromise;
        if (success) {
          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        }
        return result;
      }

      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      if (refreshToken) {
        isRefreshing = true;

        refreshPromise = (async () => {
          try {
            const refreshResult = await baseQuery(
              {
                url: '/refresh-token',
                method: 'POST',
                body: { refreshToken },
              },
              api,
              extraOptions
            );

            if (refreshResult.data) {
              const data = refreshResult.data as { success: boolean; accessToken?: string };

              if (data.success && data.accessToken) {
                api.dispatch(setAccessToken(data.accessToken));
                return true;
              }
            }

            api.dispatch(logout());
            return false;
          } catch {
            api.dispatch(logout());
            return false;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();

        const success = await refreshPromise;
        if (success) {
          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};
