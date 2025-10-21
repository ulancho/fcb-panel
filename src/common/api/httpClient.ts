import axios, { AxiosHeaders } from 'axios';

import { getAuthorizationHeaderOrRedirect } from 'Common/auth/tokenStorage.ts';

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
