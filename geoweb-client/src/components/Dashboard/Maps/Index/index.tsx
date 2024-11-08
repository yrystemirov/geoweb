import { Box, Button, CardHeader, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mapFoldersAPI } from '../../../../api/mapFolders';
import { FolderDto } from '../../../../api/types/mapFolders';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useMuiLocalization } from '../../../../hooks/useMuiLocalization';
import CustomNoRowsOverlay from '../../../common/NoRows/DataGrid';
import { MapActionsMenu } from './ActionsMenu';
import { dashboardUrl } from '../../routes';

export const MapFolders: FC = () => {
  const { dataGridLocale } = useMuiLocalization();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['maps'],
    queryFn: () => mapFoldersAPI.getRootFolders().then((res) => res.data),
  });
  const columns: GridColDef<FolderDto>[] = [
    { field: 'rank', headerName: '№' },
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      renderCell: (params) => {
        return (
          <Link to={`${dashboardUrl}/maps/${params.row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Box display={'flex'} alignItems="center" gap={2} my={1}>
              <MapIcon color="primary" />
              <Box>
                <Typography variant="body2" color="primary" className="empty-placeholder" title={t('nameKk')}>
                  {params.row.nameKk}
                </Typography>
                <Typography variant="body2" color="primary" className="empty-placeholder" title={t('nameRu')}>
                  {params.row.nameRu}
                </Typography>
                <Typography variant="body2" color="primary" className="empty-placeholder" title={t('nameEn')}>
                  {params.row.nameEn}
                </Typography>
              </Box>
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'isPublic',
      headerName: t('maps.isPublic'),
      valueFormatter: (value) => (value ? t('yes') : t('no')),
    },
    {
      field: 'actions',
      headerName: t('actions'),
      renderCell: (params) => {
        return <MapActionsMenu data={params.row} onRefresh={() => refetch()} />;
      },
      align: 'center',
    },
  ];

  return (
    <>
      <CardHeader title={t('maps.title')} sx={{ textAlign: 'center' }} />
      <Box>
        <DataGrid
          rows={data}
          columns={columns}
          localeText={dataGridLocale}
          loading={isLoading}
          paginationModel={pagination}
          onPaginationModelChange={(newPagination) => setPagination(newPagination)}
          rowSelection={false}
          disableColumnMenu
          disableColumnSorting
          slots={{
            noRowsOverlay: () => <CustomNoRowsOverlay />,
            toolbar: () => (
              <GridToolbarContainer>
                <Link to={`${dashboardUrl}/maps/add`}>
                  <Button color="primary" startIcon={<AddIcon />}>
                    {t('maps.addMap')}
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
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
            minHeight: 200,
          }}
        />
      </Box>
    </>
  );
};