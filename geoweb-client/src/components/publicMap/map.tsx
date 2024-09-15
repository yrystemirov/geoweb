import 'ol/ol.css';
import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import './map.css';
import { Box} from '@mui/material';
import { HomeExtentButton } from '../common/mapTools/HomeExtentButton';
import MyLocation from '../common/mapTools/MyLocation';
import { usePublicMapStore } from '../../hooks/usePublicMapStore';
import Measurement from './tools/measurement';

const MapComponent = () => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const { map, setMap, mapMode } = usePublicMapStore();

  useEffect(() => {
    if (!mapDivRef.current) return;

    const mapObj = new Map({
      view: new View({
        center: [7739532.205446683, 6290648.115801078],
        zoom: 5.15,
      }),
      layers: [new Tile({ source: new OSM() })],
    });

    mapObj.setTarget(mapDivRef.current);

    setMap(mapObj);

    return () => {
      mapObj.setTarget('');
      setMap(null);
    };
  }, []);

  return (
    <div
      className="map"
      style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', height: '100vh', minHeight: '100vh' }}
      ref={mapDivRef}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={1}
        sx={{
          position: 'absolute',
          right: 10,
          top: '20%',
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
            <Measurement map={map} color="#5ebc67" mapMode={mapMode} />
          </>
        )}
      </Box>
    </div>
  );
};

export default MapComponent;