import { httpClient } from 'Common/api/httpClient.ts';

export interface TransactionItem {
  id: number;
  externalID: string;
  absID: string | null;
  transactionDate: string;
  status: string;
  transactionType: string | null;
  sumN: number | null;
  sumV: number | null;
  fee: number | null;
  debitAccount: string | null;
  creditAccount: string | null;
  customerID: number | null;
  serviceName: string | null;
  comment: string | null;
  deviceID: string | null;
  debitAccountCurrency: number | null;
  creditAccountCurrency: number | null;
  receiverCustomerID: number | null;
  receiverCustomerName: string | null;
  receiverCustomerDetail: string | null;
  transactionID: number;
}

export interface TransactionsResponse {
  content: TransactionItem[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface FetchTransactionsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: SortDirection;
  status?: string | null;
  serviceName?: string | null;
  creditAccount?: string | null;
  debitAccount?: string | null;
  transactionType?: string | null;
  customerId?: string | null;
  deviceId?: string | null;
  absId?: string | null;
  signal?: AbortSignal;
}

const DEFAULT_TRANSACTIONS_API_BASE_URL = 'https://mobile-test.fkb.kg/admin-panel/api/v1';
const TRANSACTIONS_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_TRANSACTIONS_API_BASE_URL;

export async function fetchTransactions({
  page = 0,
  size = 10,
  sortBy = 'id',
  direction = 'desc',
  status,
  serviceName,
  creditAccount,
  debitAccount,
  transactionType,
  customerId,
  absId,
  signal,
}: FetchTransactionsParams = {}): Promise<TransactionsResponse> {
  const { data } = await httpClient.get<TransactionsResponse>('/service/transactions', {
    baseURL: TRANSACTIONS_API_BASE_URL,
    params: {
      page,
      size,
      sortBy,
      direction,
      status: status ?? undefined,
      statusName: serviceName ?? undefined,
      creditAccount: creditAccount ?? undefined,
      debitAccount: debitAccount ?? undefined,
      transactionType: transactionType ?? undefined,
      customerId: customerId ?? undefined,
      absId: absId ?? undefined,
    },
    headers: {
      accept: '*/*',
    },
    signal,
  });

  return data;
}
