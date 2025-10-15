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
  baseURL:
    import.meta.env.VITE_KEYCLOAK_BASE_URL ??
    'https://mobile-test.fkb.kg/keycloak/realms/admin-panel/protocol/openid-connect',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 10000,
});

const DEFAULT_GRANT_TYPE = 'password';
const DEFAULT_CLIENT_ID = 'admin-panel';
const DEFAULT_CLIENT_SECRET = 'sxVn0eDGjSPDsuS1LGWm06QcHtwJX14w';
const DEFAULT_SCOPE = 'openid';

export async function sendLoginRequest({
  username,
  password,
}: LoginRequestPayload): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.set('grant_type', import.meta.env.VITE_KEYCLOAK_GRANT_TYPE ?? DEFAULT_GRANT_TYPE);
  params.set('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? DEFAULT_CLIENT_ID);
  params.set('client_secret', import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET ?? DEFAULT_CLIENT_SECRET);
  params.set('scope', import.meta.env.VITE_KEYCLOAK_SCOPE ?? DEFAULT_SCOPE);
  params.set('username', username);
  params.set('password', password);

  const { data } = await loginClient.post<LoginResponse>('/token', params);
  return data;
}
