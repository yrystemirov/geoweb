import { FC, MouseEvent, useEffect, useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Slider } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { t } from 'i18next';
import { LayerDto, LayerType } from '../../../../api/types/mapFolders';
import { usePublicMapStore } from '../../../../hooks/usePublicMapStore';

type Props = {
  layer: LayerDto;
  onFilter?: () => void;
  onShowLegend?: () => void;
  onZoomToLayer?: () => void;
};

// функции:
// - открытие атрибутивной таблицы ✅
// - управление прозрачностью слоя ✅
// - фильтрация слоя (диалоговое окно)
// - отображение легенды
// - приближение к слою
export const LayerActionsMenu: FC<Props> = ({ layer, onFilter, onShowLegend, onZoomToLayer }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { userLayers, attributeTables, setAttributeTables, setCurrentAttributeTable } = usePublicMapStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opacity, setOpacity] = useState<number>(1);
  const [isOpacityOpen, setIsOpacityOpen] = useState(false);

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

  const isSimpleLayer = layer.layerType === LayerType.SIMPLE;
  const isVisible = userLayers.some((l) => l.getProperties().systemLayerProps.id === layer.id && l.getVisible());

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
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose} closeAfterTransition sx={{ zIndex: 5001 }}>
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

        {onShowLegend && (
          <MenuItem hidden={isOpacityOpen} onClick={() => onShowLegend()}>
            {t('layerPanel.showLegend')}
          </MenuItem>
        )}
        {onZoomToLayer && (
          <MenuItem hidden={isOpacityOpen} onClick={() => onZoomToLayer()}>
            {t('layerPanel.zoomToLayer')}
          </MenuItem>
        )}
        {isSimpleLayer && onFilter && (
          <MenuItem hidden={isOpacityOpen} onClick={() => onFilter()}>
            {t('layerPanel.filter')}
          </MenuItem>
        )}
        {isSimpleLayer && (
          <MenuItem
            hidden={isOpacityOpen}
            onClick={hadleAttrTable}
            disabled={attributeTables.some((at) => at.id == layer.id)}
          >
            {t('layerPanel.openAttributeTable')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};