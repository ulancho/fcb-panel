import { toJS } from 'mobx';
import { createContext, useContext, type ReactNode } from 'react';

import { CountryCodeService } from 'Modules/start/services/countryCodeService.ts';
import { PhoneAuthService } from 'Modules/start/services/phoneAuthService.ts';
import { QrInfoService } from 'Modules/start/services/qrInfoService.ts';
import { QrStatusService } from 'Modules/start/services/qrStatusService.ts';
import { StartInfoService } from 'Modules/start/services/startInfoService.ts';
import { StartQueryParamsService } from 'Modules/start/services/startQueryParamsService.ts';

class RootStore {
  readonly countryCodesStore = new CountryCodeService();
  readonly startQueryParamsStore = new StartQueryParamsService();
  readonly startStore = new StartInfoService(this.startQueryParamsStore);
  readonly qrStore = new QrInfoService(this.startQueryParamsStore);
  readonly qrStatusStore = new QrStatusService(
    this.startStore,
    this.startQueryParamsStore,
    this.qrStore,
  );
  readonly phoneAuthStore = new PhoneAuthService(this.startQueryParamsStore);
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

export function useCountryCodesStore() {
  return useRootStore().countryCodesStore;
}

export function useStartStore() {
  return useRootStore().startStore;
}

export function useQrStore() {
  return useRootStore().qrStore;
}

export function useQrStatusStore() {
  return useRootStore().qrStatusStore;
}

export function useStartQueryParamsStore() {
  return useRootStore().startQueryParamsStore;
}

export function usePhoneAuthStore() {
  return useRootStore().phoneAuthStore;
}