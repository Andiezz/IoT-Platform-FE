import React from 'react';
import { i18nKey } from 'src/locales/i18n';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = ()=>{
  const [t] = useTranslation();

  return <>
    {t(i18nKey.httpResponseMessage._404_Not_Found)}
  </>
}

export default NotFoundPage;