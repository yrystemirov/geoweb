import { IconButton, Tooltip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Map } from 'ol';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useState, useEffect, useRef, useContext, CSSProperties } from 'react';
import { fromLonLat } from 'ol/proj';
import TableCell from '@mui/material/TableCell';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import GridOnIcon from '@mui/icons-material/GridOn';
//import OpenlayersExtendUtils, { TileLayerSourceType } from '../../utils/olExtend';
//import { mapContext } from '../mapContextProvider';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import LayersIcon from '@mui/icons-material/Layers';

interface Props {
    map: Map;
    color?: CSSProperties['background'];
    layers?:any[]
  }
  
export const BaseLayersTool: React.FC<Props> = ({ map, color, layers }) => {
    const { t } = useTranslation();
    const label = t('baseLayers');
    const [layerList, setLayerList] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    

    useEffect(() => {
        if(!layers||layers.length==0) return;
        
        let layerListNew:any[] = [];
        layers.map((layerItem:TileLayer)=>{
            layerListNew.push({
                code: layerItem.getProperties().code,
                layer: layerItem.getProperties().label,
                visible:layerItem.getVisible()
            });
        });
        setLayerList(layerListNew);
      }, [layers]);
    

    const handleButtonClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const switchLayer = (layerName: string, visible: boolean, code: string) => {
        let layers = map
            .getLayers()
            .getArray()
            .filter((layerGroup: any) => {
                return layerGroup.getProperties().code == 'base_layers';
            })[0]
            //@ts-ignore
            .getLayers()
            .getArray();

        for (let layer of layers) {
            if (layer.getProperties && layer.getProperties().code == code) {
                layer.setVisible(visible);
            }
        }
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
                    <LayersIcon />
                </IconButton>
            </Tooltip>
            {dialogOpen && (
                <div
                    style={{
                        position: 'absolute',
                        right: '50px',
                        width: '250px',
                        height: '200px',
                        backgroundColor: '#fff',
                        padding: '30px 10px 10px',
                        borderRadius: 4,
                        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.6)',
                        zIndex: 9999,
                    }}
                >
                    <IconButton
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={handleDialogClose}
                    >
                        <CloseIcon />
                    </IconButton>
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
