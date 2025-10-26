import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { refreshAuthTokens } from 'Common/auth/tokenRefresher.ts';
import {
  clearAuthTokens,
  getAuthorizationHeaderOrRedirect,
  redirectToLogin,
} from 'Common/auth/tokenStorage.ts';

interface RetryableAxiosRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D> {
  _retry?: boolean;
}

export const httpClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeaderOrRedirect();

  if (!authorizationHeader) {
    return Promise.reject(new axios.CanceledError('Missing auth token. Redirecting to login.'));
  }

  const headers = config.headers ? AxiosHeaders.from(config.headers) : new AxiosHeaders();

  headers.set('Authorization', authorizationHeader);
  config.headers = headers;

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAuthTokens();
      } catch (refreshError) {
        clearAuthTokens();
        redirectToLogin();

        return Promise.reject(refreshError);
      }

      const authorizationHeader = getAuthorizationHeaderOrRedirect();

      if (!authorizationHeader) {
        return Promise.reject(
          new axios.CanceledError('Missing auth token after refresh. Redirecting to login.'),
        );
      }

      const headers = originalRequest.headers
        ? AxiosHeaders.from(originalRequest.headers)
        : new AxiosHeaders();

      headers.set('Authorization', authorizationHeader);
      originalRequest.headers = headers;

      return httpClient.request(originalRequest);
    }

    if (status === 401) {
      clearAuthTokens();
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
