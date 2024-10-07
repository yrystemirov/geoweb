import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import { get as projGet, transformExtent } from 'ol/proj';
import { ImageWMS, TileWMS, ImageArcGISRest } from 'ol/source';
///import { getBottomLeft } from 'ol/extent';
import VectorLayer from 'ol/layer/Vector';
import { Image as ImageLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
//import { TileArcGISRest } from 'ol/source';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TopoJSON from 'ol/format/TopoJSON';
//import { Map } from 'ol';
///import { Coordinate } from 'ol/coordinate';
//import { Type } from 'ol/geom/Geometry';
//import { GeometryType } from '../mainMap/editMap/types';

export enum TileLayerSourceType {
  XYZ,
  WMS,
  OSM,
}
export interface TileWmsOptions {
  url: string;
  layers: string | null;
  projection: string | null;
  serverType: string;
}
export interface TileLayerProps {
  visible: boolean;
  baseLayer: boolean;
  label?: string | null;
  code: string | null;
  url: string;
  opacity: number | null;
  sourceType: TileLayerSourceType;
  geoserverLayerName?: string;
  systemLayerProps?: any;
}

export default class OpenlayersBaseLayersUtils {
  private static parseWmsUrl(url: string): TileWmsOptions {
    let urlParts = url.split('?');
    if (urlParts.length == 1) {
      throw new Error(`invalid wms url: ${url}`);
    }
    const _params = new URLSearchParams(urlParts[1]);
    if (!_params.get('layers')) {
      throw new Error(`invalid wms url, layers name: ${url}`);
    }
    return {
      url: urlParts[0],
      layers: _params.get('layers'),
      projection: _params.get('srs') ? _params.get('srs') : 'EPSG:3857',
      serverType: 'geoserver',
    };
  }

  public static getTileWmsSource(props: TileWmsOptions): TileWMS {
    const _proj = projGet(props.projection ? props.projection : 'EPSG:3857')?.getExtent();
    return new TileWMS({
      url: props.url,
      params: {
        LAYERS: props.layers,
        TILED: true,
        //tilesOrigin: _proj ? getBottomLeft(_proj).toString() : null,
      },
      // serverType: 'geoserver',
      // crossOrigin: 'anonymous',
      //projection: props.projection ? props.projection : 'EPSG:3857',
    });
  }
  // @ts-ignore
  public static getNewTileLayer(props: TileLayerProps): TileLayer {
    let source = null;
    if (props.sourceType == TileLayerSourceType.XYZ) {
      source = new XYZ({
        url: props.url,
      });
    } else if (props.sourceType == TileLayerSourceType.WMS) {
      let wmsProps = this.parseWmsUrl(props.url);
      source = this.getTileWmsSource(wmsProps);
    } else if (props.sourceType == TileLayerSourceType.OSM) {
      source = new OSM();
    } else {
      throw new Error(`Invalid source`);
    }
    return new TileLayer({
      visible: props.visible,
      properties: {
        base_layer: props.baseLayer,
        label: props.label,
        code: props.code,
        geoserverLayerName: props.geoserverLayerName,
        systemLayerProps:props.systemLayerProps,
      },
      source: source,
      opacity: props.opacity ? props.opacity : 1,
    });
  }

  public static getSingleTileLayer(props: TileLayerProps): any {
    let wmsProps = this.parseWmsUrl(props.url);
    return new ImageLayer({
      source: new ImageWMS({
        url: wmsProps.url,
        params: { LAYERS: wmsProps.layers },
        ratio: 1,
        serverType: 'geoserver',
      }),
    });
  }

  static doSomethingElse(val: string) {
    return val;
  }

  public static getBaseLayerOsm(visible: boolean = false) {
    return this.getNewTileLayer({
      visible: visible,
      baseLayer: true,
      label: 'OSM',
      code: 'osm',
      url: 'none',
      sourceType: TileLayerSourceType.OSM,
      opacity: 1,
    });
  }

  public static getBaseLayerArcgisLabels(visible: boolean = false): TileLayer {
    return this.getNewTileLayer({
      visible: visible,
      baseLayer: true,
      label: 'Дороги',
      code: 'base_layer_arcgis_labels',
      url: 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      sourceType: TileLayerSourceType.XYZ,
      opacity: 1,
    });
  }

  public static getBaseLayerArcgisSattelite(visible: boolean = false): TileLayer {
    return this.getNewTileLayer({
      visible: visible,
      baseLayer: true,
      label: 'Спутник',
      code: 'base_layer_arcgis',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      sourceType: TileLayerSourceType.XYZ,
      opacity: 1,
    });
  }

  public static getBaseLayerWasteOpenBaseMap = (visible: boolean = false) => {
    // return new TileLayer({
    //     visible: visible,
    //     properties: {
    //         base_layer: true,
    //         label: 'Qazaqstan',
    //         code: 'Qazaqstan',
    //     },
    //     source: new TileArcGISRest({
    //         url: 'https://arcgis.gharysh.kz/server/rest/services/Bazovye_sloi/Bazovye_sloi/MapServer',
    //     }),
    // });
    return new ImageLayer({
      visible: visible,
      properties: {
        base_layer: true,
        label: 'gis:gis.Qazaqstan',
        code: 'Qazaqstan',
      },
      source: new ImageArcGISRest({
        ratio: 1,
        params: {},
        url: 'https://arcgis.gharysh.kz/server/rest/services/Bazovye_sloi/Bazovye_sloi/MapServer',
      }),
    });
  };

  public static getNatGeoWildPBFLayer = (visible?: boolean) => {
    return new VectorTileLayer({
      declutter: true,
      visible: visible,
      properties: {
        base_layer: true,
        label: 'National Geographic',
        code: 'national_geographic',
      },
      source: new VectorTileSource({
        format: new MVT(),
        url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{x}/{y}/{z}.pbf',
      }),
    });
  };

  public static getWorlCountries = (visible: boolean = false) => {
    return new VectorLayer({
      visible: visible,
      properties: {
        base_layer: true,
        label: 'gis:gis.world_countries',
        code: 'World_Countries',
      },
      source: new VectorSource({
        url: 'https://openlayers.org/en/latest/examples/data/topojson/world-110m.json',
        format: new TopoJSON({
          layers: ['countries'],
        }),
        overlaps: false,
      }),
      //@ts-ignore
      style: function (feature: any) {
        if (feature.getGeometry().intersectsCoordinate([7141452.615532791, 6416327.106730494])) {
          return null;
        }
        return new Style({
          fill: new Fill({
            color: '#ffffff',
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 1,
          }),
        });
      },
    });
  };

  public static getWorldOceanMapArcGis = (visible: boolean = false) => {
    return this.getNewTileLayer({
      visible: visible,
      baseLayer: true,
      label: 'gis:gis.world_ocean',
      code: 'World_Ocean',
      url: 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      sourceType: TileLayerSourceType.XYZ,
      opacity: 1,
    });
  };

  public static getNatGeoWildXYZLayer(visible: boolean = false): TileLayer {
    return this.getNewTileLayer({
      visible: visible,
      baseLayer: true,
      label: 'National Geographic',
      code: 'nat_geo_wild_xyz',
      url: 'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/NatGeoStyleBase/MapServer/tile/{z}/{y}/{x}',
      sourceType: TileLayerSourceType.XYZ,
      opacity: 1,
    });
  }

  public static getDefaultVectorLayer = (
    visible: boolean,
    layerCode: string,
    fillColor?: string,
    strokeColor?: string,
  ) => {
    return new VectorLayer({
      visible: visible,
      properties: {
        code: layerCode,
      },
      source: new VectorSource(),
      zIndex: 99999,
      style: new Style({
        fill: new Fill({
          color: fillColor ? fillColor : 'rgba(255, 101, 101, 0.2)',
        }),
        stroke: new Stroke({
          color: strokeColor ? strokeColor : 'rgba(255, 101, 101, 0.7)',
          width: 4,
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: 'rgba(255, 101, 101, 0.2)',
          }),
          stroke: new Stroke({
            color: 'rgba(255, 101, 101, 0.7)',
            width: 3,
          }),
        }),
      }),
    });
  };
}
