import type { LoginResponse } from 'Modules/login/api/loginApi.ts';

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
}

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const TOKEN_TYPE_KEY = 'auth.tokenType';
const DEFAULT_TOKEN_TYPE = 'Bearer';

let cachedTokens: AuthTokens | null | undefined;

function logWarning(message: string, error: unknown) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- Helpful for diagnosing storage issues during development.
    console.warn(message, error);
  }
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    logWarning('Access to localStorage is not available.', error);
    return null;
  }
}

function readTokensFromStorage(): AuthTokens | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const accessToken = storage.getItem(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      return null;
    }

    const refreshToken = storage.getItem(REFRESH_TOKEN_KEY) ?? undefined;
    const tokenType = storage.getItem(TOKEN_TYPE_KEY) ?? undefined;

    return {
      accessToken,
      refreshToken,
      tokenType,
    } satisfies AuthTokens;
  } catch (error) {
    logWarning('Failed to read auth tokens from storage.', error);
    return null;
  }
}

function persistTokens(tokens: AuthTokens | null) {
  cachedTokens = tokens ?? null;

  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    if (!tokens) {
      storage.removeItem(ACCESS_TOKEN_KEY);
      storage.removeItem(REFRESH_TOKEN_KEY);
      storage.removeItem(TOKEN_TYPE_KEY);
      return;
    }

    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

    if (tokens.refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      storage.removeItem(REFRESH_TOKEN_KEY);
    }

    if (tokens.tokenType) {
      storage.setItem(TOKEN_TYPE_KEY, tokens.tokenType);
    } else {
      storage.removeItem(TOKEN_TYPE_KEY);
    }
  } catch (error) {
    logWarning('Failed to persist auth tokens in storage.', error);
  }
}

function ensureTokens(): AuthTokens | null {
  if (cachedTokens !== undefined) {
    return cachedTokens;
  }

  cachedTokens = readTokensFromStorage();
  return cachedTokens ?? null;
}

export function saveAuthTokens(tokens: AuthTokens) {
  persistTokens(tokens);
}

export function saveLoginResponseTokens(response: LoginResponse) {
  const tokens: AuthTokens = {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    tokenType: response.token_type,
  };

  persistTokens(tokens);
}

export function clearAuthTokens() {
  persistTokens(null);
}

export function getAccessToken(): string | null {
  return ensureTokens()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return ensureTokens()?.refreshToken ?? null;
}

export function getTokenType(): string {
  return ensureTokens()?.tokenType ?? DEFAULT_TOKEN_TYPE;
}

export function getAuthorizationHeaderValue(): string | null {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  const tokenType = getTokenType();
  return `${tokenType} ${accessToken}`;
}

function resolveLoginRoute(): string {
  return '/login';
}

export function redirectToLogin() {
  if (typeof window === 'undefined') {
    return;
  }

  const loginRoute = resolveLoginRoute();

  if (window.location.pathname === loginRoute) {
    return;
  }

  window.location.replace(loginRoute);
}

export function getAuthorizationHeaderOrRedirect(): string | null {
  const authorizationHeader = getAuthorizationHeaderValue();

  if (!authorizationHeader) {
    redirectToLogin();
    return null;
  }

  return authorizationHeader;
}
