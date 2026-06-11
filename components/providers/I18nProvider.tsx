'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

interface I18nProviderProps {
  readonly children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Apply the user's stored language preference on mount.
  // i18n initialises synchronously (inline resources), so we only need
  // to sync the stored language — we never need to gate rendering.
  useEffect(() => {
    const stored = localStorage.getItem('i18nextLng');
    if (stored && stored !== i18n.language) {
      void i18n.changeLanguage(stored);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
