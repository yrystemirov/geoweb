import { FC } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { MapFolderCreateForm } from '../CreateForm';
import { FolderDto, FolderTreeDto } from '../../../../../api/types/mapFolders';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';

type Props = {
  parent: FolderTreeDto | FolderDto | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const MapFolderCreateDialog: FC<Props> = ({ parent, open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const nameProp = useTranslatedProp('name');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {parent?.[nameProp] ? `"${parent?.[nameProp]}". ` : ''}
        {t('maps.addFolder')}
      </DialogTitle>
      <DialogContent>
        <MapFolderCreateForm
          onSuccess={() => {
            onClose();
            onSuccess?.();
          }}
          parentId={parent?.id}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};