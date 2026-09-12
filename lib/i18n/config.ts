import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, zh } from '@/locales';
import { studioEn, studioZh } from '@/locales/studio';
import { editorEn, editorZh } from '@/locales/editor';

// Build namespace structure from in-memory locales
const resources = {
  en: {
    editor: editorEn,
    studio: studioEn,
    auth: en.auth,
    common: en.common,
    course: en.course,
    composition: en.composition,
    evaluation: en.evaluation,
    admin: en.admin,
    vocabulary: en.vocabulary,
    home: en.home,
    dashboard: en.dashboard,
    documents: en.documents,
  },
  zh: {
    editor: editorZh,
    studio: studioZh,
    auth: zh.auth,
    common: zh.common,
    course: zh.course,
    composition: zh.composition,
    evaluation: zh.evaluation,
    admin: zh.admin,
    vocabulary: zh.vocabulary,
    home: zh.home,
    dashboard: zh.dashboard,
    documents: zh.documents,
  },
};

// Initialize i18next with default settings
i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['editor', 'studio', 'auth', 'common', 'course', 'composition', 'evaluation', 'admin', 'vocabulary', 'home', 'dashboard', 'documents'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    load: 'currentOnly',
  });

export default i18n;
