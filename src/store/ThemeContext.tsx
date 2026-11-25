/**
 * Contexto de Tema e Paleta (src/store/ThemeContext.tsx)
 * Sincroniza data-theme (claro/escuro/sistema) e data-palette no elemento <html>.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserSettings } from '../types/domain';

interface ThemeContextValue {
  themeMode: UserSettings['themeMode'];
  resolvedTheme: 'light' | 'dark';
  colorPalette: UserSettings['colorPalette'];
  setThemeMode: (mode: UserSettings['themeMode']) => void;
  setColorPalette: (palette: UserSettings['colorPalette']) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Detecta preferência atual de tema escuro do sistema operacional
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export const ThemeProvider: React.FC<{
  initialTheme?: UserSettings['themeMode'];
  initialPalette?: UserSettings['colorPalette'];
  children: React.ReactNode;
}> = ({ initialTheme = 'system', initialPalette = 'default', children }) => {
  // Estados controlados de modo de tema e paleta de cores do humor
  const [themeMode, setThemeMode] = useState<UserSettings['themeMode']>(initialTheme);
  const [colorPalette, setColorPalette] = useState<UserSettings['colorPalette']>(initialPalette);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme());

  const resolvedTheme: 'light' | 'dark' = themeMode === 'system' ? systemTheme : themeMode;

  // Escuta alterações dinâmicas do tema do sistema operacional
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener?.('change', handleChange);
    return () => media.removeEventListener?.('change', handleChange);
  }, []);

  // Aplica atributos semânticos no elemento raiz <html> para ativar os tokens CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.setAttribute('data-palette', colorPalette);
  }, [resolvedTheme, colorPalette]);

  return (
    <ThemeContext.Provider
      value={{ themeMode, resolvedTheme, colorPalette, setThemeMode, setColorPalette }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook de consumo seguro do contexto de tema
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.');
  }
  return ctx;
}
