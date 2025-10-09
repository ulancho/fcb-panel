import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { fetchQrInfo, type QrInfoRequestPayload, type QrInfoResponse } from '../api/qrInfoApi.ts';

import type { StartQueryParamsService } from 'Modules/start/services/startQueryParamsService.ts';

interface QrInfoData {
  id: string;
  deeplinkUrl: string;
  redirectUrl: string;
  status: string;
  expiresIn: string;
}

function createDefaultQrInfo(): QrInfoData | null {
  return null;
}

export class QrInfoService {
  @observable.ref private qrInfoData: QrInfoData | null = createDefaultQrInfo();
  @observable private isFetchingQrInfo = false;
  @observable private qrInfoErrorMessage: string | null = null;

  constructor(
    private readonly queryParamsService: StartQueryParamsService,
    private readonly qrInfoFetcher: typeof fetchQrInfo = fetchQrInfo,
  ) {
    makeObservable(this);
  }

  @action
  reset() {
    this.qrInfoData = createDefaultQrInfo();
    this.isFetchingQrInfo = false;
    this.qrInfoErrorMessage = null;
  }

  @action
  async fetchQrInfo() {
    this.isFetchingQrInfo = true;
    this.qrInfoErrorMessage = null;

    const payload = this.buildQrInfoPayload();

    try {
      const data = await this.qrInfoFetcher(payload);

      runInAction(() => {
        this.qrInfoData = this.transformQrInfo(data);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось получить данные QR-кода.';

      runInAction(() => {
        this.qrInfoData = null;
        this.qrInfoErrorMessage = message;
      });
    } finally {
      runInAction(() => {
        this.isFetchingQrInfo = false;
      });
    }
  }

  @computed
  get qrInfo(): QrInfoData | null {
    return this.qrInfoData ? { ...this.qrInfoData } : null;
  }

  @computed
  get deeplinkUrl(): string | null {
    return this.qrInfoData?.deeplinkUrl ?? null;
  }

  @computed
  get isLoading() {
    return this.isFetchingQrInfo;
  }

  @computed
  get error(): string | null {
    return this.qrInfoErrorMessage;
  }

  private buildQrInfoPayload(): QrInfoRequestPayload {
    const queryParams = this.queryParamsService.queryParams;

    return {
      scope: queryParams.scope,
      state: queryParams.state,
      client_id: queryParams.clientId,
      redirect_uri: queryParams.redirectUri,
      response_type: queryParams.responseType,
      code_challenge: queryParams.codeChallenge,
      code_challenge_method: queryParams.codeChallengeMethod,
    };
  }

  private transformQrInfo(data: QrInfoResponse): QrInfoData {
    return {
      id: data.id,
      deeplinkUrl: data.deeplink_url,
      redirectUrl: data.redirect_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }
}
