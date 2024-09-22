import { FC, useState } from 'react';
import { FolderDto } from '../../../../api/types/mapFolders';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountTreeOutlined, DeleteOutline, EditOutlined, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../common/confirm';
import { useMutation } from '@tanstack/react-query';
import { mapFoldersAPI } from '../../../../api/mapFolders';

type Props = {
  data: FolderDto;
  onRefresh: () => void;
};

export const MapFolderActionsMenu: FC<Props> = ({ data, onRefresh }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSuccess = () => {
    onRefresh();
    handleClose();
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

  return (
    <Box>
      <IconButton
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls={anchorEl ? 'disk-menu' : undefined}
        aria-expanded={!!anchorEl}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="map-folder-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => navigate(`/dashboard/maps/${data.id}/edit`)}>
          <EditOutlined sx={{ marginRight: 1 }} /> {t('editProperties')}
        </MenuItem>

        <MenuItem onClick={() => navigate(`/dashboard/maps/${data.id}/edit-layers`)}>
          <AccountTreeOutlined sx={{ marginRight: 1 }} /> {t('maps.editStructure')}
        </MenuItem>

        <MenuItem onClick={() => setDeleteDialogOpen(true)}>
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
    </Box>
  );
};
