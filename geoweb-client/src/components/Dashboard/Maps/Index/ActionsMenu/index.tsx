import { FC, useState } from 'react';
import { FolderDto } from '../../../../../api/types/mapFolders';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountTreeOutlined, DeleteOutline, EditOutlined, LockOpen, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../../common/Confirm';
import { useMutation } from '@tanstack/react-query';
import { mapFoldersAPI } from '../../../../../api/mapFolders';
import { dashboardUrl } from '../../../routes';
import { EntityPermissionDto, EntityType } from '../../../../../api/types/entityPermission';
import { entityPermissionAPI } from '../../../../../api/entityPermission';
import { useNotify } from '../../../../../hooks/useNotify';
import { EntityPermissionDialog } from '../../EntityPermissionDialog';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';

type Props = {
  data: FolderDto;
  onRefresh: () => void;
};

export const MapActionsMenu: FC<Props> = ({ data, onRefresh }) => {
  const nameProp = useTranslatedProp('name');
  const { showError, showSuccess } = useNotify();
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSuccess = () => {
    onRefresh();
    handleClose();
    showSuccess();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  const deleteMutation = useMutation({
    mutationFn: () => mapFoldersAPI.deleteFolder(data.id).then((res) => res.data),
    onSuccess,
  });

  const entitiesMutation = useMutation({
    mutationFn: (e: EntityPermissionDto[]) => entityPermissionAPI.setEntityPermissions(e).then((res) => res.data),
    onSuccess: () => {
      onSuccess();
      setAccessDialogOpen(false);
    },
    onError: (error) => showError({ error }),
  });

  return (
    <Box>
      <IconButton
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls={anchorEl ? 'map-menu' : undefined}
        aria-expanded={!!anchorEl}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="map-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            setAccessDialogOpen(true);
            handleClose();
          }}
        >
          <LockOpen sx={{ marginRight: 1 }} /> {t('access.title', { name: '' })}
        </MenuItem>

        <MenuItem onClick={() => navigate(`${dashboardUrl}/maps/${data.id}/edit`)}>
          <EditOutlined sx={{ marginRight: 1 }} /> {t('editProperties', { name: '' })}
        </MenuItem>

        <MenuItem onClick={() => navigate(`${dashboardUrl}/maps/${data.id}/edit-layers`)}>
          <AccountTreeOutlined sx={{ marginRight: 1 }} /> {t('maps.editStructure')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
            handleClose();
          }}
        >
          <DeleteOutline sx={{ marginRight: 1 }} /> {t('delete')}
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('deleteConfirm')}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={deleteMutation.mutate}
        isLoading={deleteMutation.isPending}
      >
        {t('deleteConfirmDescription')}
      </ConfirmDialog>

      {accessDialogOpen && (
        <EntityPermissionDialog
          title={t('access.MAP', { name: data[nameProp] ? `"${data[nameProp]}"` : '' })}
          open
          onClose={() => setAccessDialogOpen(false)}
          entityId={data.id}
          entityType={EntityType.FOLDER}
          onSubmit={entitiesMutation.mutate}
          isLoading={entitiesMutation.isPending}
        />
      )}
    </Box>
  );
};
