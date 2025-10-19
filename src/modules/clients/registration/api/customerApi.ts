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
  'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRR3NjY24yUHF1c0dWcnJMaE5XMkVKWkNfNHplemNHY1FyVlR1TjlmMHd3In0.eyJleHAiOjE3NjA5MDIwMzQsImlhdCI6MTc2MDkwMTczNCwianRpIjoib25ydHJvOjhkYTVkZmU3LWM0OWQtZjdkMi00YTg5LWMxZTNjOGU1ZTdkNSIsImlzcyI6Imh0dHBzOi8vbW9iaWxlLXRlc3QuZmtiLmtnL2tleWNsb2FrL3JlYWxtcy9hZG1pbi1wYW5lbCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJkNTMzMTg2Ny0zNTcwLTQ3NjAtOTk2Ni04YmY2ZjgwMTE5ZGQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1wYW5lbCIsInNpZCI6ImNmM2EwYTJjLTRhNGQtYmUyZS1lNjhlLWZiOWE2ZmZmZDFmNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsic3VwZXJfYWRtaW4iLCJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWRtaW4tcGFuZWwiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFkbWluLXBhbmVsIjp7InJvbGVzIjpbInRyYW5zYWN0aW9uczpyIiwic3RvcmllczpyIiwiY3VzdG9tZXI6ciIsInN0b3JpZXM6dyIsImN1c3RvbWVyOnciXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFkbWluIFRlc3QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbl90ZXN0IiwiZ2l2ZW5fbmFtZSI6IkFkbWluIiwiZmFtaWx5X25hbWUiOiJUZXN0IiwiZW1haWwiOiJhZG1pbl90ZXN0QGdtYWlsLmNvbSJ9.bWZ8kVl2IlL6ti_EYGEEBYomgCVItc_t6JmwS1cbL37aRaxA-_ohs6uLox4npgMBAx6ni_VZarNiLpdRrTzODhZZLMC4Qn6FBrSeRCzIzXhmcZ59iqiXF2_8RRQoHHgrtaqGZk9y45hp59KQQCaX8xD_tHnnZ8OmflQAhdXokjIDElA37C1aUaKlMY-iZP9myEq-KuaedSanE0yQHjiHcC0uxwSe25X5ugivzJCua34RepoKxRPIAz89laBIwOEoO6bb50_9cEJr8OihoehupGLO5aJIJPHsjUWcB5xDxl5ARU6bhZViAl0VKYi_vZRpzhvTxNBysdwppnPTWF1EAw';
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
