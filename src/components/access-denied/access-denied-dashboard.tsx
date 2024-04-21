import React from 'react';
import styles from './access-denied.module.less';

import { useTranslation } from 'react-i18next';
import { ReactComponent as AccessDeniedIcon } from 'src/assets/icons/access-denied.svg';
import { i18nKey } from 'src/locales/i18n';

const AccessDeniedDashboard = () => {
  const [t] = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <AccessDeniedIcon />
      </div>
      <div className={styles.label} style={{ textAlign: 'center' }}>
        {t(i18nKey.httpResponseMessage._500_Dashboard_No_Plant_Data)}
      </div>
    </div>
  );
};
export default AccessDeniedDashboard;
