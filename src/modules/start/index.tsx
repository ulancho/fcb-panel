import { useEffect } from 'react';

import { useQrStatusStore, useQrStore, useStartStore } from 'Common/stores/rootStore.tsx';

import PhoneInputSection from './components/PhoneInputSection.tsx';
import { QrCodeSection } from './components/QrCodeSection.tsx';
import { useStartQueryParams } from './hooks/useStartQueryParams.ts';
import styles from './styles/index.module.scss';

function Start() {
  const startStore = useStartStore();
  const qrStore = useQrStore();
  const qrStatusStore = useQrStatusStore();
  const queryParams = useStartQueryParams();

  useEffect(() => {
    startStore.setQueryParams(queryParams);
    qrStatusStore.reset();

    void startStore.fetchStartInfo();
    void qrStore.fetchQrInfo();

    return () => {
      startStore.reset();
      qrStatusStore.reset();
    };
  }, [queryParams, startStore, qrStore, qrStatusStore]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.backgroundWrapper}>
        <main className={styles.modalContent}>
          <div className={styles.sectionsContainer}>
            <PhoneInputSection />
            <QrCodeSection />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Start;
