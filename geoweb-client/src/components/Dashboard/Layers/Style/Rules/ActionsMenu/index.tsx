import { FC, MouseEvent, useState } from 'react';
import { StyleRule } from '../../../../../../api/types/style';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

type Props = {
  rule: StyleRule.Dto;
  onEdit: (rule: StyleRule.Dto) => void;
  onDelete: (rule: StyleRule.Dto) => void;
  onCancelDeletion: (rule: StyleRule.Dto) => void;
};

export const RuleActionsMenu: FC<Props> = ({ rule, onEdit, onDelete, onCancelDeletion }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <Box>
      <IconButton
        aria-haspopup="true"
        onClick={handleClick}
        aria-controls={anchorEl ? 'rule-menu' : undefined}
        aria-expanded={!!anchorEl}
      >
        <MoreVert />
      </IconButton>
      <Menu id="rule-menu" anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
        {!rule.isDeleted && <MenuItem onClick={() => onEdit(rule)}>{t('edit')}</MenuItem>}
        {!rule.isDeleted && <MenuItem onClick={() => onDelete(rule)}>{t('delete')}</MenuItem>}
        {!!rule.isDeleted && <MenuItem onClick={() => onCancelDeletion(rule)}>{t('cancelDeletion')}</MenuItem>}
      </Menu>
    </Box>
  );
};