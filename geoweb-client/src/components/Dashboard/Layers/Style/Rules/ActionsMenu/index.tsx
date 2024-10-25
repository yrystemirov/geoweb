import { FC, MouseEvent, useState } from 'react';
import { StyleRule } from '../../../../../../api/types/style';
import { useTranslation } from 'react-i18next';
import { Box, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import {
  DeleteOutline,
  EditOutlined,
  FilterList,
  FilterListOff,
  MoreVert,
  RestoreFromTrash,
} from '@mui/icons-material';

type Props = {
  rule: StyleRule.Dto;
  onCancelDeletion: (rule: StyleRule.Dto) => void;
  onDelete: (rule: StyleRule.Dto) => void;
  onEdit: (rule: StyleRule.Dto) => void;
  onAddFilter: () => void;
  onDeleteFilter: () => void;
  onEditFilter: () => void;
};

export const RuleActionsMenu: FC<Props> = ({
  rule,
  onCancelDeletion,
  onDelete,
  onEdit,
  onAddFilter,
  onDeleteFilter,
  onEditFilter,
}) => {
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

  const iconSx = { marginRight: 1, color: 'action.active' };

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
        {rule.isDeleted ? (
          <MenuItem onClick={() => onCancelDeletion(rule)}>
            <RestoreFromTrash sx={iconSx} />
            {t('cancelDeletion')}
          </MenuItem>
        ) : (
          <>
            <MenuItem onClick={() => onEdit(rule)}>
              <EditOutlined sx={iconSx} /> {t('edit')}
            </MenuItem>
            <MenuItem onClick={() => onDelete(rule)}>
              <DeleteOutline sx={iconSx} />
              {t('delete')}
            </MenuItem>
            <Divider />
            {!!rule.filter && (
              <MenuItem onClick={() => onEditFilter()}>
                <FilterList sx={iconSx} />
                {t('styleRules.editFilter')}
              </MenuItem>
            )}
            {!!rule.filter && (
              <MenuItem onClick={() => onDeleteFilter()}>
                <FilterListOff sx={iconSx} />
                {t('styleRules.deleteFilter')}
              </MenuItem>
            )}
            {!rule.filter && (
              <MenuItem onClick={() => onAddFilter()}>
                <FilterList sx={iconSx} />
                {t('styleRules.addFilter')}
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </Box>
  );
};