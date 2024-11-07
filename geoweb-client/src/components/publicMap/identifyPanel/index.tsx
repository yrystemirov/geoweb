import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VectorLayer from 'ol/layer/Vector';
import OpenlayersBaseLayersUtils from '../../../utils/openlayers/OpenlayersBaseLayersUtils';
import { usePublicMapStore } from '../../../hooks/usePublicMapStore';
import { mapOpenAPI } from '../../../api/openApi';
import { translateField } from '../../../utils/localization';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../common/Loader';

class GeoserverIdnetifyParams {
  constructor(
    public view: any,
    public source: any,
    public layerNames: any,
    public coordinate: any,
  ) {}
}

export const IdentifyPanel = () => {
  const { i18n, t } = useTranslation();
  const { map, userLayers, identifyEventData, setIdentifyEventData, systemThemeColor } = usePublicMapStore();
  const [identData, setIdentData] = useState<any>();
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const identifyVectorName = 'identifyVectorLayer';
  const [dictionaries, setDictionaries] = useState<any>({});

  const [tab, setTab] = useState('attribute');
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    if (!identifyEventData || !map) return;
    setIdentData([]);

    let identData_: any[] = [];
    /*context.map.forEachFeatureAtPixel(context.identifyEventData.pixel, (feat: any) => {
            let layerAttrs_ = [];
            for (const key in feat.get('layerAttrs')) {
                layerAttrs_.push({
                    attrname: key,
                    nameRu: feat.get('layerAttrs')[key],
                    nameKz: feat.get('layerAttrs')[key],
                    shortinfo: true,
                });
            }

            let item_ = {
                layer: {
                    layerAttrs: layerAttrs_,
                    nameRu: feat.get('layerNameRu'),
                    nameKz: feat.get('layerNameKz'),
                },
                attrs: [feat.get('attrs')],
            };
            item_.attrs[0].geom = feat.getGeometry();
            item_.attrs[0].gid = 'gid.' + feat.get('attrs').OBJECTID;
            for (const key in item_.attrs[0]) {
                if (key.toLocaleLowerCase() == 'date' && parseInt(item_.attrs[0][key])) {
                    item_.attrs[0][key] = new Date(item_.attrs[0][key]).toLocaleString();
                }
            }
            identData_.push(item_);
        })*/
    let _layerNames: any[] = [];
    let layerGroups: any = map?.getLayers().getArray();
    let vectorSourceForGeoserverUrl = null;
    layerGroups.map((layerGroup: any) => {
      if (layerGroup?.getProperties().code == 'user_layers') {
        let layers: any[] = layerGroup.getLayers().getArray();
        if (layers.length > 0) {
          //TODO check for vectorLayer
          vectorSourceForGeoserverUrl = layers[0].getSource();
        }

        layers.map((item_) => {
          if (item_.getVisible()) {
            _layerNames.push(item_.getSource().getParams()['LAYERS']);
          }
        });
      }
    });

    if (vectorSourceForGeoserverUrl && _layerNames.length > 0) {
      let url = getIdentUrlFromGeoserver({
        view: map?.getView(),
        source: vectorSourceForGeoserverUrl,
        layerNames: _layerNames,
        coordinate: identifyEventData['coordinate'],
      });
      getIdent(url, identData_);
    }
  }, [identifyEventData]);

  useEffect(() => {
    fetchFiles();
  }, [identData]);

  const getLayerByLayerName = (layerName: any) => {
    return userLayers.filter((userLayer: any) => {
      return userLayer.layername == layerName;
    })[0];
  };

  const getIdentUrlFromGeoserver = (params: GeoserverIdnetifyParams) => {
    var viewResolution = params.view.getResolution();
    var url = params.source.getFeatureInfoUrl(params.coordinate, viewResolution, params.view.getProjection(), {
      INFO_FORMAT: 'application/json',
      LAYERS: params.layerNames.join(),
      QUERY_LAYERS: params.layerNames.join(),
      FEATURE_COUNT: 5,
      propertyName: 'geom',
    });
    return url;
  };

  useEffect(() => {
    setIdentData(identData);
  }, [dictionaries]);

  /*const getListByCode = (code: string) => {
    if (!dictionaries[code]) {
      getPublicUserListsItems(`list_${code}`)
        .then((response: any) => {
          dictionaries[code] = response.data;
          setDictionaries(dictionaries);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };*/

  function getIdent(url: any, identData_: any[]) {
    setIsLoading(true);
    const newData: any[] = identData_ ? identData_ : [];
    const urlParams = new URLSearchParams(url);

    mapOpenAPI
      .getOpenApiIdentify({
        layers: urlParams.get('LAYERS'),
        updatedTime: urlParams.get('updatedTime'),
        i: urlParams.get('I'),
        j: urlParams.get('J'),
        bbox: urlParams.get('BBOX'),
      })
      .then((res: any) => {
        let identDataByLayers: any = {};
        if (res.data && res.data.length > 0) {
          res.data.map((item_: any) => {
            if (!identDataByLayers[item_.layer.id]) {
              identDataByLayers[item_.layer.id] = {
                layer: item_.layer,
                features: [],
              };
            }
            identDataByLayers[item_.layer.id].features.push({
              attributes: item_.attributes,
              gid: item_.gid,
              geom: item_.geom,
            });
          });
        }
        setIdentData(identDataByLayers);
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const getValueFixed = (item: any, columnname: any) => {
    let value = item.attrs[0][columnname];
    let column = item.layer.layerAttrs.filter((columnAttr: any) => {
      return columnAttr.attrname == columnname;
    })[0];

    if (column.dictionaryCode) {
      let dictionaryCode = column.dictionaryCode;
      if (dictionaries[dictionaryCode]) {
        let res = dictionaries[dictionaryCode].filter((item__: any) => {
          return item__.code + '' == value + '';
        });
        if (res?.length > 0) {
          return res[0].name;
        }
      } else {
        return '';
      }
    } else {
      if (typeof value == 'number') {
        return value.toFixed(2);
      } else {
        if (isValidHttpUrl(value)) {
          return (
            <>
              <a href={value} target="_blank" rel="noreferrer">
                <u>Открыть</u>
              </a>
            </>
          );
        }
        return value;
      }
    }

    return '';
  };

  function isValidHttpUrl(str: any) {
    let url;

    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'www';
  }

  const fetchFiles = async () => {
    /*if (!identData?.length) return;
    const layername = identData[0].layer?.layername;
    const gid = identData[0].attrs[0].gid;
    const layerGid = layername + '.' + gid;
    const layerGidwithLayerId = identData[0].layer?.id + '.' + gid;
    let fileArray1 = await api.get(`${gisApi}/open-api/feature-files/layerGid/${layerGid}`).then((response) => {
      response.data.forEach((item: any) => {
        const fileExtension = item.fileName.split('.').pop().toLowerCase();
        const imageFormats = ['jpg', 'jpeg', 'png', 'svg'];
        if (imageFormats.includes(fileExtension)) item.isImg = true;
      });
      return response.data;
    });

    let fileArray2 = await api
      .get(`${gisApi}/open-api/feature-files/layerGid/${layerGidwithLayerId}`)
      .then((response) => {
        response.data.forEach((item: any) => {
          const fileExtension = item.fileName.split('.').pop().toLowerCase();
          const imageFormats = ['jpg', 'jpeg', 'png', 'svg'];
          if (imageFormats.includes(fileExtension)) item.isImg = true;
        });
        return response.data;
      });
    let res = fileArray1.concat(fileArray2);
    setFiles(res);*/
  };

  const handleChange = (event: any, tab: string) => {
    setTab(tab);
  };

  const getSource = (file: any) => {
    return `${window.location.origin}:443/${file.minioBucket}/${file.minioObject}`;
  };

  const downloadSource = (file: any) => {
    /*if (file.minioBucket == 'static-storage') {
      let url_ = `${window.location.origin}:443/${file.minioBucket}/${file.minioObject}`;
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = url_;
      //a.download = url_.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      api
        .get(`uploads/main/files/download?bucket=${file.minioBucket}&filename=${file.minioObject}`, {
          responseType: 'blob',
        })
        .then((res) => {
          const file = new Blob([res.data], { type: 'application/pdf' });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          const pdfWindow = window.open();
          //@ts-ignore
          pdfWindow.location.href = fileURL;
        })
        .catch((error) => {
          console.log('error on file download');
        });
    }*/
  };

  const renderList = () => {
    let result = [];
    let index = 0;
    if (!identData || Object.keys(identData).length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {!isLoading && t('noData')}
        </Box>
      );
    }
    for (var key in identData) {
      result.push(
        <Accordion
          sx={{ width: '100%', height: 'auto' }}
          defaultExpanded={index === 0 ? true : false}
          //onChange={(event, expanded) => setSelectedFeature(item)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            classes={{ expanded: 'expanded' }}
          >
            {/* <Typography>{translateField(item.layer, 'name', locale)}</Typography> */}
            <Typography>{`${identData[key].layer.nameRu} (${identData[key].features.length})`}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '8px 0px 0px', width: '100%', overflowX: 'scroll' }}>
            <Pagination
              sx={{ float: 'right' }}
              siblingCount={0}
              boundaryCount={1}
              count={identData[key].features.length}
              onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                //setPage(value);
                let featrePanels: any = document.querySelectorAll(`[class^=class-ident-${identData[key].layer.id}]`);
                featrePanels.forEach((panel: any) => {
                  panel.style.display = 'none';
                });
                let selectedPanel: any = document.querySelectorAll(
                  `[class^=class-ident-${identData[key].layer.id}-${value - 1}]`,
                );
                selectedPanel[0].style.display = 'block';
              }}
            />
            {identData[key].features.map((feature_: any, index: number) => {
              return (
                <div
                  className={`class-ident-${identData[key].layer.id}-${index}`}
                  style={{ display: index == 0 ? 'block' : 'none' }}
                >
                  <Table
                    aria-label="custom pagination table customized"
                    size="small"
                    sx={{
                      wordWrap: 'break-word',
                      tableLayout: 'fixed',
                    }}
                  >
                    <TableBody>
                      {feature_.attributes.length > 0 &&
                        feature_.attributes.map((attributeItem: any) => (
                          <TableRow key={attributeItem.attr.nameRu}>
                            <TableCell
                              component="th"
                              scope="row"
                              // sx={{ padding: '2px' }}
                              style={{
                                // padding: '6px 2px',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                              }}
                              width={180}
                            >
                              {translateField(attributeItem.attr, 'name', i18n.language)}
                            </TableCell>
                            <TableCell
                              width={270}
                              style={{
                                // padding: '6px 2px',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                              }}
                            >
                              {/* {getValueFixed(item, attributeItem.value)} */}
                              {attributeItem.value}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </AccordionDetails>
        </Accordion>,
      );
      index++;
    }
    return result;
  };

  const getIdentifyLayer = () => {
    let layerExists =
      map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == identifyVectorName;
        }).length > 0;
    let vector = new VectorLayer();
    if (layerExists) {
      //@ts-ignore
      vector = map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == identifyVectorName;
        })[0];
    } else {
      vector = OpenlayersBaseLayersUtils.getDefaultVectorLayer(true, identifyVectorName);
      map!.addLayer(vector);
      map!.updateSize();
    }
    return vector;
  };

  return (
    <>
      <Paper
        sx={{
          // display: 'flex',
          position: 'absolute',
          height: '80%',
          width: '450px',
          zIndex: 3,
          top: '10px',
          right: '100px',
          overflowY: 'auto',
          overflowX: 'hidden !important',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          // boxShadow: '0px 32px 32px -8px rgba(18, 18, 18, 0.08), 0px 0px 32px -8px rgba(18, 18, 18, 0.12), 0px 0px 1px rgba(18, 18, 18, 0.2)',
        }}
      >
        <div
          className="menu"
          style={{
            background: systemThemeColor,
          }}
        >
          <IconButton
            sx={{ float: 'right', color: 'white' }}
            aria-label="delete"
            onClick={() => {
              let vector = getIdentifyLayer();
              if (vector && vector.getSource) vector.getSource()?.clear();
              vector?.setVisible(false);
              setIdentifyEventData(null);
            }}
          >
            <CloseIcon fontSize={'small'} />
          </IconButton>
        </div>
        <Box className="details" flex={1} position={'relative'}>
          {isLoading && <Loader />}
          {renderList()}
        </Box>
      </Paper>
    </>
  );
};
