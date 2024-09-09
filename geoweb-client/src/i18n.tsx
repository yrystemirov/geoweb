// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to the Home Page',
      login: 'Login Page',
      dashboard: 'Dashboard',
      language: 'Language',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue sur la page d\'accueil',
      login: 'Page de connexion',
      dashboard: 'Tableau de bord',
      language: 'Langue',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido a la página de inicio',
      login: 'Página de inicio de sesión',
      dashboard: 'Tablero',
      language: 'Idioma',
    },
  },
};

i18n
  .use(initReactI18next) // Integrates i18n with React
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if the current language key is missing
    interpolation: {
      escapeValue: false, // React escapes by default
    },
  });

export default i18n;
