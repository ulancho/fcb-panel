import { httpClient } from 'Common/api/httpClient.ts';

export interface CustomerResponse {
  customerId: number;
  email: string;
  phoneNumber: string;
  inn: string;
  surname: string;
  name: string;
  patronymic: string;
  documentType: number;
  documentSeries: string;
  documentNo: string;
}

export interface RegisterCustomerPayload {
  customerId: string;
  email: string;
  phoneNumber: string;
}

const DEFAULT_CUSTOMER_API_BASE_URL = 'https://mobile-test.fkb.kg/admin-panel/api/v1';

const CUSTOMER_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_CUSTOMER_API_BASE_URL;

export async function fetchCustomerById(id: string): Promise<CustomerResponse> {
  const { data } = await httpClient.get<CustomerResponse>(`/customer/${id}`, {
    baseURL: CUSTOMER_API_BASE_URL,
    headers: {
      accept: '*/*',
    },
  });

  return data;
}

export async function registerCustomer(payload: RegisterCustomerPayload): Promise<void> {
  await httpClient.post('/customer/register', payload, {
    baseURL: CUSTOMER_API_BASE_URL,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
}
