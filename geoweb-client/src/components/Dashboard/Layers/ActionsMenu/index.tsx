import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { ListAlt, DeleteOutline, EditOutlined, MoreVert, SettingsSuggest, LockOpen } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import ConfirmDialog from '../../../common/Confirm';
import { LayerDto } from '../../../../api/types/mapFolders';
import { layersAPI } from '../../../../api/layer';
import { useNotify } from '../../../../hooks/useNotify';
import { dashboardUrl } from '../../routes';
import { EntityPermissionDialog } from '../../Maps/EntityPermissionDialog';
import { EntityPermissionDto, EntityType } from '../../../../api/types/entityPermission';
import { entityPermissionAPI } from '../../../../api/entityPermission';
import { useTranslatedProp } from '../../../../hooks/useTranslatedProp';

type Props = {
  data: LayerDto;
  onRefresh: () => void;
};

export const LayerActionsMenu: FC<Props> = ({ data, onRefresh }) => {
  const nameProp = useTranslatedProp('name');
  const { showSuccess, showError } = useNotify();
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

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  const deleteMutation = useMutation({
    mutationFn: () => layersAPI.deleteLayer(data.id).then((res) => res.data),
    onSuccess,
    onError: (error) => showError({ error }),
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
        aria-controls={anchorEl ? 'layers-menu' : undefined}
        aria-expanded={!!anchorEl}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="layers-menu"
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
        <MenuItem onClick={() => navigate(`${dashboardUrl}/layers/${data.id}/style`)}>
          <SettingsSuggest sx={{ marginRight: 1 }} /> {t('styles.title', { name: '' })}
        </MenuItem>
        <MenuItem onClick={() => navigate(`${dashboardUrl}/layers/${data.id}/attrs`)}>
          <ListAlt sx={{ marginRight: 1 }} /> {t('attrs.title', { name: '' })}
        </MenuItem>
        <MenuItem onClick={() => navigate(`${dashboardUrl}/layers/${data.id}/edit`)}>
          <EditOutlined sx={{ marginRight: 1 }} /> {t('editProperties', { name: '' })}
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

      {accessDialogOpen && (
        <EntityPermissionDialog
          open
          onClose={() => setAccessDialogOpen(false)}
          entityId={data.id}
          title={t(`access.${EntityType.LAYER}`, { name: data[nameProp] ? `"${data[nameProp]}"` : '' })}
          entityType={EntityType.LAYER}
          onSubmit={entitiesMutation.mutate}
          isLoading={entitiesMutation.isPending}
        />
      )}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('deleteConfirm')}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={deleteMutation.mutate}
        isLoading={deleteMutation.isPending}
      >
        {t('deleteConfirmDescription')}
      </ConfirmDialog>
    </Box>
  );
};