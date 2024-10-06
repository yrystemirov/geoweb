import { ShowNotificationOptions, useNotifications } from '@toolpad/core';
import { useTranslation } from 'react-i18next';
import { constants } from '../constants';

type NotificationPayload = {
  text?: string;
} & ShowNotificationOptions;

export const useNotify = () => {
  const { t } = useTranslation();
  const { show } = useNotifications();

  const showSuccess = (payload?: NotificationPayload) => {
    show(payload?.text || t('success'), { severity: 'success', autoHideDuration: constants.ntfHideDelay, ...payload });
  };

  const showError = (payload?: NotificationPayload) => {
    show(payload?.text || t('errorOccurred'), {
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
