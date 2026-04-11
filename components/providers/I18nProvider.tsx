'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!i18n.isInitialized) {
      const initialLng = localStorage.getItem('i18nextLng') || 'en';
      i18n.changeLanguage(initialLng).then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
