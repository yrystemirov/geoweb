import { FC, useState } from 'react';
import { StyleFilterDto, StyleRequestDto, StyleRule } from '../../../../../../api/types/style';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../../../../../common/NoRows/DataGrid';
import { Add } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RuleActionsMenu } from '../ActionsMenu';
import { uuidv4 } from '../../../../../../utils/uidv4';
import { useFormContext } from 'react-hook-form';
import { FilterDialog } from '../FilterDIalog';
import { useTranslatedProp } from '../../../../../../hooks/useTranslatedProp';

type Props = {
  rules?: StyleRule.Dto[];
  onAdd: () => void;
  onEdit: (rule: StyleRule.Dto) => void;
  onDelete: (rule: StyleRule.Dto) => void;
  onCancelDeletion: (rule: StyleRule.Dto) => void;
};

export const RulesTable: FC<Props> = ({ rules = [], onAdd, onEdit, onDelete, onCancelDeletion }) => {
  const nameProp = useTranslatedProp('name');
  const [filterDialog, setFilterDialog] = useState<{ open: boolean; rule: StyleRule.Dto }>();
  const methods = useFormContext<StyleRequestDto>();
  const { t } = useTranslation();
  const columns: GridColDef<StyleRule.Dto>[] = [
    { field: 'name', headerName: t('styleRules.name'), width: 150, flex: 1 },
    { field: 'scaleMin', headerName: t('styleRules.scaleMin'), width: 150 },
    { field: 'scaleMax', headerName: t('styleRules.scaleMax'), width: 150 },
    {
      field: 'filter',
      headerName: t('styleRules.filter'),
      width: 150,
      flex: 1,
      valueFormatter: (value: StyleFilterDto) =>
        value ? `[${value.column[nameProp]}] ${value.operator} "${value.value}"` : '',
    },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      renderCell: (params) => (
        <RuleActionsMenu
          rule={params.row}
          onEdit={onEdit}
          onDelete={onDelete}
          onCancelDeletion={onCancelDeletion}
          onEditFilter={() => setFilterDialog({ open: true, rule: params.row })}
          onDeleteFilter={() =>
            methods.setValue(
              'rules',
              rules.map((rule) => (rule?.id === params.row.id ? { ...rule, filter: null } : rule)),
            )
          }
          onAddFilter={() => setFilterDialog({ open: true, rule: params.row })}
        />
      ),
    },
  ];
  return (
    <>
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
        disableRowSelectionOnClick
        rowSelection={false}
        getRowId={uuidv4}
        getRowClassName={(params) => (params.row.isDeleted ? 'deleted-row' : '')}
      />
      <FilterDialog
        open={filterDialog?.open}
        rule={filterDialog?.rule}
        onClose={() => setFilterDialog(undefined)}
        onSubmit={(filter: StyleFilterDto) => {
          methods.setValue(
            'rules',
            rules.map((rule) => (rule?.id === filterDialog?.rule?.id ? { ...rule, filter } : rule)),
          );
          setFilterDialog(undefined);
        }}
      />
    </>
  );
};