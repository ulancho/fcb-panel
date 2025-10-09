import { isAxiosError } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  sendPhoneAuthRequest,
  type PhoneAuthRequestPayload,
  type PhoneAuthResponse,
} from '../api/phoneAuthApi.ts';

import type { StartQueryParamsService } from './startQueryParamsService.ts';

export class PhoneAuthService {
  @observable private isSendingPhoneAuth = false;
  @observable private phoneAuthErrorMessage: string | null = null;
  @observable private isPhoneAuthSent = false;
  @observable private phoneAuthResponse: PhoneAuthResponse | null = null;

  constructor(
    private readonly queryParamsService: StartQueryParamsService,
    private readonly phoneAuthRequester: typeof sendPhoneAuthRequest = sendPhoneAuthRequest,
  ) {
    makeObservable(this);
  }

  @action
  resetStatus() {
    this.isPhoneAuthSent = false;
    this.phoneAuthErrorMessage = null;
    this.phoneAuthResponse = null;
  }

  @action
  async sendPhoneAuth(phone: string) {
    if (!phone.trim()) {
      return;
    }

    this.isSendingPhoneAuth = true;
    this.phoneAuthErrorMessage = null;
    this.isPhoneAuthSent = false;
    this.phoneAuthResponse = null;

    const payload = this.buildPhoneAuthPayload(phone.trim());

    try {
      const response = await this.phoneAuthRequester(payload);

      runInAction(() => {
        this.phoneAuthResponse = response;
        this.isPhoneAuthSent = true;
      });
    } catch (error) {
      let message = 'Не удалось отправить запрос на вход.';

      if (isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData.code === 'unified.svc.biz.ib.cbk.mbank-id.error.private-user-not-found') {
          message = 'Такой номер не найден, проверьте номер';
        } else if (typeof error.message === 'string' && error.message.trim()) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      runInAction(() => {
        this.phoneAuthErrorMessage = message;
        this.isPhoneAuthSent = false;
        this.phoneAuthResponse = null;
      });
    } finally {
      runInAction(() => {
        this.isSendingPhoneAuth = false;
      });
    }
  }

  @computed
  get isLoading() {
    return this.isSendingPhoneAuth;
  }

  @computed
  get error(): string | null {
    return this.phoneAuthErrorMessage;
  }

  @computed
  get isSuccess() {
    return this.isPhoneAuthSent;
  }

  @computed
  get response(): PhoneAuthResponse | null {
    return this.phoneAuthResponse;
  }

  @computed
  get redirectUrl(): string | null {
    return this.phoneAuthResponse?.redirect_url ?? null;
  }

  private buildPhoneAuthPayload(phone: string): PhoneAuthRequestPayload {
    const queryParams = this.queryParamsService.queryParams;
    const sanitizedPhone = phone.replace(/\+/g, '');

    return {
      phone: sanitizedPhone,
      scope: queryParams.scope,
      state: queryParams.state,
      client_id: queryParams.clientId,
      redirect_uri: queryParams.redirectUri,
      response_type: queryParams.responseType,
      code_challenge: queryParams.codeChallenge,
      code_challenge_method: queryParams.codeChallengeMethod,
      original_url: queryParams.originalUrl || null,
    };
  }
}
