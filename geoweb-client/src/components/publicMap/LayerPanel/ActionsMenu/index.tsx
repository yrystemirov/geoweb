import { FC, MouseEvent, useEffect, useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Slider } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { t } from 'i18next';
import { LayerDto, LayerType } from '../../../../api/types/mapFolders';
import { usePublicMapStore } from '../../../../hooks/usePublicMapStore';
import { useMutation } from '@tanstack/react-query';
import { mapOpenAPI } from '../../../../api/openApi';
import { convertWktToGeometry, fitExtentToGeometryWithAnimation} from '../../../../utils/openlayers/utils';
import { useNotify } from '../../../../hooks/useNotify';

type Props = {
  layer: LayerDto;
  onFilter?: () => void;
  onLegendClick?: () => void;
  isLegendVisible?: boolean;
};

// функции:
// - открытие атрибутивной таблицы ✅
// - управление прозрачностью слоя ✅
// - фильтрация слоя (диалоговое окно) ⏳
// - отображение легенды ✅
// - приближение к слою ✅
export const LayerActionsMenu: FC<Props> = ({ isLegendVisible = false, layer, onFilter, onLegendClick }) => {
  const { showError } = useNotify();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { map, userLayers, attributeTables, setAttributeTables, setCurrentAttributeTable } = usePublicMapStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opacity, setOpacity] = useState<number>(1);
  const [isOpacityOpen, setIsOpacityOpen] = useState(false);

  const getExtentMutation = useMutation({
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

  const hadleAttrTable = () => {
    if (attributeTables.length == 0 || attributeTables.filter((at) => at.id == layer.id).length == 0) {
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
    getExtentMutation.mutate();
    handleClose();
  };

  const isSimpleLayer = layer.layerType === LayerType.SIMPLE;
  const isVisible = userLayers.some((l) => l.getProperties().systemLayerProps.id === layer.id && l.getVisible());
  const isAttrTableOpen = attributeTables.some((at) => at.id == layer.id);

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
        <MoreVert sx={{ fontSize: 20 }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose} closeAfterTransition sx={{ zIndex: 5001 }}>
        {onLegendClick && (
          <MenuItem hidden={isOpacityOpen} onClick={onLegendClick}>
            {t(`layerPanel.${isLegendVisible ? 'hideLegend' : 'showLegend'}`)}
          </MenuItem>
        )}
        <MenuItem hidden={isOpacityOpen} onClick={handleZoomToLayer}>
          {t('layerPanel.zoomToLayer')}
        </MenuItem>
        {isSimpleLayer && onFilter && (
          <MenuItem hidden={isOpacityOpen} onClick={() => onFilter()}>
            {t('layerPanel.filter')}
          </MenuItem>
        )}
        {isSimpleLayer && (
          <MenuItem hidden={isOpacityOpen} onClick={hadleAttrTable} disabled={isAttrTableOpen}>
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
    </Box>
  );
};