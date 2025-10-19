import axios from 'axios';

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

const DEFAULT_AUTHORIZATION_TOKEN =
  'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRR3NjY24yUHF1c0dWcnJMaE5XMkVKWkNfNHplemNHY1FyVlR1TjlmMHd3In0.eyJleHAiOjE3NjA4OTQ1OTgsImlhdCI6MTc2MDg5NDI5OCwianRpIjoib25ydHJvOjMxZTliMDYxLTM1NTgtYzgzOS03ZmUwLWM5MWIyMzM4ZTdlMCIsImlzcyI6Imh0dHBzOi8vbW9iaWxlLXRlc3QuZmtiLmtnL2tleWNsb2FrL3JlYWxtcy9hZG1pbi1wYW5lbCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkNTMzMTg2Ny0zNTcwLTQ3NjAtOTk2Ni04YmY2ZjgwMTE5ZGQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1wYW5lbCIsInNpZCI6Ijc5OTcyNDY5LWY4MzQtNTY0Ni01YTlkLTMxNTNjNTY2Yjc4MiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsic3VwZXJfYWRtaW4iLCJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWRtaW4tcGFuZWwiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFkbWluLXBhbmVsIjp7InJvbGVzIjpbInRyYW5zYWN0aW9uczpyIiwic3RvcmllczpyIiwiY3VzdG9tZXI6ciIsInN0b3JpZXM6dyIsImN1c3RvbWVyOnciXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFkbWluIFRlc3QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbl90ZXN0IiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUZXN0IiwiZW1haWwiOiJhZG1pbl90ZXN0QGdtYWlsLmNvbSJ9.P82eTYG6KWvLpCye5VBlCNz-TsfSGPPwW5qiKCDi_xhaTfqdWVgo_VK-Ihf6fdUjXHbk1OVLvVZ2xTdqbGgnnQ5E-fhhNTJ9GNQr-2L8jttfRhLeeac8yZNheCm1m17tw5i7mWkLIciOw7w74RdBPLGc0WcLR9U3ENZcFxmLfPK2Bglxdo4ry_h2Lahz1TF8g4qMRhEVRw7PN2q6AK28bJo7MNwafsL2D9vL02CL6spE0hUr0FDm01Jg7aJ3DVSx5VmDwN-orfulSKTPxVLIQWd1vzQ1lSp12f53jhI-tZvi5VWOBKaXc1OGUH8UDgnh63vKxHeR3nyAwuZ2spwrnw';
const customerClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_CUSTOMER_API_BASE_URL,
  timeout: 10000,
});

export async function fetchCustomerById(id: string): Promise<CustomerResponse> {
  const { data } = await customerClient.get<CustomerResponse>(`/customer/${id}`, {
    headers: {
      accept: '*/*',
      Authorization: import.meta.env.VITE_CUSTOMER_API_TOKEN ?? DEFAULT_AUTHORIZATION_TOKEN,
    },
  });

  return data;
}
