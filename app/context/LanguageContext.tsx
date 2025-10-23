// app/context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import fr from '../locales/fr.json'; 
import en from '../locales/en.json';

// Utiliser 'FR' | 'EN' comme type littéral pour plus de sécurité
type Language = 'FR' | 'EN';

// Définir un type récursif pour les objets de traduction.
// Cela permet d'avoir des objets imbriqués sans utiliser 'any'.
// Nous utilisons 'unknown' pour la valeur finale, car on ne sait pas si c'est une string ou un autre objet.
type Translation = {
  [key: string]: string | Translation;
};

interface LanguageContextType {
  language: Language;
  t: (key: string) => string; // Fonction de traduction
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Ici, nous utilisons l'interface Translation pour typer nos imports
const translations: Record<Language, Translation> = { FR: fr, EN: en } as Record<Language, Translation>;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('FR');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'FR' ? 'EN' : 'FR'));
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    
    // Initialiser le résultat avec le type plus sûr 'Translation'
    let result: string | Translation | undefined = translations[language];
    
    for (const k of keys) {
      // 1. Vérifier si le résultat est toujours un objet avant de continuer
      if (!result || typeof result !== 'object') {
        // Si ce n'est pas un objet ou s'il est undefined, on retourne la clé
        return key; 
      }
      
      // 2. On accède à la sous-clé. Nous devons forcer le type à 'Translation'
      // pour permettre l'itération, ou 'string' pour la valeur finale.
      // TypeScript nécessite cette assertion pour naviguer dans l'objet.
      result = (result as Translation)[k];
    }

    // 3. Vérifier que le résultat final est une chaîne de caractères
    if (typeof result === 'string') {
      return result;
    }
    
    // Si la clé n'est pas trouvée ou n'est pas une string
    return key; 
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