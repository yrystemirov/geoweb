import { FC } from 'react';
import { StyleRule } from '../../../../../../api/types/style';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../../../../../common/NoRows/DataGrid';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { uuidv4 } from '../../../../../../utils/uidv4';

type Props = {
  rules?: StyleRule.Dto[];
  onAddRule: () => void;
  onEditRule: (rule: StyleRule.Dto) => void;
};

export const RulesTable: FC<Props> = ({ rules = [], onAddRule, onEditRule }) => {
  const { t } = useTranslation();
  const columns: GridColDef<StyleRule.Dto>[] = [
    { field: 'name', headerName: t('rulesTable.name'), width: 150 },
    { field: 'scaleMin', headerName: 'Min Scale', width: 150 },
    { field: 'scaleMax', headerName: 'Max Scale', width: 150 },
    { field: 'filter', headerName: 'Filter', width: 150 },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      renderCell: (params) => <Button onClick={() => onEditRule(params.row)}>Edit</Button>,
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
            <Button color="primary" startIcon={<Add />} onClick={onAddRule}>
              {t('create')}
            </Button>
            <Typography variant="body2" color="textSecondary" flex={1} sx={{ textAlign: 'center' }}>
              {t('rulesTable.title')}
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
      sx={{ minHeight: 200 }}
      hideFooter
      disableColumnMenu
      getRowId={uuidv4}
    />
  );
};