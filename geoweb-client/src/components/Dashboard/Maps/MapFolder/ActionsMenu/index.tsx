import { FC, MouseEvent, useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { t } from 'i18next';

type Props = {
  onAdd: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

export const MapFolderActionsMenu: FC<Props> = ({ onAdd, onDelete, onEdit }) => {
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
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose} closeAfterTransition>
        <MenuItem onClick={() => onAdd()}>{t('maps.addFolder')}</MenuItem>
        <MenuItem onClick={() => onEdit()}>{t('edit')}</MenuItem>
        <MenuItem onClick={() => onDelete()}>{t('delete')}</MenuItem>
      </Menu>
    </div>
  );
};