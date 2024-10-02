import 'ol/ol.css';
import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import './map.css';
import { Box } from '@mui/material';
import { HomeExtentButton } from '../common/mapTools/HomeExtentButton';
import MyLocation from '../common/mapTools/MyLocation';
import { MapMode, usePublicMapStore } from '../../hooks/usePublicMapStore';
import Measurement from './tools/measurement';
import OpenlayersBaseLayersUtils, { TileLayerSourceType } from '../../utils/openlayers/OpenlayersBaseLayersUtils';
import TileLayer from 'ol/layer/Tile';
import { BaseLayersTool } from './tools/baseLayers';
import proj4 from 'proj4';
import { toStringHDMS } from 'ol/coordinate';
import { LeftPanel } from './leftPanel';
import { useQuery } from '@tanstack/react-query';
import { mapOpenAPI } from '../../api/openApi';
import LayerGroup from 'ol/layer/Group';
import { IdentifyPanel } from './identifyPanel';

const MapComponent = () => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const { map, setMap, mapMode, userLayers, setUserLayers, identifyEventData, setIdentifyEventData } =
    usePublicMapStore();
  const [baseLayersArr, setBaseLayersArr] = useState<TileLayer[]>([]);
  //const [userLayersArr, setUserLayersArr] = useState<TileLayer[]>([]);
  const [mapMouseOverCoord, setMapMouseOverCoord] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const [mapDataLoaded, setMapDataLoaded] = useState<boolean>(false);
  const [lyrTree, setLyrTree] = useState<any>([]);

  const [lyrTreeInited, setLyrTreeinIted] = useState<boolean>(false);
  //const [layersToAddToMap, setLayersToAddToMap] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    mapOpenAPI.getOpenApiRootFolders().then((res: any) => {
      for (const lyrGroup of res.data) {
        mapOpenAPI.getOpenApiRootFoldertreeById(lyrGroup.id).then((response: any) => {
          lyrTree.push(response.data);
          setLyrTree(lyrTree);
          if (lyrTree.length === res.data.length) {
            setMapDataLoaded(true);
          }
        });
        //loadLyrGroup(lyrGroup, lyrGroup.id === res.data[res.data.length - 1].id);
      }
      if (!res.data || res.data.length === 0) {
        setMapDataLoaded(true);
      }
    });
    // let sortedLyrGroupsFromConfig: any;

    // const asyncCall = async () => {
    //   await mapOpenAPI.getOpenApiRootFolders().then((res: any) => {
    //     sortedLyrGroupsFromConfig = res?.data?.filter((el: any) => el.isPublic);
    //   });

    //   for (const lyrGroup of sortedLyrGroupsFromConfig) {
    //     await loadLyrGroup(
    //       lyrGroup,
    //       lyrGroup.id === sortedLyrGroupsFromConfig[sortedLyrGroupsFromConfig.length - 1].id,
    //     );
    //   }
    // };
    // asyncCall();
  }, [mounted]);

  useEffect(() => {
    if (!mapDataLoaded) return;

    initLyrs();
    setLyrTreeinIted(true);
  }, [mapDataLoaded]);

  useEffect(() => {
    if (!mapDivRef.current || !lyrTreeInited) return;

    let defaultBaseLayers_ = [
      OpenlayersBaseLayersUtils.getBaseLayerArcgisSattelite(true),
      OpenlayersBaseLayersUtils.getBaseLayerArcgisLabels(true),
      OpenlayersBaseLayersUtils.getBaseLayerOsm(false),
    ];

    setBaseLayersArr(defaultBaseLayers_);

    const mapObj = new Map({
      view: new View({
        center: [7739532.205446683, 6290648.115801078],
        zoom: 5.15,
      }),
      layers: [
        new LayerGroup({
          properties: {
            label: 'user layers',
            code: 'user_layers',
          },
          zIndex: 1,
          layers: userLayers,
        }),

        new LayerGroup({
          properties: {
            label: 'base layers',
            code: 'base_layers',
          },
          layers: defaultBaseLayers_,
        }),
      ],
    });
    mapObj.on('pointermove', (evt: any) => {
      if (evt.dragging) {
        // the event is a drag gesture, this is handled by openlayers (map move)
        return;
      }
      let wgsCoords = proj4('EPSG:3857', 'EPSG:4326', evt.coordinate);

      setMapMouseOverCoord(toStringHDMS(wgsCoords, 0));
    });

    mapObj.on('singleclick', (event) => {
      if (mapMode === MapMode.IDENTIFY) {
        setIdentifyEventData(event);
      }
    });

    mapObj.on('dblclick', (event) => {
      if (mapMode === MapMode.IDENTIFY) {
        setIdentifyEventData(event);
      }
    });

    mapObj.setTarget(mapDivRef.current);

    setMap(mapObj);

    return () => {
      mapObj.setTarget('');
      setMap(null);
    };
  }, [lyrTreeInited]);

  const initLyrs = () => {
    console.log(mapDataLoaded);
    let mainGeoserverWmsUrl = 'http://77.240.39.93:8082/geoserver/geoweb/wms';
    let alLayerNames = getLayerNames(lyrTree);
    //context.updateLayers(lyrTree);
    //context.updateUserLayers(alLayerNames);
    let layersToAddToMap_: any[] = [];
    alLayerNames.forEach((maplayer: any) => {
      if (
        layersToAddToMap_.filter((layerToAdd: any) => {
          return layerToAdd.getProperties().code == maplayer.id;
        }).length > 0
      ) {
        return;
      }
      if (maplayer.url) {
        if (maplayer.url.indexOf('{x}') > -1 && maplayer.url.indexOf('{y}') > -1 && maplayer.url.indexOf('{z}') > -1) {
          // accept as XYZ layer
          layersToAddToMap_.push(
            OpenlayersBaseLayersUtils.getNewTileLayer({
              visible: false,
              baseLayer: false,
              //label: translateField(maplayer, 'name', locale),
              label: maplayer.layername,
              code: maplayer.id,
              url: maplayer.url,
              sourceType: TileLayerSourceType.XYZ,
              opacity: 1,
            }),
          );
        } else {
          layersToAddToMap_.push(
            OpenlayersBaseLayersUtils.getNewTileLayer({
              visible: false,
              baseLayer: false,
              //label: translateField(maplayer, 'name', locale),
              label: maplayer.layername,
              code: maplayer.id,
              url: maplayer.url,
              sourceType: TileLayerSourceType.WMS,
              opacity: 1,
            }),
          );
        }
      } else {
        layersToAddToMap_.push(
          OpenlayersBaseLayersUtils.getNewTileLayer({
            visible: false,
            baseLayer: false,
            //label: translateField(maplayer, 'name', locale),
            label: maplayer.layername,
            code: maplayer.id,
            url: mainGeoserverWmsUrl + '?layers=geoweb:' + maplayer.layername,
            sourceType: TileLayerSourceType.WMS,
            opacity: 1,
          }),
        );
      }
    });
    setUserLayers(layersToAddToMap_);
  };

  const getLayerNames = (lyrGroups: any): any[] => {
    let res: any[] = [];
    const loopChildren = (node: any) => {
      if (node.layers) {
        node.layers.map((item_: any) => {
          res.push(item_);
        });
      }
      if (node.children) {
        node.children.map((item_: any) => {
          if (!item_.children) res.push(item_);
          if (item_.layers) {
            item_.layers.map((item__: any) => {
              res.push(item__);
            });
          }
          if (item_.children) {
            item_.children.map((innerItem_: any) => {
              loopChildren(innerItem_);
            });
          }
        });
      }
    };
    lyrGroups.forEach((mainTreeNode: any) => {
      if (mainTreeNode.layers) {
        mainTreeNode.layers.map((item_: any) => {
          res.push(item_);
        });
      }
      if (mainTreeNode.children) {
        mainTreeNode.children.map((item_: any) => {
          if (!item_.children) res.push(item_);
          if (item_.children) {
            item_.children.map((innerItem_: any) => {
              loopChildren(innerItem_);
            });
          }
          if (item_.layers) {
            item_.layers.map((innerLayerItem_: any) => {
              res.push(innerLayerItem_);
            });
          }
        });
      }
    });

    return res;
  };

  const loadLyrGroup = async ({ id }: { id: string }, isLastLyrGroup: boolean = false) => {
    return mapOpenAPI
      .getOpenApiRootFoldertreeById(id)
      .then((response: any) => {
        setLyrTree((prevValue: any) => [...prevValue, { ...response.data }]);
        if (isLastLyrGroup) {
          setMapDataLoaded(true);
        }
      })
      .catch((error: any) => {
        console.error('gis api error', error);
      });
  };

  return (
    <div
      className="map gis"
      style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', height: '100vh', minHeight: '100vh' }}
      ref={mapDivRef}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={1}
        sx={{
          position: 'absolute',
          left: 10,
          top: '25%',
          transform: 'translateY(-50%)',
          borderRadius: '10px',
          alignItems: 'flex-end',
          zIndex: 5000,
        }}
      >
        {map && <LeftPanel color="#5ebc67" />}
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={1}
        sx={{
          position: 'absolute',
          right: 10,
          top: '30%',
          transform: 'translateY(-50%)',
          borderRadius: '10px',
          alignItems: 'flex-end',
          zIndex: 5000,
        }}
      >
        {map && (
          <>
            <HomeExtentButton map={map} color="#5ebc67" />
            <MyLocation map={map} color="#5ebc67" />
            <BaseLayersTool map={map} color="#5ebc67" layers={baseLayersArr} />
            <Measurement color="#5ebc67" />
          </>
        )}
      </Box>

      {identifyEventData && <IdentifyPanel />}
      <div
        className=""
        style={{
          position: 'fixed',
          left: '2rem',
          bottom: '4.55rem',
          zIndex: 10000000,
          width: '210px',
          height: '23px',
          padding: '3px 25px',
          background: '#5ebc67',
          color: 'white',
          fontSize: '12px',
          borderRadius: '16px',
        }}
      >
        {mapMouseOverCoord}
      </div>
    </div>
  );
};

export default MapComponent;
