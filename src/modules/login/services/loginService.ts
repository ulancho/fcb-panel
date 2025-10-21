import { isAxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { saveLoginResponseTokens } from 'Common/auth/tokenStorage.ts';

import { sendLoginRequest, type LoginRequestPayload, type LoginResponse } from '../api/loginApi.ts';

export class LoginService {
  @observable private isSubmitting = false;
  @observable private submitError: string | null = null;
  @observable private loginResponse: LoginResponse | null = null;

  constructor(private readonly loginRequester: typeof sendLoginRequest = sendLoginRequest) {
    makeObservable(this);
  }

  @action
  clearError() {
    this.submitError = null;
  }

  @action
  async login(username: string, password: string) {
    const payload: LoginRequestPayload = {
      username: username.trim(),
      password: password.trim(),
    };

    if (!payload.username || !payload.password) {
      this.submitError = 'Введите логин и пароль';
      this.loginResponse = null;
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.loginResponse = null;

    try {
      const response = await this.loginRequester(payload);

      saveLoginResponseTokens(response);

      runInAction(() => {
        this.loginResponse = response;
      });
    } catch (error) {
      let message = 'Не удалось выполнить вход.';

      if (isAxiosError(error)) {
        const responseData = error.response?.data as
          | { error_description?: string; error?: string }
          | undefined;

        if (responseData?.error_description) {
          message = responseData.error_description;
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message;
        }
      } else if (error instanceof Error && error.message.trim()) {
        message = error.message;
      }

      runInAction(() => {
        this.submitError = message;
      });
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }

  @computed
  get isLoading() {
    return this.isSubmitting;
  }

  @computed
  get error(): string | null {
    return this.submitError;
  }

  @computed
  get response(): LoginResponse | null {
    return this.loginResponse;
  }
}
