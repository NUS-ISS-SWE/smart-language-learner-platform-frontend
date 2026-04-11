'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Ensure i18n is initialized on client
    if (!i18n.isInitialized) {
      i18n.init({
        lng: localStorage.getItem('i18nextLng') || 'en',
        fallbackLng: 'en',
        ns: ['auth', 'common', 'course', 'composition', 'evaluation', 'admin', 'vocabulary'],
        defaultNS: 'common',
      });
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
