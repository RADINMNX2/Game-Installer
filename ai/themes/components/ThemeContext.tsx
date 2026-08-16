import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
}

const DEFAULT_THEME: ThemeConfig = {
  primary: '#ef4444',
  secondary: '#be123c',
  accent: '#ff0000',
  background: '#050505',
  surface: '#121212',
};

const ThemeContext = createContext<{
  theme: ThemeConfig;
  updateTheme: (key: keyof ThemeConfig, color: string) => void;
  resetTheme: () => void;
} | undefined>(undefined);

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  useEffect(() => {
    localStorage.setItem('app_theme', JSON.stringify(theme));
    const root = document.documentElement;
    root.style.setProperty('--color-primary', hexToRgb(theme.primary));
    root.style.setProperty('--color-secondary', hexToRgb(theme.secondary));
    root.style.setProperty('--color-accent', hexToRgb(theme.accent));
    root.style.setProperty('--color-background', hexToRgb(theme.background));
    root.style.setProperty('--color-surface', hexToRgb(theme.surface));
    root.style.setProperty('--color-primary-hex', theme.primary);
  }, [theme]);

  const updateTheme = (key: keyof ThemeConfig, color: string) =>
    setTheme((prev) => ({ ...prev, [key]: color }));
  const resetTheme = () => setTheme(DEFAULT_THEME);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
