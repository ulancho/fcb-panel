import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useCountryCodesStore,
  usePhoneAuthStore,
  useStartStore,
} from 'Common/stores/rootStore.tsx';

import { DEFAULT_PHONE_DIGITS_LENGTH } from '../services/countryCodeService.ts';
import styles from '../styles/index.module.scss';

import type { CountryCode } from '../services/countryCodeService.ts';

const INITIAL_BOUND_TIME = 113;

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${restSeconds.toString().padStart(2, '0')}`;
};

const calculateTimeLeft = (expiresIn: string | null, fallback: number) => {
  if (!expiresIn) {
    return fallback;
  }

  const expiresAt = Date.parse(expiresIn);

  if (Number.isNaN(expiresAt)) {
    return fallback;
  }

  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
};

function PhoneInputSection() {
  const countryCodesStore = useCountryCodesStore();
  const countryCodes = countryCodesStore.countryCodes;
  const startStore = useStartStore();
  const startStoreInfo = startStore.startInfo;
  const phoneAuthStore = usePhoneAuthStore();

  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(
    countryCodes[0] ?? null,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void countryCodesStore.fetchCountryCodes();
  }, [countryCodesStore]);

  useEffect(() => {
    if (!countryCodes.length) {
      setSelectedCountry(null);
      return;
    }

    setSelectedCountry((prev) => {
      if (!prev) {
        return countryCodes[0];
      }

      const updated = countryCodes.find((country) => country.id === prev.id);
      return updated ?? countryCodes[0];
    });
  }, [countryCodes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedCountry) {
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;

    void phoneAuthStore.sendPhoneAuth(fullPhoneNumber);
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setPhoneNumber('');
    setIsDropdownOpen(false);
    phoneAuthStore.resetStatus();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    if (phoneAuthStore.isSuccess || phoneAuthStore.error) {
      phoneAuthStore.resetStatus();
    }
  };

  const selectedCode = selectedCountry?.code ?? '';
  const selectedIsoCode = selectedCountry?.isoCode?.toUpperCase() ?? '--';
  const phoneDigitsLimit = selectedCountry?.digitsCount ?? DEFAULT_PHONE_DIGITS_LENGTH;
  const isFormValid = Boolean(selectedCountry) && phoneNumber.trim().length === phoneDigitsLimit;

  const isSubmitting = phoneAuthStore.isLoading;
  const submitError = phoneAuthStore.error;
  // const isSubmitSuccess = phoneAuthStore.isSuccess;

  const phoneAuthResponse = phoneAuthStore.response;
  const phoneAuthStatus = phoneAuthResponse?.status ?? null;
  const isBoundStatus = phoneAuthStatus === 'BOUND';
  const expiresIn = phoneAuthResponse?.expires_in ?? null;

  const [boundTimeLeft, setBoundTimeLeft] = useState(INITIAL_BOUND_TIME);

  useEffect(() => {
    if (!isBoundStatus) {
      setBoundTimeLeft(INITIAL_BOUND_TIME);
      return;
    }

    setBoundTimeLeft(calculateTimeLeft(expiresIn, INITIAL_BOUND_TIME));
  }, [expiresIn, isBoundStatus]);

  useEffect(() => {
    if (!isBoundStatus) {
      return;
    }

    const timerId = window.setInterval(() => {
      setBoundTimeLeft((timeLeft) => (timeLeft > 0 ? timeLeft - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isBoundStatus]);

  const boundTimerLabel = useMemo(() => {
    if (!isBoundStatus) {
      return null;
    }

    return `Истекает через ${formatTime(boundTimeLeft)}`;
  }, [boundTimeLeft, isBoundStatus]);

  // const showSuccessMessage = isSubmitSuccess && !submitError && !isBoundStatus;

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContent}>
        <div className={styles.loginInner}>
          <header className={styles.headerSection}>
            {startStoreInfo?.logoUrl && (
              <img src={startStoreInfo?.logoUrl} alt="Partner logo" className={styles.logoImage} />
            )}
            <div className={styles.titleSection}>
              <h1 className={styles.mainTitle}>Войти через MBANK ID</h1>
              <p className={styles.subtitle}>{startStoreInfo?.clientName}</p>
            </div>
          </header>

          {isBoundStatus ? (
            <div className={styles.boundStatusContainer}>
              <span className={styles.loader} aria-label="Ожидание подтверждения входа" />
              <p className={styles.loaderText}>Ждем подтверждения входа</p>
              {boundTimerLabel && (
                <div className={styles.boundTimerSection}>
                  <span className={styles.timerText}>{boundTimerLabel}</span>
                </div>
              )}
              <div className={styles.boundActions}>
                <button type="button" className={styles.boundBackButton}>
                  <img src="src/assets/icons/back.svg" alt="back icon" />
                  <span>Вернуться</span>
                </button>
                <button type="button" className={styles.boundHelpButton}>
                  Я не получил(-а) уведомление
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <div
                  className={
                    submitError
                      ? `${styles.inputWrapper} ${styles.errorBorder}`
                      : `${styles.inputWrapper}`
                  }
                >
                  <div className={styles.countryCodeDropdown} ref={dropdownRef}>
                    <button
                      type="button"
                      className={styles.countryCodeButton}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      {selectedCountry?.flagPath ? (
                        <img
                          src={selectedCountry.flagPath}
                          alt={`${selectedCountry.country} flag`}
                          className={styles.flagIcon}
                        />
                      ) : (
                        <span className={styles.flagFallback}>{selectedIsoCode}</span>
                      )}
                      <span className={styles.codeText}>
                        {selectedCode || (countryCodesStore.isLoading ? 'Загрузка…' : 'Код')}
                      </span>
                      <svg
                        className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ''}`}
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M4 6l4 4 4-4H4z" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className={styles.dropdownMenu} role="listbox">
                        {!countryCodes.length && (
                          <div className={styles.dropdownNotice}>
                            {countryCodesStore.isLoading
                              ? 'Загрузка справочника…'
                              : 'Нет доступных стран'}
                          </div>
                        )}
                        {countryCodes.map((country) => (
                          <button
                            key={country.id}
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => handleCountrySelect(country)}
                            role="option"
                            aria-selected={selectedCountry?.id === country.id}
                          >
                            {country.flagPath ? (
                              <img
                                src={country.flagPath}
                                alt={`${country.country} flag`}
                                className={styles.flagIcon}
                              />
                            ) : (
                              <span className={styles.flagFallback}>
                                {country.isoCode?.toUpperCase() ?? '--'}
                              </span>
                            )}
                            <span className={styles.codeText}>{country.code}</span>
                            <span>{country.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.inputContent}>
                    <div className={styles.phoneInputWrapper}>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={styles.phoneInput}
                        placeholder=""
                        maxLength={phoneDigitsLimit}
                        autoComplete="tel"
                        disabled={!selectedCountry}
                      />
                      <label
                        className={`${styles.inputLabel} ${
                          isFocused || phoneNumber ? styles.inputLabelHidden : ''
                        }`}
                      >
                        Номер телефона
                      </label>
                    </div>
                    {countryCodesStore.hasError && (
                      <p className={styles.errorMessage} role="alert">
                        {countryCodesStore.error ?? 'Не удалось загрузить список стран.'}
                      </p>
                    )}
                  </div>
                </div>
                {submitError && (
                  <p className={styles.errorMessage} role="alert">
                    {submitError}
                  </p>
                )}
              </div>
              <div className={styles.buttonSection}>
                <button
                  type="submit"
                  className={`${styles.submitButton} ${
                    isFormValid ? styles.submitButtonActive : ''
                  } ${isSubmitting ? styles.submitButtonLoading : ''}`}
                  disabled={!isFormValid || isSubmitting}
                >
                  <span
                    className={`${styles.buttonText} ${isFormValid ? styles.buttonTextActive : ''}`}
                  >
                    Далее
                  </span>
                </button>
                <p className={styles.privacyText}>
                  Прежде чем начать работу с приложением &quot;Ticket&quot;, вы можете ознакомиться
                  с его{' '}
                  <a
                    target="_blank"
                    href={startStoreInfo?.offerUrl}
                    className={styles.privacyLink}
                    rel="noreferrer"
                  >
                    политикой конфиденциальности
                  </a>{' '}
                  и{' '}
                  <a
                    target="_blank"
                    href={startStoreInfo?.agreementUrl}
                    rel="noreferrer"
                    className={styles.privacyLink}
                  >
                    условиями пользования.
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default observer(PhoneInputSection);
