import axios from 'axios';

export interface PhoneAuthRequestPayload {
  scope: string | null;
  state: string | null;
  phone: string;
  client_id: string | null;
  redirect_uri: string | null;
  original_url: string | null;
  response_type: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
}

export interface PhoneAuthResponse {
  id: string;
  redirect_url?: string | null;
  status: string;
  expires_in: string;
}

const phoneAuthClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    'https://preprodib.mbank.kg/svc-biz-ib-cbk-mbank-id-auth/v1/api',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export async function sendPhoneAuthRequest(
  payload: PhoneAuthRequestPayload,
): Promise<PhoneAuthResponse> {
  const { data } = await phoneAuthClient.post<PhoneAuthResponse>('/oauth/web/push', payload);
  return data;
}
