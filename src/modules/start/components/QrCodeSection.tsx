import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useQrStatusStore, useQrStore } from 'Common/stores/rootStore.tsx';

import qrLogoSvg from '../../../assets/icons/mbank-logo.svg?raw';
import styles from '../styles/index.module.scss';

import type { QrCodeStylingConstructor, QrCodeStylingInstance } from 'Common/types/qrCodeStyling';

/* Constants & Helpers */
const INITIAL_TIME = 113;

const QR_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(qrLogoSvg)}`;

const formatTime = (seconds: number) => {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
};

let qrLibraryPromise: Promise<QrCodeStylingConstructor> | null = null;

function loadQrCodeStyling(): Promise<QrCodeStylingConstructor> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Библиотека QR-кодов недоступна.'));
  }

  if (qrLibraryPromise) {
    return qrLibraryPromise;
  }

  // eslint-disable-next-line import/no-unresolved
  qrLibraryPromise = import('qr-code-styling')
    .then((module) => {
      const Constructor = module.default as QrCodeStylingConstructor | undefined;

      if (!Constructor) {
        throw new Error('Не удалось загрузить библиотеку QR-кодов.');
      }

      return Constructor;
    })
    .catch((error) => {
      qrLibraryPromise = null;
      throw error;
    });

  return qrLibraryPromise;
}

function calculateTimeLeft(expiresIn: string | null, fallback: number) {
  if (!expiresIn) {
    return fallback;
  }

  const expiresAt = Date.parse(expiresIn);

  if (Number.isNaN(expiresAt)) {
    return fallback;
  }

  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

export const QrCodeSection = observer(function QrCodeSection() {
  const qrStore = useQrStore();
  const qrStatusStore = useQrStatusStore();
  const qrInfo = qrStore.qrInfo;
  const qrLink = qrInfo?.deeplinkUrl ?? null;
  const expiresIn = qrInfo?.expiresIn ?? null;
  const isLoading = qrStore.isLoading;

  const qrStatusValue = qrStatusStore.status;
  const qrId = qrInfo?.id ?? null;
  const isBoundStatus = qrStatusValue === 'BOUND';
  const isConfirmedStatus = qrStatusValue === 'CONFIRMED';

  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [libraryError, setLibraryError] = useState<string | null>(null);

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QrCodeStylingInstance | null>(null);

  const qrReady = Boolean(qrLink) && Boolean(qrInstanceRef.current);
  const expired = timeLeft <= 0;
  const countdownActive = qrLink !== null && timeLeft > 0 && !libraryError;

  const timerLabel = useMemo(() => {
    if (libraryError) return 'QR-код недоступен';
    if (isLoading && !qrLink) return 'Загрузка…';
    if (isLoading) return 'Обновление…';
    if (expired) return 'QR-код устарел';
    return `Истекает через ${formatTime(timeLeft)}`;
  }, [libraryError, isLoading, qrLink, expired, timeLeft]);

  const qrConfig = useMemo(
    () => ({
      width: 232,
      height: 232,
      type: 'svg' as const,
      data: '',
      image: QR_LOGO_DATA_URI,
      margin: 8,
      qrOptions: { errorCorrectionLevel: 'H' as const },
      dotsOptions: { color: '#111622', type: 'rounded' as const },
      cornersSquareOptions: { type: 'extra-rounded' as const, color: '#111622' },
      cornersDotOptions: { color: '#111622' },
      backgroundOptions: { color: '#ffffff' },
      imageOptions: { crossOrigin: 'anonymous' as const, margin: 6, imageSize: 0.4 },
    }),
    [],
  );

  /* 1 Загружаем библиотеку и создаём инстанс один раз */
  useEffect(() => {
    let alive = true;
    setLibraryError(null);
    loadQrCodeStyling()
      .then((Ctor) => {
        if (!alive) return;
        if (!qrInstanceRef.current) {
          qrInstanceRef.current = new Ctor(qrConfig);
        }
        const container = qrContainerRef.current;
        if (container) {
          container.innerHTML = '';
          qrInstanceRef.current.append(container);
        }
        setLibraryError(null);
      })
      .catch((err) => {
        if (!alive) return;
        setLibraryError(
          err instanceof Error ? err.message : 'Не удалось загрузить библиотеку QR-кодов.',
        );
      });

    return () => {
      alive = false;
    };
  }, [qrConfig]);

  /* 2 Следим за контейнером (на случай ре-рендера/порталов) */
  useEffect(() => {
    if (!qrInstanceRef.current || !qrContainerRef.current) return;
    if (qrContainerRef.current.childElementCount === 0) {
      qrInstanceRef.current.append(qrContainerRef.current);
    }
  }, [qrLink]);

  /* 3 Обновляем данные QR при смене ссылки */
  useEffect(() => {
    if (qrInstanceRef.current) {
      qrInstanceRef.current.update({ data: qrLink ?? '' });
    }
  }, [qrLink]);

  /* 4 Таймер */
  useEffect(() => {
    setTimeLeft(calculateTimeLeft(expiresIn, INITIAL_TIME));
  }, [expiresIn]);

  useEffect(() => {
    if (!countdownActive) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [countdownActive]);

  useEffect(() => {
    if (!qrId) {
      qrStatusStore.reset();
      return;
    }

    let disposed = false;

    const fetchStatus = () => {
      if (disposed) {
        return;
      }

      if (qrStatusStore.isLoading) {
        return;
      }

      void qrStatusStore.fetchQrStatus(qrId);
    };

    fetchStatus();

    const intervalId = window.setInterval(fetchStatus, 1000);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [qrId, qrStatusStore]);

  const qrCodeContainerClassName =
    isBoundStatus || isConfirmedStatus
      ? `${styles.qrCodeContainer} ${styles.qrCodeContainerStatus}`
      : styles.qrCodeContainer;

  return (
    <section className={styles.qrSection}>
      <div className={styles.qrContent}>
        <header className={styles.qrTitle}>
          <h2>
            Наведите QR-сканер <br /> из приложения MBANK
          </h2>
        </header>
        <div className={qrCodeContainerClassName}>
          {isConfirmedStatus ? (
            <>
              <img
                src="/src/assets/icons/confirmed.svg"
                alt="Confirmed"
                className={styles.confirmedIcon}
              />
              <p className={styles.confirmedText}>Вход одобрен</p>
            </>
          ) : isBoundStatus ? (
            <>
              <span className={styles.loader} aria-label="QR-код подтверждается" />
              <p className={styles.loaderText}>Ждем подтверждения входа</p>
            </>
          ) : (
            <>
              <div className={styles.qrCodeWrapper}>
                <div ref={qrContainerRef} className={styles.qrCanvas} aria-hidden="true" />
                {!qrReady && (
                  <div className={styles.qrPlaceholder}>
                    {libraryError ?? (isLoading ? 'Загрузка…' : 'QR-код появится здесь')}
                  </div>
                )}
              </div>
              <div className={styles.timerSection}>
                <span className={styles.timerText}>{timerLabel}</span>
              </div>
            </>
          )}
        </div>
        <img
          src="/src/assets/icons/mbank-logo-2.svg"
          alt="MBANK Logo"
          className={styles.mbankLogo}
        />
      </div>
    </section>
  );
});
