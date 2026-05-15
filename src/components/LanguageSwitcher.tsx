import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="flex items-center gap-2 glass border border-white/8 rounded-xl px-3 py-2">
      <Languages size={14} className="text-amber-600" />
      <div className="flex gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              i18n.language === lang.code
                ? 'bg-amber-900/40 text-amber-400 border border-amber-800/50'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
            title={lang.label}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
