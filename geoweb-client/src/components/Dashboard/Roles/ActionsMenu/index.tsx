import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { DeleteOutline, EditOutlined, MoreVert } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import ConfirmDialog from '../../../common/Confirm';
import { roleAPI } from '../../../../api/roles';
import { RoleDto } from '../../../../api/types/role';
import { RoleForm } from '../Form';
import { Dialog } from '../../../common/Dialog';
import { useNotify } from '../../../../hooks/useNotify';

type Props = {
  data: RoleDto;
  onRefresh: () => void;
};

export const RoleActionsMenu: FC<Props> = ({ data, onRefresh }) => {
  const { showSuccess, showError } = useNotify();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const onSuccess = () => {
    showSuccess();
    onRefresh();
    handleClose();
    setDeleteDialogOpen(false);
    setEditDialogOpen(false);
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
    mutationFn: () => roleAPI.deleteRole(data.id),
    onSuccess,
    onError: (error) => {
      showError({ error });
    },
  });

  return (
    <Box>
      <IconButton
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls={anchorEl ? 'role-menu' : undefined}
        aria-expanded={!!anchorEl}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="role-menu"
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
            setEditDialogOpen(true);
            handleClose();
          }}
        >
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

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('deleteConfirm')}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={deleteMutation.mutate}
        isLoading={deleteMutation.isPending}
      >
        {t('deleteConfirmDescription')}
      </ConfirmDialog>
      <Dialog open={editDialogOpen} onClose={handleClose} title={t('editProperties', { name: `"${data.name}"` })}>
        <RoleForm editData={data} onSuccess={onSuccess} onCancel={() => setEditDialogOpen(false)} />
      </Dialog>
    </Box>
  );
};
