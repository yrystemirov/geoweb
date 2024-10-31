import { Geometry } from 'ol/geom';
import { WKT } from 'ol/format';
import { Map } from 'ol';
import { Extent } from 'ol/extent';
import { mapConstants } from '../../constants';

interface SetExtentOptions {
  map: Map;
  geometry: Geometry;
  duration?: number;
  maxZoom?: number;
  padding?: number;
}

export const convertWktToGeometry = (wkt: string): Geometry => {
  const wktFormat = new WKT();
  const geometry: Geometry = wktFormat.readGeometry(wkt);
  return geometry;
};

export const fitExtentToGeometryWithAnimation = ({
  map,
  geometry,
  duration = mapConstants.duration,
  maxZoom = mapConstants.maxZoom,
  padding = 0,
}: SetExtentOptions) => {
  fitExtentWithAnimation({ map, extent: geometry.getExtent(), duration, maxZoom, padding });
};

export const fitExtentWithAnimation = ({
  // TODO: remove one of methods and use only one
  map,
  extent,
  duration = mapConstants.duration,
  maxZoom = mapConstants.maxZoom,
  padding = 0,
}: Omit<SetExtentOptions, 'geometry'> & { extent: Extent }) => {
  map.getView().fit(extent, { maxZoom, padding: Array(4).fill(padding), duration });
};

