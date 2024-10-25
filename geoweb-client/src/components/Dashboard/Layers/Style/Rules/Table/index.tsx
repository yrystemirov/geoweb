import { FC } from 'react';
import { StyleRule } from '../../../../../../api/types/style';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../../../../../common/NoRows/DataGrid';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RuleActionsMenu } from '../ActionsMenu';
import { uuidv4 } from '../../../../../../utils/uidv4';

type Props = {
  rules?: StyleRule.Dto[];
  onAdd: () => void;
  onEdit: (rule: StyleRule.Dto) => void;
  onDelete: (rule: StyleRule.Dto) => void;
  onCancelDeletion: (rule: StyleRule.Dto) => void;
};

export const RulesTable: FC<Props> = ({ rules = [], onAdd, onEdit, onDelete, onCancelDeletion }) => {
  const { t } = useTranslation();
  const columns: GridColDef<StyleRule.Dto>[] = [
    { field: 'name', headerName: t('styleRules.name'), width: 150 },
    { field: 'scaleMin', headerName: 'Min Scale', width: 150 },
    { field: 'scaleMax', headerName: 'Max Scale', width: 150 },
    { field: 'filter', headerName: 'Filter', width: 150 },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      renderCell: (params) => (
        <RuleActionsMenu rule={params.row} onEdit={onEdit} onDelete={onDelete} onCancelDeletion={onCancelDeletion} />
      ),
    },
  ];
  return (
    <DataGrid
      rows={rules}
      columns={columns}
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
        toolbar: () => (
          <GridToolbarContainer>
            <Button color="primary" startIcon={<Add />} onClick={onAdd}>
              {t('create')}
            </Button>
            <Typography variant="body2" color="textSecondary" flex={1} sx={{ textAlign: 'center' }}>
              {t('styleRules.title')}
            </Typography>
          </GridToolbarContainer>
        ),
      }}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'linear-progress',
        },
      }}
      sx={{
        minHeight: 200,
        '& .deleted-row': { backgroundColor: 'rgba(255, 0, 0, 0.2)', textDecoration: 'line-through', color: 'grey' },
      }}
      hideFooter
      disableColumnMenu
      getRowId={uuidv4}
      getRowClassName={(params) => (params.row.isDeleted ? 'deleted-row' : '')}
    />
  );
};