import { FC } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MapFolderCreateForm } from '../CreateForm';
import { FolderDto, FolderTreeDto } from '../../../../../api/types/mapFolders';

type Props = {
  parent: FolderTreeDto | FolderDto | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const MapFolderCreateDialog: FC<Props> = ({ parent, open, onClose, onSuccess }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('maps.addFolder')}</DialogTitle>
      <DialogContent>
        <MapFolderCreateForm
          onSucces={() => {
            onClose();
            onSuccess?.();
          }}
          parentId={parent?.id}
        />
      </DialogContent>
    </Dialog>
  );
};