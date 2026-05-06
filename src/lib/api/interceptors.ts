import { AxiosError, AxiosInstance } from 'axios';

export function setupInterceptors(client: AxiosInstance): void {
  // Request — attach auth token when available
  client.interceptors.request.use(
    (config) => {
      // TODO (auth phase): read JWT from cookie or secure storage and attach here
      // const token = getStoredAccessToken();
      // if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response — normalize errors and handle 401
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; statusCode?: number }>) => {
      if (error.response?.status === 401) {
        // TODO (auth phase): clear stored tokens and redirect to /login
        // clearStoredTokens();
        // if (typeof window !== 'undefined') window.location.href = '/login';
      }

      // Normalize error message so callers get a consistent string
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred';

      return Promise.reject(new Error(message));
    },
  );
}
