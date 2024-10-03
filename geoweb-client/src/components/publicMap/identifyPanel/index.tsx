import { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VectorLayer from 'ol/layer/Vector';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { TabContext } from '@mui/lab';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import OpenlayersBaseLayersUtils from '../../../utils/openlayers/OpenlayersBaseLayersUtils';
import { usePublicMapStore } from '../../../hooks/usePublicMapStore';
import { mapOpenAPI } from '../../../api/openApi';

class GeoserverIdnetifyParams {
  constructor(
    public view: any,
    public source: any,
    public layerNames: any,
    public coordinate: any,
  ) {}
}

export const IdentifyPanel = (props: any) => {
  const { map, userLayers, identifyEventData, setIdentifyEventData } = usePublicMapStore();
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
    setIsLoading(true);
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
        setIdentData(res.data);
      });

    /*api
      .post(`${gisApi}/features/wms`, {
        layers: urlParams.get('LAYERS'),
        updatedTime: urlParams.get('updatedTime'),
        i: urlParams.get('I'),
        j: urlParams.get('J'),
        bbox: urlParams.get('BBOX'),
      })
      .then((response) => {
        response.data.features;
        if (response.data.features && response.data.features.length > 0) {
          response.data.features.map((item: any, index: number) => {
            let layerName_ = item.id.split('.')[0];
            let featureId_ = item.id.split('.')[1];
            let layer_ = getLayerByLayerName(layerName_);
            api
              .get(`${gisApi}/open-api-identify/layerobject?layerName=${layerName_}&gid=${featureId_}&withGeometry=`)
              .then((response2: any) => {
                api
                  .get(`${gisApi}/open-api-layers/${layer_.id}/attrs`)
                  .then((response3) => {
                    layer_.layerAttrs = response3.data;
                    layer_.layerAttrs.forEach((attr_: any) => {
                      if (attr_.dictionaryCode && attr_.shortinfo == true) {
                        getListByCode(attr_.dictionaryCode);
                      }
                    });
                    response2.data[0].geom = response.data.features.filter(
                      (_: any) => _.id == layer_.layername + '.' + response2.data[0].gid,
                    )[0].geometry;
                    newData.push({ layer: layer_, attrs: response2.data });
                    if (index === response.data.features.length - 1) {
                      const _list = newData.filter((data) => data.attrs);
                      setIdentData(_list);
                    }
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    console.log('err', error);
                    setIsLoading(false);
                  });
              })
              .catch((err) => {
                console.log('err', err);
                setIsLoading(false);
              });
          });
        } else {
          toast.warning(t('gis:gis.no_identification_data_available'), {
            delay: 3,
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        toast.warning(t('gis:gis.identification_error'), { delay: 3 });
        setIsLoading(false);
      });*/
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
    const list = identData?.map((item: any, index: number) => {
      return (
        <TabContext value={tab} key={item.gid}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="">
              <Tab label="Атрибуты" value="attribute" />
              {/* <Tab label="Файлы" value="file" /> */}
            </TabList>
          </Box>
          <TabPanel value="attribute" sx={{ width: '100%', padding: 0, marginTop: '10px' }}>
            <Accordion
              sx={{ width: '100%', height: 'auto' }}
              defaultExpanded={index === 0 ? true : false}
              onChange={(event, expanded) => setSelectedFeature(item)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                classes={{ expanded: 'expanded' }}
              >
                {/* <Typography>{translateField(item.layer, 'name', locale)}</Typography> */}
                <Typography>{item.layer.nameRu}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '8px 0px 0px', width: '100%', overflowX: 'scroll' }}>
                <Table
                  aria-label="custom pagination table"
                  size="small"
                  sx={{
                    wordWrap: 'break-word',
                    tableLayout: 'fixed',
                  }}
                >
                  <TableBody>
                    {item.attributes.length > 0 &&
                      item.attributes.map((attributeItem: any) => (
                        <TableRow key={attributeItem.attr.nameRu}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ padding: '2px' }}
                            style={{
                              padding: '6px 2px',
                              wordWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}
                            width={180}
                          >
                            {attributeItem.attr.nameRu}
                          </TableCell>
                          <TableCell
                            width={270}
                            style={{
                              padding: '6px 2px',
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
              </AccordionDetails>
            </Accordion>
          </TabPanel>
          <TabPanel value="file">
            <Box sx={{ width: '100%', padding: 0, marginTop: '10px' }}>
              {files.map((file: any, index: number) => (
                <a onClick={() => downloadSource(file)} key={index} rel="noreferrer">
                  {file.isImg ? (
                    <img
                      src={getSource(file)}
                      alt={file.fileName}
                      style={{
                        width: '100%',
                        maxWidth: '340px',
                        height: '10%',
                        maxHeight: '250px',
                        cursor: 'pointer',
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', gap: '3', alignItems: 'center' }}>
                      <p style={{ textDecoration: 'underline', color: 'primary' }}>{file.fileName}</p>
                      <FileOpenIcon color="primary" />
                    </Box>
                  )}
                </a>
              ))}
            </Box>
          </TabPanel>
        </TabContext>
      );
    });
    return list;
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
          display: 'flex',
          position: 'absolute',
          height: '80%',
          width: '450px',
          zIndex: 3,
          top: '10px',
          right: '100px',
          overflowY: 'auto',
          overflowX: 'hidden !important',
          background: '#ffffff',
          // boxShadow: '0px 32px 32px -8px rgba(18, 18, 18, 0.08), 0px 0px 32px -8px rgba(18, 18, 18, 0.12), 0px 0px 1px rgba(18, 18, 18, 0.2)',
        }}
      >
        <div
          className="menu"
          style={{
            width: '43px',
            background: '#e5e5e5',
            borderLeft: '1px #dadada solid',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '2px',
            gap: '12px',
          }}
        >
          <IconButton
            aria-label="delete"
            onClick={() => {
              let vector = getIdentifyLayer();
              if (vector && vector.getSource) vector.getSource()?.clear();
              vector?.setVisible(false);
              setIdentifyEventData(null);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="details">{renderList()}</div>
      </Paper>
    </>
  );
};
