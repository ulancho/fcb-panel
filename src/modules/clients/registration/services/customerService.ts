import { isAxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchCustomerById,
  type CustomerResponse,
  registerCustomer as registerCustomerRequest,
} from '../api/customerApi.ts';

const CUSTOMER_STORAGE_KEY = 'customer-store/customer';
const EMPTY_ID_MESSAGE = 'Введите идентификатор клиента.';
const DEFAULT_ERROR_MESSAGE = 'Не удалось получить данные клиента.';

export class CustomerService {
  @observable private customerData: CustomerResponse | null = null;
  @observable private loading = false;
  @observable private errorMessage: string | null = null;

  constructor(
    private readonly customerFetcher: typeof fetchCustomerById = fetchCustomerById,
    private readonly customerRegistrar: typeof registerCustomerRequest = registerCustomerRequest,
  ) {
    makeObservable(this);
    this.hydrateCustomer();
  }

  @action
  clearError() {
    this.errorMessage = null;
  }

  @action
  clearCustomer() {
    this.customerData = null;
    this.persistCustomer();
  }

  @action
  async loadCustomerById(id: string) {
    const trimmedId = id.trim();

    if (!trimmedId) {
      this.errorMessage = EMPTY_ID_MESSAGE;
      this.customerData = null;
      this.persistCustomer();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.customerData = null;
    this.persistCustomer();

    try {
      const customer = await this.customerFetcher(trimmedId);

      runInAction(() => {
        this.customerData = customer;
        window.location.assign('/client/registration-form');
        this.persistCustomer();
      });
    } catch (error) {
      let message = DEFAULT_ERROR_MESSAGE;

      if (isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData && typeof responseData === 'object') {
          message = (responseData as { message?: string }).message as string;
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message;
        }
      } else if (error instanceof Error && error.message.trim()) {
        message = error.message;
      }

      runInAction(() => {
        this.errorMessage = message;
        this.customerData = null;
        this.persistCustomer();
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  @computed
  get customer(): CustomerResponse | null {
    return this.customerData;
  }

  @computed
  get isLoading(): boolean {
    return this.loading;
  }

  @computed
  get error(): string | null {
    return this.errorMessage;
  }

  @action
  async registerCustomer(email: string, phoneNumber: string) {
    const customerId = this.customerData?.customerId;

    if (customerId == null) {
      throw new Error('Customer ID is not available.');
    }

    await this.customerRegistrar({
      customerId: String(customerId),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
    });
  }

  private hydrateCustomer() {
    if (typeof window === 'undefined') {
      return;
    }

    const rawCustomer = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);

    if (!rawCustomer) {
      return;
    }

    try {
      const storedCustomer = JSON.parse(rawCustomer) as CustomerResponse;

      runInAction(() => {
        this.customerData = storedCustomer;
      });
    } catch (error) {
      window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse stored customer data', error);
      }
    }
  }

  private persistCustomer() {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.customerData) {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(this.customerData));
    } else {
      window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
  }
}
