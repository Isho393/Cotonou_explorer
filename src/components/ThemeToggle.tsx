import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group"
      aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
      title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
      ) : (
        <Moon size={18} className="text-slate-600 group-hover:text-slate-700 transition-colors" />
      )}
    </button>
  );
}
