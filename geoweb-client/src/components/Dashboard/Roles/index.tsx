import { Box, Button, CardHeader } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { useMuiLocalization } from '../../../hooks/useMuiLocalization';
import CustomNoRowsOverlay from '../../common/NoRows/DataGrid';
import { roleAPI } from '../../../api/roles';
import { RoleDto } from '../../../api/types/role';
import { RoleActionsMenu } from './ActionsMenu';
import { Dialog } from '../../common/Dialog';
import { RoleForm } from './Form';

export const Roles: FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { dataGridLocale } = useMuiLocalization();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['roles', pagination],
    queryFn: () => roleAPI.getRoles({ page: pagination.page, size: pagination.pageSize }).then((res) => res.data),
  });

  const columns: GridColDef<RoleDto>[] = [
    { field: 'name', headerName: t('roles.name'), flex: 1, minWidth: 300 },
    { field: 'code', headerName: t('roles.code'), flex: 1, minWidth: 150 },
    { field: 'description', headerName: t('roles.description'), flex: 1, minWidth: 200 },
    { field: 'id', headerName: 'ID' },
    {
      field: 'actions',
      headerName: t('actions'),
      renderCell: (params) => {
        return <RoleActionsMenu data={params.row} onRefresh={() => refetch()} />;
      },
      align: 'center',
    },
  ];

  return (
    <>
      <CardHeader title={t('roles.title')} sx={{ textAlign: 'center' }} />
      <Box>
        <DataGrid<RoleDto>
          rows={data?.content || []}
          rowCount={data?.totalElements || 0}
          columns={columns}
          localeText={dataGridLocale}
          loading={isLoading}
          paginationModel={pagination}
          onPaginationModelChange={(newPagination) => setPagination(newPagination)}
          paginationMode="server"
          rowSelection={false}
          disableColumnMenu
          disableColumnSorting
          slots={{
            noRowsOverlay: () => <CustomNoRowsOverlay />,
            toolbar: () => (
              <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
                  {t('create')}
                </Button>
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
        />
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} title={t('roles.create')}>
          <RoleForm
            onSuccess={() => {
              refetch();
              setCreateDialogOpen(false);
            }}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </Dialog>
      </Box>
    </>
  );
};
