import axios from 'axios';

export interface LoginRequestPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

const loginClient = axios.create({
  baseURL: 'https://mobile-test.fkb.kg/keycloak/realms/admin-panel/protocol/openid-connect',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 10000,
});

const DEFAULT_GRANT_TYPE = 'password';
const DEFAULT_CLIENT_ID = 'web';
const DEFAULT_CLIENT_SECRET = 'Vv7vMeDVQKwD3xTuPLjH9dabKfbEXrfN';
const DEFAULT_SCOPE = 'openid';
const DEFAULT_LOGOUT_PATH = '/logout';

export async function sendLoginRequest({
  username,
  password,
}: LoginRequestPayload): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.set('grant_type', DEFAULT_GRANT_TYPE);
  params.set('client_id', DEFAULT_CLIENT_ID);
  params.set('client_secret', DEFAULT_CLIENT_SECRET);
  params.set('scope', DEFAULT_SCOPE);
  params.set('username', username);
  params.set('password', password);

  const { data } = await loginClient.post<LoginResponse>('/token', params);
  return data;
}

export async function sendLogoutRequest(refreshToken: string): Promise<void> {
  const params = new URLSearchParams();
  params.set('client_id', DEFAULT_CLIENT_ID);
  params.set('client_secret', DEFAULT_CLIENT_SECRET);
  params.set('refresh_token', refreshToken);

  await loginClient.post(DEFAULT_LOGOUT_PATH, params);
}
