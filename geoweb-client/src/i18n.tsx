// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  kk: {
    translation: {
      main_extent:'Басты ауқым',
      myLocationTitle: "Менің орным",
      myLocationTimeout: "Орын іздеу уақыты өтті. Қайта көріңіз.",
      myLocationTError: "Орын іздеу кезінде қате болды. Қайта көріңіз.",
      myLocationGeoNotSupported: "Navigator geolocation-ды сүйемелдемейді",
      welcome: 'Басты бетке қош келдіңіз',
      dashboard: 'Басқару тақтасы',
      dictionaries: 'Сөздіктер',
      users: 'Пайдаланушылар',
      mapSettings: 'Картаның параметрлері',
      layers: 'Слойлар',
      styleEditor: 'Слой стилін өңдеу',
      layerAttributes: 'Слойлардың атрибуттары',
      language: 'Тіл',
      signIn: 'Кіру',
      signInTitle: 'Жүйеге кіру',
      login: 'Логин',
      password: 'Құпия сөз',
    },
  },
  ru: {
    translation: {
      main_extent:'Главный экстент',
      myLocationTitle: "Мое местоположение",
      myLocationTimeout: "Время поиска местоположения истекло. Попробуйте еще раз.",
      myLocationTError: "Произошла ошибка при поиске местоположения. Попробуйте еще раз.",
      myLocationGeoNotSupported: "Navigator не поддерживает геолокацию",
      welcome: 'Добро пожаловать на главную страницу',
      dashboard: 'Панель управления',
      dictionaries: 'Справочники',
      users: 'Пользователи',
      mapSettings: 'Настройки карты',
      layers: 'Слои',
      styleEditor: 'Редактор стилей',
      layerAttributes: 'Атрибуты слоев',
      language: 'Язык',
      signIn: 'Войти',
      signInTitle: 'Войти в систему',
      login: 'Логин',
      password: 'Пароль',
    },
  },
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
