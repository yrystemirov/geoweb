import { FC, MouseEvent, useEffect, useState } from 'react';
import { Badge, Box, IconButton, Menu, MenuItem, Slider } from '@mui/material';
import { FilterAlt, MoreVert } from '@mui/icons-material';
import { t } from 'i18next';
import { LayerDto, LayerType } from '../../../../api/types/mapFolders';
import { usePublicMapStore } from '../../../../hooks/usePublicMapStore';
import { useMutation } from '@tanstack/react-query';
import { mapOpenAPI } from '../../../../api/openApi';
import { convertWktToGeometry, fitExtentToGeometryWithAnimation } from '../../../../utils/openlayers/utils';
import { useNotify } from '../../../../hooks/useNotify';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { CqlFilterDialog } from './CqlFilterDialog';

type Props = {
  layer: LayerDto;
  onLegendClick?: () => void;
  isLegendVisible?: boolean;
};

// функции:
// - открытие атрибутивной таблицы ✅
// - управление прозрачностью слоя ✅
// - фильтрация слоя (диалоговое окно) ⏳
// - отображение легенды ✅
// - приближение к слою ✅
export const LayerActionsMenu: FC<Props> = ({ isLegendVisible = false, layer, onLegendClick }) => {
  const { showError } = useNotify();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { map, userLayers, attributeTables, setAttributeTables, setCurrentAttributeTable } = usePublicMapStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opacity, setOpacity] = useState<number>(1);
  const [isOpacityOpen, setIsOpacityOpen] = useState(false);
  const [filterDialogState, setFilterDialogState] = useState(false);

  const getAndZoomExtentMutation = useMutation({
    mutationFn: () => mapOpenAPI.getExtentByLayerId(layer.id).then((res) => res.data.extent),
    onSuccess: (data) => {
      try {
        const geometry = convertWktToGeometry(data);
        fitExtentToGeometryWithAnimation({ map: map!, geometry, padding: 10 });
      } catch (error) {
        showError({ error });
      }
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
    setTimeout(() => {
      setIsOpacityOpen(false);
    }, 300); // чтобы не мигало
  };

  const handleAttrTable = () => {
    if (attributeTables.length === 0 || !attributeTables.some((at) => at.id === layer.id)) {
      attributeTables.push(layer);
      setAttributeTables(attributeTables);
    }
    setCurrentAttributeTable(layer);
    handleClose();
  };

  const handleOpacity = () => {
    setIsOpacityOpen(true);
  };

  const handleZoomToLayer = () => {
    getAndZoomExtentMutation.mutate();
    handleClose();
  };

  const tileLayer = userLayers.find((l) => l.getProperties().systemLayerProps.id === layer.id) as TileLayer<TileWMS>;
  const isSimpleLayer = layer.layerType === LayerType.SIMPLE;
  const isVisible = tileLayer?.getVisible();
  const isAttrTableOpen = attributeTables.some((at) => at.id === layer.id);
  const cqlFilterIsActivated = !!tileLayer?.getSource()?.getParams().CQL_FILTER;

  useEffect(() => {
    userLayers.forEach((l) => {
      if (l.getProperties().systemLayerProps.id === layer.id) {
        l.setOpacity(opacity);
        return;
      }
    });
  }, [opacity]);

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <Badge
          badgeContent={<FilterAlt sx={{ fontSize: 12 }} />}
          color="primary"
          invisible={!cqlFilterIsActivated}
          sx={{ p: 0 }}
        >
          <MoreVert sx={{ fontSize: 20 }} />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose} closeAfterTransition sx={{ zIndex: 5001 }}>
        {tileLayer && (
          <MenuItem
            hidden={isOpacityOpen}
            onClick={() => {
              setFilterDialogState(true);
              handleClose();
            }}
          >
            {t('layerPanel.filter')}
          </MenuItem>
        )}
        {onLegendClick && (
          <MenuItem hidden={isOpacityOpen} onClick={onLegendClick}>
            {t(`layerPanel.${isLegendVisible ? 'hideLegend' : 'showLegend'}`)}
          </MenuItem>
        )}
        <MenuItem hidden={isOpacityOpen} onClick={handleZoomToLayer}>
          {t('layerPanel.zoomToLayer')}
        </MenuItem>
        {isSimpleLayer && (
          <MenuItem hidden={isOpacityOpen} onClick={handleAttrTable}>
            {t('layerPanel.openAttrTable')} {isAttrTableOpen && t('layerPanel.attrTableIsOpen')}
          </MenuItem>
        )}
        <MenuItem sx={{ minWidth: 200 }} hidden={!isOpacityOpen}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={opacity}
            onChange={(_, newValue) => {
              setOpacity(newValue as number);
            }}
          />
        </MenuItem>
        <MenuItem hidden={isOpacityOpen || !isVisible} onClick={handleOpacity}>
          {t('layerPanel.setOpacity')}
        </MenuItem>
      </Menu>
      {filterDialogState && <CqlFilterDialog layer={tileLayer} onClose={() => setFilterDialogState(false)} />}
    </Box>
  );
};