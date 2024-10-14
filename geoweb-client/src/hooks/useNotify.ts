import { ShowNotificationOptions, useNotifications } from '@toolpad/core';
import { useTranslation } from 'react-i18next';
import { constants } from '../constants';
import i18n from '../i18n';

type NotificationPayload = {
  text?: string;
} & ShowNotificationOptions;

export const useNotify = () => {
  const { t } = useTranslation();
  const { show } = useNotifications();

  const showSuccess = (payload?: NotificationPayload) => {
    show(payload?.text || t('success'), { severity: 'success', autoHideDuration: constants.ntfHideDelay, ...payload });
  };

  const showError = (payload?: NotificationPayload & { error?: any }) => {
    const hasTranslation = i18n.exists(payload?.error?.response?.data?.message);
    const textFromError = hasTranslation
      ? t(payload?.error?.response?.data?.message)
      : payload?.error?.response?.data?.message;
      
    show(textFromError || payload?.text || t('errorOccurred'), {
      severity: 'error',
      autoHideDuration: constants.ntfHideDelay,
      ...payload,
    });
  };

  const showInfo = (payload?: NotificationPayload) => {
    show(payload?.text || t('info'), { severity: 'info', autoHideDuration: constants.ntfHideDelay, ...payload });
  };

  const showWarning = (payload?: NotificationPayload) => {
    show(payload?.text || t('warning'), { severity: 'warning', autoHideDuration: constants.ntfHideDelay, ...payload });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};