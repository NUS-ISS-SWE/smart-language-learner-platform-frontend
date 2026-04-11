import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en, zh } from '@/locales';

// Build namespace structure
const resources = {
  en: {
    auth: en.auth,
    common: en.common,
    course: en.course,
    composition: en.composition,
    evaluation: en.evaluation,
    admin: en.admin,
    vocabulary: en.vocabulary,
  },
  zh: {
    auth: zh.auth,
    common: zh.common,
    course: zh.course,
    composition: zh.composition,
    evaluation: zh.evaluation,
    admin: zh.admin,
    vocabulary: zh.vocabulary,
  },
};

// Only initialize in browser
if (typeof window !== 'undefined') {
  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
        },
      });
  }
}

export default i18n;
