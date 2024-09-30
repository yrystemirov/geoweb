import { useTranslation } from 'react-i18next';

export const useTranslatedProp = <T>(prop: string) => {
  const { t } = useTranslation();
  const translatedProp = prop + t('uLng');
  return translatedProp as keyof T;
};