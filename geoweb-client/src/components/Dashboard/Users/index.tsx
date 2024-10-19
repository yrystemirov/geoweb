import { Box, Button, CardHeader, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useMuiLocalization } from '../../../hooks/useMuiLocalization';
import { userAPI } from '../../../api/user';
import { UserDto } from '../../../api/types/user';
import CustomNoRowsOverlay from '../../common/NoRows/DataGrid';
import { UserActionsMenu } from './ActionsMenu';

export const Users: FC = () => {
  const { dataGridLocale } = useMuiLocalization();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', pagination],
    queryFn: () => userAPI.getUsers({ page: pagination.page, size: pagination.pageSize }).then((res) => res.data),
  });

  const columns: GridColDef<UserDto>[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'username',
      headerName: t('users.username'),
      flex: 1,
      renderCell: (params) => {
        return (
          <Link
            to={`/dashboard/users/${params.row.id}/edit`}
            style={{ color: 'inherit', textDecoration: 'none', display: 'flex', height: '100%', alignItems: 'center' }}
          >
            <Box display={'flex'} alignItems="center" gap={1.5}>
              <PersonIcon color="primary" />
              <Typography color="primary">{params.row.username}</Typography>
            </Box>
          </Link>
        );
      },
    },
    { field: 'email', headerName: t('users.email'), flex: 1 },
    { field: 'name', headerName: t('users.name'), flex: 1 },
    { field: 'phoneNumber', headerName: t('users.phoneNumber'), flex: 1 },
    {
      field: 'blocked',
      headerName: t('users.blocked'),
      valueFormatter: (value) => (value ? t('yes') : t('no')),
    },
    {
      field: 'actions',
      headerName: t('actions'),
      renderCell: (params) => {
        return <UserActionsMenu data={params.row} onRefresh={() => refetch()} />;
      },
      align: 'center',
    },
  ];

  return (
    <>
      <CardHeader title={t('users.title')} sx={{ textAlign: 'center' }} />
      <Box>
        <DataGrid
          rows={data?.content}
          rowCount={data?.totalElements || 0}
          columns={columns}
          localeText={dataGridLocale}
          loading={isLoading}
          paginationModel={pagination}
          onPaginationModelChange={(newPagination) => setPagination(newPagination)}
          rowSelection={false}
          disableColumnMenu
          disableColumnSorting
          columnVisibilityModel={{
            id: false,
          }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <GridToolbarContainer>
                <Link to="/dashboard/users/add">
                  <Button color="primary" startIcon={<AddIcon />}>
                    {t('add')}
                  </Button>
                </Link>
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
      </Box>
    </>
  );
};
