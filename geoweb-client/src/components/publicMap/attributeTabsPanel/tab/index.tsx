import { useState, useMemo, useEffect } from 'react';
import { Paper } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { usePublicMapStore } from '../../../../hooks/usePublicMapStore';
import { mapOpenAPI } from '../../../../api/openApi';
import { useQuery } from '@tanstack/react-query';
import { convertWktToGeometry, fitExtentToGeometryWithAnimation } from '../../../../utils/openlayers/utils';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import OpenlayersBaseLayersUtils from '../../../../utils/openlayers/OpenlayersBaseLayersUtils';
import CustomNoRowsOverlay from '../../../common/NoRows/DataGrid';
import { useMuiLocalization } from '../../../../hooks/useMuiLocalization';
import { useTranslatedProp } from '../../../../hooks/useTranslatedProp';

export const AttributeTableTab = (props: any) => {
  const nameProp = useTranslatedProp('name');
  const { map } = usePublicMapStore();
  const { dataGridLocale } = useMuiLocalization();
  const { layer } = props;

  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [search, setSearch] = useState('');

  const { data: attrs, isLoading: isAttrsLoading } = useQuery({
    queryKey: ['layerAttributes', layer.id],
    queryFn: () => mapOpenAPI.getOpenApiLayerAttribtes(layer.id).then((res) => res.data),
    enabled: !!layer.id,
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: features,
    isFetching: isFeaturesFetching,
    isLoading: isFeaturesLoading,
    refetch,
  } = useQuery({
    queryKey: ['layerFeatures', layer.layername],
    queryFn: () =>
      mapOpenAPI.getOpenApiLayerFeatures(layer.layername, pagination.page, pagination.pageSize).then((res) => res.data),
    enabled: !!layer.layername,
  });

  useEffect(() => {
    if (pagination.page === 0 && isFeaturesLoading) {
      // skip first fetch
      return;
    }
    refetch();
  }, [pagination, refetch]);

  const columns = useMemo(
    () =>
      attrs?.map(
        (attr) =>
          ({
            field: attr.attrname,
            headerName: attr[nameProp],
            width: 150,
          }) as GridColDef,
      ) || [],
    [attrs, nameProp],
  );

  // const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setSearch(event.target.value);
  //   setPagination({ ...pagination, page: 0 });
  //   refetch();
  // };

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPagination(model);
  };

  const zoomToObject = (item: any) => {
    const attrTableVectorName = 'attributePanelVectorLayer';
    let layerExists =
      map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == attrTableVectorName;
        }).length > 0;
    let vector = new VectorLayer();
    if (layerExists) {
      vector = map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == attrTableVectorName;
        })[0] as VectorLayer<VectorSource>;
    } else {
      vector = OpenlayersBaseLayersUtils.getDefaultVectorLayer(true, attrTableVectorName);
      map?.addLayer(vector);
      map?.updateSize();
    }
    const geom = convertWktToGeometry(item.geom);
    fitExtentToGeometryWithAnimation({ map: map!, geometry: geom, maxZoom: map?.getView().getZoom() });
    const feature = new Feature({
      geometry: geom,
    });
    vector.setVisible(true);
    vector.getSource()?.addFeature(feature);
    setTimeout(() => {
      vector.getSource()?.removeFeature(feature);
    }, 2000);
  };

  const handleRowDoubleClick = (params: any) => {
    zoomToObject(params.row);
  };

  return (
    <Paper sx={{ width: '100%', height: '200px', overflow: 'auto', zIndex: 500000 }}>
      {/* TODO: use search */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}> <TextField label="Поиск" variant="outlined" size="small" value={search} onChange={handleSearchChange} /> </Box> */}
      <DataGrid
        rows={features?.content || []}
        columns={columns}
        localeText={dataGridLocale}
        pageSizeOptions={[25, 50, 100]}
        pagination
        paginationMode="server"
        rowCount={features?.totalElements || 0}
        onPaginationModelChange={handlePaginationChange}
        paginationModel={pagination}
        loading={isAttrsLoading || isFeaturesFetching}
        onRowDoubleClick={handleRowDoubleClick}
        autoHeight
        getRowId={(row) => row.gid}
        rowSelection={false}
        disableColumnMenu
        disableColumnSorting
        columnVisibilityModel={{
          gid: false,
        }}
        slots={{
          noRowsOverlay: () => <CustomNoRowsOverlay />,
        }}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'linear-progress',
          },
        }}
        sx={{ minHeight: 200 }}
      />
    </Paper>
  );
};
