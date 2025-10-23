// app/context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import fr from '../locales/fr.json'; // Importez vos fichiers de traduction
import en from '../locales/en.json';

type Language = 'FR' | 'EN';

interface Translation {
  [key: string]: any;
}

interface LanguageContextType {
  language: Language;
  t: (key: string) => string; // Fonction de traduction
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translation> = { FR: fr, EN: en };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('FR');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'FR' ? 'EN' : 'FR'));
  };

  const t = (key: string): string => {
    // Cette fonction trouve la clé (ex: "navbar.gallery") dans le fichier de langue actuel
    const keys = key.split('.');
    let result = translations[language] as any;
    
    for (const k of keys) {
      if (!result || typeof result !== 'object') return key;
      result = result[k];
    }
    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour l'utilisation dans les composants
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};