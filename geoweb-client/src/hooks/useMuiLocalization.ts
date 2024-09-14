import { ruRU as dgRu } from '@mui/x-data-grid/locales';
import { useTranslation } from 'react-i18next';
import { muiDgKkLocale } from '../utils/localization/muiDgLocale';

enum Language {
  KK = 'kk',
  RU = 'ru',
}

const getDataGridLocale = (language: string) => {
  switch (language) {
    case Language.RU:
      return dgRu.components.MuiDataGrid.defaultProps.localeText;
    case Language.KK:
      return muiDgKkLocale; // custom locale for Kazakh language, cause it's not supported by MUI
    default:
      return dgRu.components.MuiDataGrid.defaultProps.localeText;
  }
};

export const useMuiLocalization = () => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const dataGridLocale = getDataGridLocale(language);

  return { dataGridLocale };
};
