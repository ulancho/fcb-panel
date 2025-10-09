import { action, computed, makeObservable, observable } from 'mobx';

import type { StartQueryParams } from '../hooks/useStartQueryParams.ts';

function createDefaultParams(): StartQueryParams {
  return {
    clientId: null,
    codeChallenge: null,
    codeChallengeMethod: null,
    redirectUri: null,
    responseType: null,
    scope: null,
    state: null,
    originalUrl: null,
  };
}

export class StartQueryParamsService {
  @observable.shallow private queryParameters: StartQueryParams = createDefaultParams();

  constructor() {
    makeObservable(this);
  }

  @action
  setQueryParams(queryParams: StartQueryParams) {
    this.queryParameters = {
      ...createDefaultParams(),
      ...queryParams,
    };
  }

  @action
  reset() {
    this.queryParameters = createDefaultParams();
  }

  @computed
  get queryParamClientId() {
    return this.queryParameters.clientId;
  }

  @computed
  get queryParamCodeChallenge() {
    return this.queryParameters.codeChallenge;
  }

  @computed
  get queryParamCodeChallengeMethod() {
    return this.queryParameters.codeChallengeMethod;
  }

  @computed
  get queryParamRedirectUri() {
    return this.queryParameters.redirectUri;
  }

  @computed
  get queryParamResponseType() {
    return this.queryParameters.responseType;
  }

  @computed
  get queryParamScope() {
    return this.queryParameters.scope;
  }

  @computed
  get queryParamState() {
    return this.queryParameters.state;
  }

  @computed
  get queryParamOriginalUrl() {
    return this.queryParameters.originalUrl;
  }

  @computed
  get hasQueryParams() {
    return Boolean(
      this.queryParameters.clientId ||
        this.queryParameters.codeChallenge ||
        this.queryParameters.codeChallengeMethod ||
        this.queryParameters.redirectUri ||
        this.queryParameters.responseType ||
        this.queryParameters.scope ||
        this.queryParameters.state ||
        this.queryParameters.originalUrl,
    );
  }

  @computed
  get queryParams(): StartQueryParams {
    return {
      ...this.queryParameters,
    };
  }
}

export function createDefaultStartQueryParams(): StartQueryParams {
  return createDefaultParams();
}
