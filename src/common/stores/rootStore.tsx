import { toJS } from 'mobx';
import { createContext, type ReactNode, useContext } from 'react';

import { CustomerService } from 'Modules/clients/registration/services/customerService.ts';
import { LoginService } from 'Modules/login/services/loginService.ts';

class RootStore {
  readonly loginStore = new LoginService();
  readonly customerStore = new CustomerService();
}

const rootStore = new RootStore();
const RootStoreContext = createContext(rootStore);

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // @ts-expect-error: dev helper
  window.rootStore = rootStore;
  // @ts-expect-error: dev helper
  window.toJS = toJS;
}

export function RootStoreProvider({ children }: { children: ReactNode }) {
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export function useRootStore() {
  return useContext(RootStoreContext);
}

export function useLoginStore() {
  return useRootStore().loginStore;
}

export function useCustomerStore() {
  return useRootStore().customerStore;
}
