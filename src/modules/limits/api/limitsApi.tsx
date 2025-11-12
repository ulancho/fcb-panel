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

export interface TransactionType {
  id: number;
  name: string;
  limit: object | null;
}

export type LimitIdentificationType = 'FULL_IDENTIFICATION' | 'ONLINE_IDENTIFICATION';

export interface CreateLimitPayload {
  transactionTypeId: number;
  name: string;
  amountPerDay: number;
  amountPerMonth: number;
  type: LimitIdentificationType;
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

export async function fetchTransactionTypes(): Promise<TransactionType[]> {
  const { data } = await httpClient.get<TransactionType[]>('/service/transactions/types', {
    baseURL: API_BASE_URL,
    headers: {
      accept: '*/*',
    },
  });

  return data;
}

export async function fetchLimit(limitId: number): Promise<TransactionLimit> {
  const { data } = await httpClient.get<TransactionLimit>(
    `/service/transactions/limits/${limitId}`,
    {
      baseURL: API_BASE_URL,
      headers: {
        accept: '*/*',
      },
    },
  );

  return data;
}

export async function createTransactionLimit(payload: CreateLimitPayload): Promise<void> {
  await httpClient.post('/service/transactions/limits', payload, {
    baseURL: API_BASE_URL,
    headers: {
      accept: '*/*',
    },
  });
}
