"use client";

import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    if (i18n.language === lang) return;
    localStorage.setItem('i18nextLng', lang);
    i18n.changeLanguage(lang);
  };

  // Use i18n.language directly from the context
  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentLang === 'en'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('zh')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentLang === 'zh'
            ? 'bg-indigo-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to Chinese"
      >
        中文
      </button>
    </div>
  );
}
