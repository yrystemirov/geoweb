import { IconButton, Tooltip, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Map } from 'ol';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useState, useEffect, useRef, useContext, CSSProperties } from 'react';
import { fromLonLat } from 'ol/proj';
import TableCell from '@mui/material/TableCell';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import TileLayer from 'ol/layer/Tile';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import LayerGroup from 'ol/layer/Group';
import { usePublicMapStore } from '../../../hooks/usePublicMapStore';

interface Props {
  color?: CSSProperties['background'];
}

export const LeftPanel: React.FC<Props> = ({ color }) => {
  const { map, userLayers } = usePublicMapStore();
  const { t } = useTranslation();
  const label = t('maps.title');
  const [layerList, setLayerList] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!userLayers || userLayers.length == 0) return;
    let layerListNew: any[] = [];
    userLayers.map((layerItem: TileLayer) => {
      layerListNew.push({
        code: layerItem.getProperties().code,
        layer: layerItem.getProperties().label,
        visible: layerItem.getVisible(),
      });
    });
    setLayerList(layerListNew);
  }, [userLayers]);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const switchLayer = (layerName: string, visible: boolean, code: string) => {
    if (userLayers.length > 0) {
      for (let userLayer_ of userLayers) {
        if (userLayer_.getProperties().code === code) {
          userLayer_.setVisible(visible);
        }
      }
    }
    console.log(map);
  };

  return (
    <>
      <Tooltip title={label} placement="left">
        <IconButton
          style={{
            background: color ? color : 'rgb(64 152 68 / 70%)',
            borderRadius: 0,
          }}
          onClick={handleButtonClick}
          sx={{ color: 'white' }}
        >
          <LibraryAddCheckIcon />
        </IconButton>
      </Tooltip>
      {dialogOpen && (
        <div
          style={{
            position: 'absolute',
            left: '50px',
            width: '250px',
            height: '200px',
            backgroundColor: '#fff',
            padding: '30px 10px 10px',
            borderRadius: 4,
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
          }}
        >
          <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{
              paddingRight: '10px',
              //lineHeight: 0.9,
              // TODO: translate
              //color: router.locale === 'kk' ? 'white' : 'black',
              marginLeft: '10px',
              ':hover': {
                color: '#5dbb67',
              },
              cursor: 'pointer',
              color: 'green',
            }}
          >
            {t('maps.title')}
          </Typography>
          {layerList.map((layerItem: any) => {
            return (
              <div key={layerItem.layer}>
                <IconButton
                  onClick={() => {
                    let visible_ = false;
                    let layers_: any[] = [];
                    layerList.map((layer_) => {
                      if (layer_.code == layerItem.code) {
                        visible_ = !layer_.visible;
                        layer_.visible = !layer_.visible;
                      }
                      layers_.push(layer_);
                    });
                    setLayerList(layers_);
                    switchLayer(layerItem.layer, visible_, layerItem.code);
                  }}
                >
                  {layerItem.visible && <VisibilityIcon />}
                  {!layerItem.visible && <VisibilityOffIcon />}
                </IconButton>
                {layerItem.layer}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
