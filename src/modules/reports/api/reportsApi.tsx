import { httpClient } from 'Common/api/httpClient.ts';

export interface FilterParams {
  status?: string;
  serviceName?: string;
  creditAccount?: string;
  debitAccount?: string;
  transactionType?: number;
  customerId?: number;
  deviceId?: number;
  absId?: number;
  startDate?: string;
  endDate?: string;
}

type FileType = 'excel' | 'pdf';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://mobile-test.fkb.kg/admin-panel/api/v1';

export async function downloadFile(type: FileType, params: FilterParams = {}): Promise<Blob> {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value != null && value !== ''),
  );

  const { data } = await httpClient.get<Blob>(`/service/transactions/${type}`, {
    baseURL: API_BASE_URL,
    params: cleanedParams,
    responseType: 'blob',
    headers: {
      accept: '*/*',
    },
  });

  return data;
}
