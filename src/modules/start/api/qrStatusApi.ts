import axios from 'axios';

export interface QrStatusRequestPayload {
  id: string;
  state: string | null;
  redirect_uri: string | null;
  original_url?: string | null;
}

export interface QrStatusResponse {
  id: string;
  deeplink_url: string;
  redirect_url: string;
  status: string;
  expires_in: string;
}

const qrStatusClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    'https://preprodib.mbank.kg/svc-biz-ib-cbk-mbank-id-auth/v1/api',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export async function fetchQrStatus(payload: QrStatusRequestPayload) {
  const { data } = await qrStatusClient.post<QrStatusResponse>('/oauth/web/qr/status', payload);

  return data;
}
