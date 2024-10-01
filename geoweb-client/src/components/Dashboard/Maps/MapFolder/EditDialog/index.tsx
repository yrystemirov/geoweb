import { FC } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MapFolderEditForm } from '../EditForm';
import { FolderTreeDto } from '../../../../../api/types/mapFolders';

type Props = {
  item: FolderTreeDto | FolderTreeDto | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const MapFolderEditDialog: FC<Props> = ({ item, open, onClose, onSuccess }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('editProperties')}</DialogTitle>
      <DialogContent>
        <MapFolderEditForm
          id={item?.id}
          onSuccess={() => {
            onClose();
            onSuccess?.();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};