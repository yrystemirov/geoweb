import { Box, Button, CardHeader, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer } from '@mui/x-data-grid';
import { useQuery} from '@tanstack/react-query';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mapFoldersAPI } from '../../../api/mapFolders';
import { FolderDto } from '../../../api/types/mapFolders';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useMuiLocalization } from '../../../hooks/useMuiLocalization';
import CustomNoRowsOverlay from '../../common/nodata/DataGrid';
import { MapFolderActionsMenu } from './ActionMenu';

export const MapFolders: FC = () => {
  const { dataGridLocale } = useMuiLocalization();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const { data = [], isLoading, refetch } = useQuery({
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
          <Link to={`/dashboard/maps/${params.row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Box display={'flex'} alignItems="center" gap={1.5}>
              <MapIcon color="primary" />
              <Box>
                <Typography color="primary">{params.row.nameKk}</Typography>
                <Typography color="primary">{params.row.nameRu}</Typography>
              </Box>
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'isPublic',
      headerName: t('maps.isPublic'),
      valueFormatter: (value) => {
        console.log(value);
        
        return value ? t('yes') : t('no');
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      renderCell: (params) => {
        return (
          <MapFolderActionsMenu data={params.row} onRefresh={() => refetch()} />
        );
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
          rowCount={data.length}
          columns={columns}
          localeText={dataGridLocale}
          loading={isLoading}
          paginationModel={pagination}
          onPaginationModelChange={(newPagination) => setPagination(newPagination)}
          rowSelection={false}
          disableColumnMenu
          disableColumnSorting
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: () => <LinearProgress />,
            toolbar: () => (
              <GridToolbarContainer>
                <Link to="/dashboard/maps/add">
                  <Button color="primary" startIcon={<AddIcon />}>
                    {t('maps.addMap')}
                  </Button>
                </Link>
              </GridToolbarContainer>
            ),
          }}
        />
      </Box>
    </>
  );
};