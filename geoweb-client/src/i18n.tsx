// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  kk: {
    translation: {
      lng: 'kk',
      uLng: 'Kk',
      main_extent: 'Басты ауқым',
      myLocationTitle: 'Менің орным',
      myLocationTimeout: 'Орын іздеу уақыты өтті. Қайта көріңіз.',
      myLocationTError: 'Орын іздеу кезінде қате болды. Қайта көріңіз.',
      myLocationGeoNotSupported: 'Navigator geolocation-ды сүйемелдемейді',
      welcome: 'Басты бетке қош келдіңіз',
      dashboard: 'Басқару тақтасы',
      dictionaries: 'Сөздіктер',
      users: 'Пайдаланушылар',
      mapSettings: 'Картаның параметрлері',
      layers: 'Қабаттар',
      styleEditor: 'Қабат стилін өңдеу',
      layerAttributes: 'Қабаттардың атрибуттары',
      language: 'Тіл',
      create: 'Құру',
      save: 'Сақтау',
      edit: 'Өңдеу',
      editProperties: '{{name}} Мүшелерді өңдеу',
      cancel: 'Бас тарту',
      confirm: 'Растау',
      delete: 'Жою',
      deleteConfirm: 'Жоюды растау',
      deleteConfirmDescription: 'Жоюды растаңыз, әрекет қайтарылмайды',
      signIn: 'Кіру',
      signOut: 'Шығу',
      signInTitle: 'Жүйеге кіру',
      login: 'Логин',
      password: 'Құпия сөз',
      noData: 'Деректер жоқ',
      noResult: 'Іздеу нәтижелері жоқ',
      search: 'Іздеу',
      name: 'Атауы',
      nameRu: 'Атауы (ru)',
      nameKk: 'Атауы (kz)',
      nameEn: 'Атауы (en)',
      descriptionRu: 'Сипаттамасы (ru)',
      descriptionKk: 'Сипаттамасы (kz)',
      descriptionEn: 'Сипаттамасы (en)',
      rank: 'Басымдық №',
      code: 'Код',
      addRecord: 'Жазба қосу',
      dictionaryEntries: '"{{dicName}}" сөздіктің жазбалары',
      addDictionary: 'Сөздік қосу',
      actions: 'Әрекеттер',
      requiredField: 'Міндетті толтыру керек',
      mustBeNumber: 'Санды енгізу керек',
      errorOccurred: 'Қате пайда болды',
      backToList: 'Тізімге қайту',
      measurement: {
        square: 'Алаң',
        length: 'Ұзындық',
      },
      complete: 'Аяқтау',
      maps: {
        title: 'Карталар',
        addLayer: 'Қабат қосу',
        addLayerTitle: '{{folder}} Бумаға қабат қосу',
        editLayer: '{{layer}} Қабатты өңдеу',
        addFolderTitle: '{{folder}} Бумасына жаңа бума қосу',
        addMap: 'Карта қосу',
        addStyle: 'Стиль қосу',
        isPublic: 'Жалпыға ортақ',
        editStructure: 'Құрылымды өңдеу',
        addFolder: 'Бума қосу',
        deleteFolder: 'Буманы жою',
        deleteLayer: 'Қабатты толық жою',
        removeLayerFromFolder: 'Қабатты {{folder}} бумасынан жою',
        removeLayerFromFolderDescription: '{{folder}} бумасынан {{layer}} қабатын жою керек пе?',
        removeLayerFromAllFolders: 'Қабатты барлық бумалардан жою',
        layername: 'Қабат атауы',
        geometryType: 'Геометрия түрі',
        layerType: 'Қабат түрі',
        url: 'Сыртқы ресурстың URL-ы',
        baseLayer: 'Негізгі қабат',
        checkIntersection: 'Үтірді тексеру',
        isBlockLayer: 'Блоктық қабат',
        isDynamic: 'Динамикалық',
        useExistingLayer: 'Бар қабатты пайдалану',
      },
      yes: 'Ия',
      no: 'Жоқ',
      success: 'Сәтті',
      // error messages from backend
      'entry.by_code.already_exists': 'Осы кодпен жазба бар',
      'dictionary.by_code.already_exists': 'Осы кодпен сөздік бар',
    },
  },
  ru: {
    translation: {
      lng: 'ru',
      uLng: 'Ru',
      main_extent: 'Главный экстент',
      myLocationTitle: 'Мое местоположение',
      myLocationTimeout: 'Время поиска местоположения истекло. Попробуйте еще раз.',
      myLocationTError: 'Произошла ошибка при поиске местоположения. Попробуйте еще раз.',
      myLocationGeoNotSupported: 'Navigator не поддерживает геолокацию',
      welcome: 'Добро пожаловать на главную страницу',
      dashboard: 'Панель управления',
      dictionaries: 'Справочники',
      users: 'Пользователи',
      mapSettings: 'Настройки карты',
      layers: 'Слои',
      styleEditor: 'Редактор стилей',
      layerAttributes: 'Атрибуты слоев',
      language: 'Язык',
      create: 'Создать',
      save: 'Сохранить',
      edit: 'Редактировать',
      editProperties: 'Изменить свойства {{name}}',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      delete: 'Удалить',
      deleteConfirm: 'Подтверждение удаления',
      deleteConfirmDescription: 'Подтвердите удаление, действие необратимо',
      signIn: 'Войти',
      signOut: 'Выйти',
      signInTitle: 'Войти в систему',
      login: 'Логин',
      password: 'Пароль',
      noData: 'Нет данных',
      noResult: 'Результаты поиска отсутствуют',
      search: 'Поиск',
      name: 'Наименование',
      nameRu: 'Наименование (ru)',
      nameKk: 'Наименование (kz)',
      nameEn: 'Наименование (en)',
      descriptionRu: 'Описание (ru)',
      descriptionKk: 'Описание (kz)',
      descriptionEn: 'Описание (en)',
      rank: 'Приоритет №',
      code: 'Код',
      addRecord: 'Добавить запись',
      dictionaryEntries: 'Записи справочника "{{dicName}}"',
      addDictionary: 'Добавить справочник',
      actions: 'Действия',
      requiredField: 'Поле обязательно для заполнения',
      mustBeNumber: 'Должно быть числом',
      errorOccurred: 'Произошла ошибка',
      backToList: 'Назад к списку',
      measurement: {
        square: 'Площадь',
        length: 'Длинна',
      },
      complete: 'Завершить',
      maps: {
        title: 'Карты',
        addLayer: 'Добавить слой',
        addLayerTitle: 'Добавить слой в папку {{folder}}',
        editLayer: 'Редактировать слой {{layer}}',
        addFolderTitle: 'Добавить новую папку в {{folder}}',
        addMap: 'Добавить карту',
        addStyle: 'Добавить стиль',
        isPublic: 'Публичная',
        editStructure: 'Редактировать структуру',
        addFolder: 'Добавить папку',
        deleteFolder: 'Удалить папку',
        deleteLayer: 'Удалить слой безвозвратно',
        removeLayerFromFolder: 'Удалить слой из папки {{folder}}',
        removeLayerFromFolderDescription: 'Удалить слой {{layer}} из папки {{folder}}?',
        removeLayerFromAllFolders: 'Удалить слой из всех папок',
        layername: 'Название слоя',
        geometryType: 'Тип геометрии',
        layerType: 'Тип слоя',
        url: 'URL внешнего ресурса',
        baseLayer: 'Базовый слой',
        checkIntersection: 'Проверка наложения',
        isBlockLayer: 'Блочный слой',
        isDynamic: 'Динамический',
        useExistingLayer: 'Использовать существующий слой',
      },
      yes: 'Да',
      no: 'Нет',
      success: 'Успешно',
      'entry.by_code.already_exists': 'Запись с таким кодом уже существует',
      'dictionary.by_code.already_exists': 'Справочник с таким кодом уже существует',
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
