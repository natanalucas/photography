// app/context/ThemeProvider.tsx
'use client';

// ⭐️ CORRECTION DE L'IMPORTATION DES TYPES
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Le ThemeProvider gère l'application de la classe 'dark' sur la balise <html>
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}