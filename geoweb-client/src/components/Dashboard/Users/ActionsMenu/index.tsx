import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { DeleteOutline, EditOutlined, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserDto } from '../../../../api/types/user';
import { userAPI } from '../../../../api/user';
import ConfirmDialog from '../../../common/Confirm';

type Props = {
  data: UserDto;
  onRefresh: () => void;
};

export const UserActionsMenu: FC<Props> = ({ data, onRefresh }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onSuccess = () => {
    onRefresh();
    handleClose();
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
    mutationFn: () => userAPI.deleteUser(data.id).then((res) => res.data),
    onSuccess,
  });

  return (
    <Box>
      <IconButton
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls={anchorEl ? 'user-menu' : undefined}
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
        <MenuItem onClick={() => navigate(`/dashboard/users/${data.id}/edit`)}>
          <EditOutlined sx={{ marginRight: 1 }} /> {t('editProperties', { name: '' })}
        </MenuItem>

        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          handleClose();
        }}>
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
