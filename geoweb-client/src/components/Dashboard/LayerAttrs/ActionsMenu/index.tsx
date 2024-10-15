import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { DeleteOutline, EditOutlined, MoreVert } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { useNotify } from '../../../../hooks/useNotify';
import { layersAPI } from '../../../../api/layer';
import { LayerAttrDto } from '../../../../api/types/mapFolders';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../../common/Confirm';

type Props = {
  data: LayerAttrDto;
  onRefresh: () => void;
};

export const LayerAttrActionsMenu: FC<Props> = ({ data, onRefresh }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotify();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const onSuccess = () => {
    showSuccess();
    onRefresh();
    handleClose();
    setDeleteDialogOpen(false);
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
    mutationFn: () => layersAPI.deleteLayerAttr(data.id!),
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
        aria-controls={anchorEl ? 'layer-attr-menu' : undefined}
        aria-expanded={!!anchorEl}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="layer-attr-menu"
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
            navigate(`/dashboard/layers/${data.layer!.id}/attrs/${data.id}/edit`);
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
    </Box>
  );
};
