import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { layersAPI } from '../../../api/layer';
import { LayerAttrDto } from '../../../api/types/mapFolders';
import { DataGrid, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Box, Button, CardHeader, Typography } from '@mui/material';
import { useMuiLocalization } from '../../../hooks/useMuiLocalization';
import { useTranslatedProp } from '../../../hooks/useTranslatedProp';
import AddIcon from '@mui/icons-material/Add';
import CustomNoRowsOverlay from '../../common/NoRows/DataGrid';

export const LayerAttrs: FC = () => {
  const { dataGridLocale } = useMuiLocalization();
  const { t } = useTranslation();
  const { layerId } = useParams();
  const nameProp = useTranslatedProp('name');

  const { data: attrs = [], isLoading } = useQuery({
    queryKey: ['layerAttrs', layerId],
    queryFn: () => layersAPI.getLayerAttrs(layerId!).then((res) => res.data),
    enabled: !!layerId,
  });

  const layer = attrs[0]?.layer;
  const layerName = layer?.[nameProp] ? `"${layer?.[nameProp]}"` : '';
  const columns: GridColDef<LayerAttrDto>[] = [
    { field: 'rank', headerName: '№', width: 50 },
    {
      sortable: false,
      field: 'name',
      headerName: t('name'),
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        return (
          <Link to={`/dashboard/layerAttrs/${params.row.id}/edit`} style={{ color: 'inherit', textDecoration: 'none' }}>
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
      field: 'attrname',
      headerName: t('attrs.attrname'),
      minWidth: 140,
      flex: 1,
    },
    {
      field: 'attrType',
      headerName: t('attrs.attrType'),
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'shortInfo',
      headerName: t('attrs.shortInfo'),
      minWidth: 100,
      flex: 1,
      valueFormatter: (value) => (value ? t('yes') : t('no')),
    },
    {
      field: 'fullInfo',
      headerName: t('attrs.fullInfo'),
      minWidth: 100,
      flex: 1,
      valueFormatter: (value) => (value ? t('yes') : t('no')),
    },
  ];

  return (
    <>
      <CardHeader title={t('attrs.title', { name: layerName })} sx={{ textAlign: 'center' }} />
      <Box>
      <DataGrid
        disableColumnMenu
        hideFooterPagination
        hideFooter
        rows={attrs}
        rowCount={attrs.length}
        columns={columns}
        localeText={dataGridLocale}
        loading={isLoading}
        rowSelection={false}
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          minHeight: 200,
        }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: () => (
            <GridToolbarContainer>
              <Link to={`/dashboard/layers/${layerId}/attrs/add`}>
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
      />
      </Box>
    </>
  );
};