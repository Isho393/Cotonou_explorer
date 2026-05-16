import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'cotonou-explorer-theme';

export function useTheme() {
  // Initialiser avec le thème sauvegardé ou 'dark' par défaut
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    // Appliquer le thème au document
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }

    // Sauvegarder dans localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
