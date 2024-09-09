// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  kk: {
    translation: {
      main_extent:'Main Extent',
      myLocationTitle: "Менің орным",
      myLocationTimeout: "Орын іздеу уақыты өтті. Қайта көріңіз.",
      myLocationTError: "Орын іздеу кезінде қате болды. Қайта көріңіз.",
      myLocationGeoNotSupported: "Navigator geolocation-ды сүйемелдемейді",
      welcome: 'Welcome to the Home Page',
      login: 'Login Page',
      dashboard: 'Dashboard',
      language: 'Language',
    },
  },
  ru: {
    translation: {
      main_extent:'Main Extent rus',
      welcome: 'Bienvenue sur la page d\'accueil',
      login: 'Page de connexion',
      dashboard: 'Tableau de bord',
      language: 'Langue',
    },
  }
 
};

i18n
  .use(initReactI18next) // Integrates i18n with React
  .init({
    resources,
    lng: 'kk', // Default language
    fallbackLng: 'kk', // Fallback language if the current language key is missing
    interpolation: {
      escapeValue: false, // React escapes by default
    },
  });

export default i18n;
