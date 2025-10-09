import axios from 'axios';

export interface QrInfoRequestPayload {
  scope: string | null;
  state: string | null;
  client_id: string | null;
  redirect_uri: string | null;
  original_url?: string | null;
  response_type: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
}

export interface QrInfoResponse {
  id: string;
  deeplink_url: string;
  redirect_url: string;
  status: string;
  expires_in: string;
}

const qrInfoClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    'https://preprodib.mbank.kg/svc-biz-ib-cbk-mbank-id-auth/v1/api',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export async function fetchQrInfo(payload: QrInfoRequestPayload) {
  const { data } = await qrInfoClient.post<QrInfoResponse>('/oauth/web/qr', payload);

  return data;
}
