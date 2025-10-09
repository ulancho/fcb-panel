import axios from 'axios';

export interface DirectoryResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  isNotUseCache: boolean;
  isUnauthorized: boolean;
  type: string;
  namespace: string;
  source: string;
  localizedName?: string;
  localizedDesc?: string;
  directoryItemList: DirectoryItem[];
}

export interface DirectoryItem {
  itemCode: string;
  name: string;
  active: boolean;
  position: number;
  localizedName?: string;
  paramList?: DirectoryItemParams;
}

export type DirectoryItemParams = Record<string, string | undefined> & {
  code?: string;
  phone_mask?: string;
  phone_code?: string;
};

interface DirectoryRequestPayload {
  namespace: string;
  source: string;
  code: string;
  notLocalize: boolean;
  itemFilter: null;
}

const countryCodesClient = axios.create({
  baseURL: 'https://mbank.cbk.kg/svc-common-directory/v2/unauthorized-api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export async function fetchCountryCodes() {
  const payload: DirectoryRequestPayload = {
    namespace: 'cbk',
    source: 'global',
    code: 'country_codes',
    notLocalize: false,
    itemFilter: null,
  };

  const { data } = await countryCodesClient.post<DirectoryResponse>('/directory', payload);

  return data;
}
