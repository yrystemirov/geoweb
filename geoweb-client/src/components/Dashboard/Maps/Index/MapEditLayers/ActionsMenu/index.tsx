import { FC, MouseEvent, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { t } from 'i18next';

type Props = {
  onAdd?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onAddLayer?: () => void;
  onEditLayer?: () => void;
  onRemoveLayerFromFolder?: () => void;
  onRemoveLayerFromAllFolders?: () => void;
  onDeleteLayer?: () => void;
  onEditPermissions?: () => void;
  onOpenLayerAttrs?: () => void;
};

export const MapEditLayersActionsMenu: FC<Props> = ({
  onAdd,
  onDelete,
  onEdit,
  onAddLayer,
  onEditLayer,
  onRemoveLayerFromFolder,
  onRemoveLayerFromAllFolders,
  onDeleteLayer,
  onEditPermissions,
  onOpenLayerAttrs,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  return (
    <div>
      <IconButton onClick={(e) => handleClick(e)}>
        <MoreVert sx={{ fontSize: 20 }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose} closeAfterTransition>
        {onEditPermissions && (
          <MenuItem
            onClick={() => {
              onEditPermissions();
              handleClose();
            }}
          >
            {t('editPermissions')}
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem
            onClick={() => {
              onEdit();
              handleClose();
            }}
          >
            {t('edit')}
          </MenuItem>
        )}
        {onEditLayer && <MenuItem onClick={() => onEditLayer()}>{t('edit')}</MenuItem>}
        {onAdd && (
          <MenuItem
            onClick={() => {
              onAdd();
              handleClose();
            }}
          >
            {t('maps.addFolder')}
          </MenuItem>
        )}
        {onAddLayer && (
          <MenuItem
            onClick={() => {
              onAddLayer();
              handleClose();
            }}
          >
            {t('maps.addLayer')}
          </MenuItem>
        )}
        {onOpenLayerAttrs && <MenuItem onClick={() => onOpenLayerAttrs()}>{t('attrs.title', { name: '' })}</MenuItem>}
        {onDelete && (
          <MenuItem
            onClick={() => {
              onDelete();
              handleClose();
            }}
          >
            {t('delete')}
          </MenuItem>
        )}
        {onRemoveLayerFromFolder && (
          <MenuItem onClick={() => onRemoveLayerFromFolder()}>
            {t('maps.removeLayerFromFolder', { folder: '' })}
          </MenuItem>
        )}
        {onRemoveLayerFromAllFolders && (
          <MenuItem onClick={() => onRemoveLayerFromAllFolders()}>{t('maps.removeLayerFromAllFolders')}</MenuItem>
        )}
        {onDeleteLayer && <MenuItem onClick={() => onDeleteLayer()}>{t('maps.deleteLayer')}</MenuItem>}
      </Menu>
    </div>
  );
};