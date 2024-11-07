import { Box, Button, CardHeader, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useMuiLocalization } from '../../../hooks/useMuiLocalization';
import { layersAPI } from '../../../api/layer';
import { LayerDto } from '../../../api/types/mapFolders';
import CustomNoRowsOverlay from '../../common/NoRows/DataGrid';
import { LayerActionsMenu } from './ActionsMenu';
import { dashboardUrl } from '../routes';

export const Layers: FC = () => {
  const { dataGridLocale } = useMuiLocalization();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['layers', pagination],
    queryFn: () => layersAPI.getLayers({ page: pagination.page, size: pagination.pageSize }).then((res) => res.data),
  });

  const layers = data?.content || [];
  const columns: GridColDef<LayerDto>[] = [
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        return (
          <Link
            to={`${dashboardUrl}/layers/${params.row.id}/edit`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <Box display={'flex'} alignItems="center" gap={1.5}>
              <Box my={1}>
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
      field: 'geometryType',
      headerName: t('maps.geometryType'),
      minWidth: 140,
    },
    {
      field: 'layerType',
      headerName: t('maps.layerType'),
      minWidth: 120,
    },
    {
      field: 'isPublic',
      headerName: t('maps.isPublic'),
      valueFormatter: (value) => (value ? t('yes') : t('no')),
      minWidth: 100,
    },
    {
      field: 'actions',
      headerName: t('actions'),
      renderCell: (params) => {
        return <LayerActionsMenu data={params.row} onRefresh={() => refetch()} />;
      },
      align: 'center',
    },
  ];

  return (
    <>
      <CardHeader title={t('layers')} sx={{ textAlign: 'center' }} />
      <Box>
        <DataGrid
          rows={layers}
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
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <GridToolbarContainer>
                <Link to={`${dashboardUrl}/layers/add`}>
                  <Button color="primary" startIcon={<AddIcon />}>
                    {t('create')}
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
