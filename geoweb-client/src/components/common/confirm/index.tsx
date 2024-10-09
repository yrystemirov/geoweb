import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Loader } from '../loader';

type Props = {
  open: boolean;
  title: string;
  isLoading?: boolean;
  children?: ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
};

const ConfirmDialog: FC<Props> = ({ open, onClose, onSubmit, title, children, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      PaperProps={{
        style: { width: 480 },
      }}
    >
      {isLoading && <Loader />}
      <DialogTitle id="dialog-title" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="text" color="primary" size="large" sx={{ mr: 1 }} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button onClick={onSubmit} color="primary" size="large" variant="contained" autoFocus disabled={isLoading}>
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;