import axios, { AxiosHeaders } from 'axios';

import { getAuthorizationHeaderOrRedirect } from 'Common/auth/tokenStorage.ts';

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

const DEFAULT_CUSTOMER_API_BASE_URL = 'https://mobile-test.fkb.kg/admin-panel/api/v1';

const customerClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_CUSTOMER_API_BASE_URL,
  timeout: 10000,
});

customerClient.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeaderOrRedirect();

  if (!authorizationHeader) {
    return Promise.reject(new axios.CanceledError('Missing auth token. Redirecting to login.'));
  }

  const headers = config.headers ? AxiosHeaders.from(config.headers) : new AxiosHeaders();

  headers.set('Authorization', authorizationHeader);
  config.headers = headers;

  return config;
});

export async function fetchCustomerById(id: string): Promise<CustomerResponse> {
  const { data } = await customerClient.get<CustomerResponse>(`/customer/${id}`, {
    headers: {
      accept: '*/*',
    },
  });

  return data;
}
