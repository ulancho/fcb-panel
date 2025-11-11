import { httpClient } from 'Common/api/httpClient.ts';

export interface TransactionLimit {
  id: number;
  name: string;
  amountPerDay: number;
  amountPerMonth: number;
  type: string;
  transactionType: {
    id: number;
    name: string;
  };
}

const DEFAULT_API_BASE_URL = 'https://mobile-test.fkb.kg/admin-panel/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export async function fetchLimits(): Promise<TransactionLimit[]> {
  const { data } = await httpClient.get<TransactionLimit[]>('/service/transactions/limits/all', {
    baseURL: API_BASE_URL,
    headers: {
      accept: '*/*',
    },
  });

  return data;
}
