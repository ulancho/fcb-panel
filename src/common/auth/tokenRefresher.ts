import axios from 'axios';

import { getRefreshToken, saveLoginResponseTokens } from './tokenStorage.ts';

import type { LoginResponse } from 'Modules/login/api/loginApi.ts';

const refreshClient = axios.create({
  baseURL: 'https://mobile-test.fkb.kg/keycloak/realms/admin-panel/protocol/openid-connect',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 10000,
});

const DEFAULT_GRANT_TYPE = 'refresh_token';
const DEFAULT_CLIENT_ID = 'web';
const DEFAULT_CLIENT_SECRET = 'Vv7vMeDVQKwD3xTuPLjH9dabKfbEXrfN';

function resolveClientId(): string {
  return (
    import.meta.env.VITE_KEYCLOAK_REFRESH_CLIENT_ID ??
    import.meta.env.VITE_KEYCLOAK_CLIENT_ID ??
    DEFAULT_CLIENT_ID
  );
}

function resolveClientSecret(): string {
  return (
    import.meta.env.VITE_KEYCLOAK_REFRESH_CLIENT_SECRET ??
    import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET ??
    DEFAULT_CLIENT_SECRET
  );
}

async function sendRefreshTokenRequest(refreshToken: string): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.set('grant_type', import.meta.env.VITE_KEYCLOAK_REFRESH_GRANT_TYPE ?? DEFAULT_GRANT_TYPE);
  params.set('client_id', resolveClientId());
  params.set('client_secret', resolveClientSecret());
  params.set('refresh_token', refreshToken);

  const { data } = await refreshClient.post<LoginResponse>('/token', params);
  return data;
}

let refreshPromise: Promise<LoginResponse> | null = null;

export async function refreshAuthTokens(): Promise<LoginResponse> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error('Missing refresh token.');
      }

      const response = await sendRefreshTokenRequest(refreshToken);
      saveLoginResponseTokens(response);

      return response;
    })();
  }

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
