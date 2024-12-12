'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import itTranslations from '../locales/it.json';

// Define translation interface
interface Translations {
  [key: string]: any;
}

// Translations object
const translations: Translations = {
  en: enTranslations,
  it: itTranslations
};

// Create context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get language from localStorage or detect browser language
    const savedLang = localStorage.getItem('language');
    if (savedLang && ['en', 'it'].includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLanguage(['it', 'en'].includes(browserLang) ? browserLang : 'en');
    }
  }, []);

  const handleSetLanguage = (newLang: string) => {
    if (['en', 'it'].includes(newLang)) {
      setLanguage(newLang);
      localStorage.setItem('language', newLang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
