import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  fetchQrStatus,
  type QrStatusRequestPayload,
  type QrStatusResponse,
} from '../api/qrStatusApi.ts';

import type { StartInfoService } from './startInfoService.ts';
import type { QrInfoService } from 'Modules/start/services/qrInfoService.ts';
import type { StartQueryParamsService } from 'Modules/start/services/startQueryParamsService.ts';

interface QrStatusData {
  id: string;
  deeplinkUrl: string;
  redirectUrl: string;
  status: string;
  expiresIn: string;
}

function createDefaultQrStatus(): QrStatusData | null {
  return null;
}

export class QrStatusService {
  @observable.ref private qrStatusData: QrStatusData | null = createDefaultQrStatus();
  @observable private isFetchingQrStatus = false;
  @observable private qrStatusErrorMessage: string | null = null;
  private isRefreshingQrInfo = false;

  constructor(
    private readonly startInfoService: StartInfoService,
    private readonly queryParamsService: StartQueryParamsService,
    private readonly qrInfoService: QrInfoService,
    private readonly qrStatusFetcher: typeof fetchQrStatus = fetchQrStatus,
  ) {
    makeObservable(this);
  }

  @action
  reset() {
    this.qrStatusData = createDefaultQrStatus();
    this.isFetchingQrStatus = false;
    this.qrStatusErrorMessage = null;
  }

  @action
  async fetchQrStatus(id: string) {
    if (this.isRefreshingQrInfo) {
      return;
    }

    this.isFetchingQrStatus = true;
    this.qrStatusErrorMessage = null;

    const payload = this.buildQrStatusPayload(id);

    try {
      const data = await this.qrStatusFetcher(payload);

      runInAction(() => {
        this.qrStatusData = this.transformQrStatus(data);
      });
      if (data.status === 'EXPIRED') {
        await this.handleExpiredStatus();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось получить статус QR-кода.';

      runInAction(() => {
        this.qrStatusData = null;
        this.qrStatusErrorMessage = message;
      });

      const status = (error as { response?: { status?: number } }).response?.status;
      const redirectUri =
        this.startInfoService.startInfo?.redirectUri ??
        this.queryParamsService.queryParamRedirectUri;

      if (redirectUri && status && status !== 200) {
        window.location.replace(redirectUri);
      }
    } finally {
      runInAction(() => {
        this.isFetchingQrStatus = false;
      });
    }
  }

  @computed
  get qrStatus(): QrStatusData | null {
    return this.qrStatusData ? { ...this.qrStatusData } : null;
  }

  @computed
  get status(): string | null {
    return this.qrStatusData?.status ?? null;
  }

  @computed
  get isLoading() {
    return this.isFetchingQrStatus;
  }

  @computed
  get error(): string | null {
    return this.qrStatusErrorMessage;
  }

  private buildQrStatusPayload(id: string): QrStatusRequestPayload {
    const queryParams = this.queryParamsService.queryParams;

    return {
      id,
      state: queryParams.state,
      redirect_uri: queryParams.redirectUri,
    };
  }

  private transformQrStatus(data: QrStatusResponse): QrStatusData {
    return {
      id: data.id,
      deeplinkUrl: data.deeplink_url,
      redirectUrl: data.redirect_url,
      status: data.status,
      expiresIn: data.expires_in,
    };
  }

  private async handleExpiredStatus() {
    if (this.isRefreshingQrInfo) {
      return;
    }

    this.isRefreshingQrInfo = true;

    try {
      await this.qrInfoService.fetchQrInfo();
    } finally {
      this.isRefreshingQrInfo = false;
    }
  }
}
