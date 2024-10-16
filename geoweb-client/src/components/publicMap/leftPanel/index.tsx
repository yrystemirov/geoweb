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
import ListAltIcon from '@mui/icons-material/ListAlt';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { translateField } from '../../../utils/localization';
import { bool, boolean } from 'yup';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare,
  faSquare,
  faChevronDown,
  faChevronRight,
  faPlusSquare,
  faMinusSquare,
  faFolder,
  faFolderOpen,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CheckboxTree from 'react-checkbox-tree';
import { treeIcons } from './data';

interface Props {
  color?: CSSProperties['background'];
  publicMaps?: any[];
}

interface TreeLyrGroup {
  treeData: any[];
  nameRu: string;
  nameKk: string;
  id: string;
  iconSrc?: string;
}

export const LeftPanel: React.FC<Props> = ({ color, publicMaps }) => {
  const { map, userLayers, attributeTables, setAttributeTables, setCurrentAttributeTable } = usePublicMapStore();

  const { i18n, t } = useTranslation();
  const label = t('maps.title');
  const [layerList, setLayerList] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [treeLayerGroups, setTreeLayerGroups] = useState<TreeLyrGroup[]>([]);
  library.add(
    faCheckSquare,
    faSquare,
    faChevronDown,
    faChevronRight,
    faPlusSquare,
    faMinusSquare,
    faFolder,
    faFolderOpen,
    faFile,
  );

  useEffect(() => {
    if (!userLayers || userLayers.length == 0) return;
    let layerListNew: any[] = [];
    userLayers.map((layerItem: TileLayer) => {
      let layerItem_ = layerItem.getProperties().systemLayerProps;
      layerItem_.visible = layerItem.getVisible();
      layerListNew.push(layerItem_);
    });
    setLayerList(layerListNew);
  }, [userLayers]);

  const handleButtonClick = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const switchLayer = (visible: boolean, code: string) => {
    if (userLayers.length > 0) {
      for (let userLayer_ of userLayers) {
        if (userLayer_.getProperties().code === code) {
          userLayer_.setVisible(visible);
        }
      }
    }
    console.log(map);
  };

  /** new algorythm starts */

  const getLegendLanguageAsGetParam = (default_: boolean) => {
    if (default_ === true) {
      return '';
    }
    if (i18n.language === 'ru') {
      return '&LANGUAGE=eng';
    }
    if (i18n.language === 'kz') {
      return '&LANGUAGE=ita';
    }
  };

  const loadLayers = () => {
    const loopChildren = (node: any, parentValue: any) => {
      let newNode: { value: any; label: any; nameKk: any; nameRu: any; children: any[] } = {
        value: node.id,
        label: translateField(node, 'name', i18n.language),
        nameKk: node.nameKk,
        nameRu: node.nameRu,
        children: [],
      };
      if (node.layers) {
        node.layers.map((item_: any) => {
          let innerValue_ = parentValue + '/' + item_.id + '_layer';
          let nodeInner = {
            id: item_.id,
            value: innerValue_,
            label: (
              <>
                <div>
                  <div>
                    {translateField(item_, 'name', i18n.language)}{' '}
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        //TODO
                        //clickLegendButton(item_.layername);
                      }}
                    >
                      <LegendToggleIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        //TODO
                        //zoomToLayer(item_.layername);
                      }}
                    >
                      <ZoomInMapIcon fontSize="inherit" />
                    </IconButton>
                  </div>
                  <div style={{ display: 'none' }} className={item_.layername}>
                    <img
                      src={`/geoserver/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis:${item_.layername}${getLegendLanguageAsGetParam(true)}`}
                    />
                  </div>
                </div>
              </>
            ),
          };
          newNode.children.push(nodeInner);
        });
      }
      if (node.children) {
        node.children.map((item_: any) => {
          let innerValue_ = parentValue + '/' + item_.id;
          let nodeInner: any = {
            value: innerValue_,
            id: item_.id,
            label: (
              <>
                <div>{translateField(item_, 'name', i18n.language)}</div>
              </>
            ),
          };

          let children_: any[] = [];
          if (item_.layers) {
            item_.layers.map((_itemInner__: any) => {
              let nodeInner_ = {
                id: _itemInner__.id,
                value: innerValue_ + '/' + _itemInner__.id + '_layer',
                label: (
                  <>
                    <div>
                      <div>
                        {translateField(_itemInner__, 'name', i18n.language)}
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            //TODO
                            //clickLegendButton(_itemInner__.layername);
                          }}
                        >
                          <LegendToggleIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            //TODO
                            //zoomToLayer(_itemInner__.layername);
                          }}
                        >
                          <ZoomInMapIcon fontSize="inherit" />
                        </IconButton>
                      </div>
                      <div style={{ display: 'none' }} className={_itemInner__.layername}>
                        <img
                          src={`/geoserver/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis:${_itemInner__.layername}${getLegendLanguageAsGetParam(true)}`}
                        />
                      </div>
                    </div>
                  </>
                ),
              };
              children_.push(nodeInner_);
            });
          }
          if (item_.children) {
            item_.children.map((innerItem_: any) => {
              children_.push(loopChildren(innerItem_, innerValue_));
            });
            nodeInner.children = children_;
          }
          newNode.children.push(nodeInner);
        });
      }
      return newNode;
    };

    publicMaps!.forEach((lyrGroup: any) => {
      let treeData: any[] = [];
      if (lyrGroup.layers) {
        lyrGroup.layers.map((item_: any) => {
          let node = {
            id: item_.id,
            value: item_.id + '_layer',
            label: (
              <>
                <div>
                  <div>
                    {translateField(item_, 'name', i18n.language)}
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        //TODO
                        //clickLegendButton(item_.layername);
                      }}
                    >
                      <LegendToggleIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        //TODO
                        //zoomToLayer(item_.layername);
                      }}
                    >
                      <ZoomInMapIcon fontSize="inherit" />
                    </IconButton>
                  </div>
                  <div style={{ display: 'none' }} className={item_.layername}>
                    <img
                      src={`/geoserver/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis:${item_.layername}${getLegendLanguageAsGetParam(true)}`}
                    />
                  </div>
                </div>
              </>
            ),
          };
          treeData.push(node);
        });
      }
      if (lyrGroup.children) {
        lyrGroup.children.map((item_: any) => {
          let value_ = '/' + lyrGroup.id + '/' + item_.id;
          let node: any = {
            value: value_,
            id: item_.id,
            label: (
              <>
                <div>{translateField(item_, 'name', i18n.language)}</div>
              </>
            ),
          };
          let children_: any[] = [];
          if (item_.children) {
            item_.children.map((innerItem_: any) => {
              children_.push(loopChildren(innerItem_, value_));
            });
            node.children = children_;
          }
          if (item_.layers) {
            item_.layers.map((innerItemLayer_: any) => {
              let nodeInnerLayer_ = {
                id: innerItemLayer_.id,
                value: value_ + '/' + innerItemLayer_.id + '_layer',
                label: (
                  <>
                    <div>
                      <div>
                        {translateField(innerItemLayer_, 'name', i18n.language)}
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            //TODO
                            //clickLegendButton(innerItemLayer_.layername);
                          }}
                        >
                          <LegendToggleIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            //TODO
                            //zoomToLayer(innerItemLayer_.layername);
                          }}
                        >
                          <ZoomInMapIcon fontSize="inherit" />
                        </IconButton>
                      </div>
                      <div style={{ display: 'none' }} className={innerItemLayer_.layername}>
                        <img
                          src={`/geoserver/gis/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=gis:${innerItemLayer_.layername}${getLegendLanguageAsGetParam(true)}`}
                        />
                      </div>
                    </div>
                  </>
                ),
              };
              children_.push(nodeInnerLayer_);
            });
            node.children = children_;
          }
          treeData.push(node);
        });
      }
      setTreeLayerGroups((prev) => [
        ...prev,
        {
          treeData,
          nameRu: lyrGroup.nameRu,
          nameKk: lyrGroup.nameKk,
          id: lyrGroup.id,
          iconSrc: lyrGroup.imgUrl,
        },
      ]);
    });
  };

  useEffect(() => {
    if (!publicMaps || publicMaps.length == 0) return;
    loadLayers();
  }, [publicMaps]);
  /** ends */
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
            height: '400px',
            backgroundColor: '#fff',
            padding: '30px 10px 10px',
            borderRadius: 4,
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
            overflow: 'scroll',
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
              //color: router.i18n.language === 'kk' ? 'white' : 'black',
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
              <div key={layerItem.layername}>
                {layerItem.layername}
                <IconButton
                  onClick={() => {
                    let visible_ = false;
                    let layers_: any[] = [];
                    layerList.map((layer_) => {
                      if (layer_.id == layerItem.id) {
                        visible_ = !layer_.visible;
                        layer_.visible = !layer_.visible;
                      }
                      layers_.push(layer_);
                    });
                    setLayerList(layers_);
                    switchLayer(visible_, layerItem.id);
                  }}
                >
                  {layerItem.visible && <VisibilityIcon />}
                  {!layerItem.visible && <VisibilityOffIcon />}
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (
                      attributeTables.length == 0 ||
                      attributeTables.filter((at) => at.id == layerItem.id).length == 0
                    ) {
                      attributeTables.push(layerItem);
                      setAttributeTables(attributeTables);
                    }
                    setCurrentAttributeTable(layerItem);
                  }}
                >
                  <ListAltIcon />
                </IconButton>
              </div>
            );
          })}

          {/* {treeLayerGroups.map((lyrGroup) => (
            <div className="public-map" key={lyrGroup.id}>
              <Typography
                sx={{
                  paddingRight: '10px',
                  //lineHeight: 0.9,
                  // TODO: translate
                  //color: router.i18n.language === 'kk' ? 'white' : 'black',
                  marginLeft: '10px',
                  ':hover': {
                    color: '#5dbb67',
                  },
                  cursor: 'pointer',
                  color: 'green',
                }}
              >
                {translateField(lyrGroup, 'name', i18n.language).toUpperCase()}
              </Typography>
              <CheckboxTree
                nodes={lyrGroup.treeData}
                //checked={checked[lyrGroup.id] || []}
                //expanded={expanded[lyrGroup.id] || []}
                onCheck={(checked: string[]) => {
                  //setChecked((prev) => ({ ...prev, [lyrGroup.id]: checked }));
                }}
                onExpand={(expanded: string[]) => {
                  //setExpanded((prev) => ({ ...prev, [lyrGroup.id]: expanded }));
                }}
                icons={treeIcons}
                iconsClass="fa5"
              />
            </div>
          ))} */}
        </div>
      )}
    </>
  );
};