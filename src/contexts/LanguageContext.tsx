import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import enTranslations from '@/locales/en.json';
import ptTranslations from '@/locales/pt.json';

type Language = 'en' | 'pt';

type TranslationData = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationData;
  getText: (path: string) => string;
}

const translations: Record<Language, TranslationData> = {
  en: enTranslations,
  pt: ptTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'pt' }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language') as Language;
      if (stored && (stored === 'en' || stored === 'pt')) {
        return stored;
      }
    }
    return defaultLanguage;
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useMemo(() => translations[language], [language]);

  const getText = useCallback((path: string): string => {
    const keys = path.split('.');
    let current: unknown = t;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
    }
    
    return typeof current === 'string' ? current : path;
  }, [t]);

  const value = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t,
    getText,
  }), [language, handleSetLanguage, t, getText]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, getText, language } = useLanguage();
  return { t, getText, language };
}
