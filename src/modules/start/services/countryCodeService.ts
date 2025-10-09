import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { type DirectoryItem, fetchCountryCodes } from 'Modules/start/api/directoryApi.ts';

export const DEFAULT_PHONE_DIGITS_LENGTH = 12;

export interface CountryCode {
  id: string;
  isoCode: string;
  country: string;
  code: string;
  digitsCount: number;
  phoneMask?: string;
  flagPath?: string;
}

export class CountryCodeService {
  @observable.shallow countryCodes: CountryCode[] = [];
  @observable awaiting = false;
  @observable errorMessage: string | undefined = undefined;
  @observable isFetched = false;

  constructor(private readonly countryCodesFetcher: typeof fetchCountryCodes = fetchCountryCodes) {
    makeObservable(this);
  }

  @action
  setErrorMessage(message: string | undefined) {
    this.errorMessage = message;
  }

  @action
  reset() {
    this.countryCodes = [];
    this.awaiting = false;
    this.isFetched = false;
    this.errorMessage = undefined;
  }

  @action
  async fetchCountryCodes(forceReload = false) {
    if (this.awaiting) {
      return;
    }

    if (this.isFetched && !forceReload) {
      return;
    }

    this.awaiting = true;
    this.errorMessage = undefined;

    try {
      const directory = await this.countryCodesFetcher();
      const items: DirectoryItem[] = Array.isArray(directory.directoryItemList)
        ? directory.directoryItemList
        : [];

      const mappedCountryCodes = items
        .filter((item) => item.active)
        .sort((a, b) => a.position - b.position)
        .map((item) => this.mapToCountryCode(item));

      runInAction(() => {
        this.countryCodes = mappedCountryCodes;
        this.isFetched = true;
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить справочник телефонных кодов.';

      runInAction(() => {
        this.countryCodes = [];
        this.isFetched = false;
        this.errorMessage = message;
      });
    } finally {
      runInAction(() => {
        this.awaiting = false;
      });
    }
  }

  @computed
  get isLoading() {
    return this.awaiting;
  }

  @computed
  get hasError() {
    return Boolean(this.errorMessage);
  }

  @computed
  get isLoaded() {
    return this.isFetched;
  }

  @computed
  get error() {
    return this.errorMessage ?? null;
  }

  private mapToCountryCode(item: DirectoryItem): CountryCode {
    const isoCode = item.paramList?.code ?? item.itemCode;
    const phoneCode = item.paramList?.phone_code ?? '';
    const mask = item.paramList?.phone_mask;
    const digitsCount = mask ? mask.replace(/[^X]/g, '').length : 0;
    const flagPath = '/src/assets/icons/countries/' + item.itemCode + '.png';

    return {
      id: item.itemCode,
      isoCode,
      country: item.localizedName ?? item.name,
      code: phoneCode ? `+${phoneCode}` : '',
      phoneMask: mask,
      digitsCount: digitsCount > 0 ? digitsCount : DEFAULT_PHONE_DIGITS_LENGTH,
      flagPath,
    };
  }
}
