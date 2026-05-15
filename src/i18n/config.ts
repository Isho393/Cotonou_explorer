import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
};

i18n
  .use(LanguageDetector) // Détecte automatiquement la langue du navigateur
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut
    lng: 'fr', // Langue initiale
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    detection: {
      order: ['localStorage', 'navigator'], // Ordre de détection
      caches: ['localStorage'], // Sauvegarde la préférence
    },
  });

export default i18n;
