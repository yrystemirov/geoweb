import { useTranslation } from 'react-i18next';

export const useTranslatedProp = <T>(prop: string, lowerCase = false): keyof T => {
  const { t } = useTranslation();
  const translatedProp = `${prop}${lowerCase ? t('lng') : t('uLng')}`;
  return translatedProp as keyof T;
};