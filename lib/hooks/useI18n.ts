'use client';

import { useTranslation } from 'react-i18next';

export function useI18n(namespace?: string) {
  const { t, i18n } = useTranslation(namespace);
  
  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
}
