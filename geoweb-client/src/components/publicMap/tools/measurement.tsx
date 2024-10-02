import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Map, Feature, Overlay } from 'ol';
import { Draw, Snap } from 'ol/interaction';
import { LineString, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, Text } from 'ol/style';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Cancel, SquareFoot, Straighten } from '@mui/icons-material';
import { Type } from 'ol/geom/Geometry';
import CircleStyle from 'ol/style/Circle';
import { useTranslation } from 'react-i18next';
import { usePublicMapStore } from '../../../hooks/usePublicMapStore';
import { MapMode } from '../../../hooks/usePublicMapStore';
interface Props {
  //map: Map;
  color?: CSSProperties['background'];
  //mapMode?: MapMode;
  //setMapMode: (mapMode: MapMode) => void;
}

const Measurement: React.FC<Props> = ({  color }) => {
  const { map,  mapMode, setMapMode } = usePublicMapStore();
  const vectorRef = useRef<any>(null);
  const sketchRef = useRef<Feature | null>(null);
  const drawRef = useRef<Draw | null>(null);
  const snapRef = useRef<Snap | null>(null);
  const measureTooltipRef = useRef<Overlay | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState<Type>('Polygon');
  const { t } = useTranslation();

  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: (f) =>
        new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2,
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)',
          }),
          text: new Text({
            text:
              f.getGeometry()!.getType() === 'LineString'
                ? formatLength(f.getGeometry() as LineString)
                : formatArea(f.getGeometry() as Polygon),
            font: 'bold 10px sans-serif',
            fill: new Fill({
              color: 'red',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3,
            }),
            offsetX: 0,
            offsetY: -15,
            textAlign: 'center',
          }),
        }),
    });
    vectorRef.current = vectorLayer;
    vectorLayer.set('name', 'measureVector');
    map?.addLayer(vectorLayer);

    return () => {
      map?.removeLayer(vectorLayer);
    };
  }, [map]);

  useEffect(() => {
    if (isActive) {
      addInteraction();
      setMapMode(MapMode.EDIT);
    } else {
      clearInteraction();
      vectorRef.current!.getSource().clear();
      setMapMode(MapMode.IDENTIFY);
    }
  }, [isActive]);

  useEffect(() => {
    if (drawRef.current) {
      clearInteraction();
      addInteraction();
    }
  }, [mode]);

  const addInteraction = () => {
    if (drawRef.current) {
      map?.removeInteraction(drawRef.current);
    }
    if (snapRef.current) {
      map?.removeInteraction(snapRef.current);
    }

    const draw = new Draw({
      source: vectorRef.current!.getSource(),
      type: mode,
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)',
        }),
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)',
          }),
          stroke: new Stroke({
            color: 'red',
            width: 2,
          }),
        }),
      }),
    });
    drawRef.current = draw;
    draw.set('name', 'measureDraw');
    map?.addInteraction(draw);
    draw.on('drawstart', drawStartHandler);
    draw.on('drawend', drawEndHandler);

    const snap = new Snap({
      source: vectorRef.current!.getSource(),
    });
    snapRef.current = snap;
    snap.set('name', 'measureSnap');
    map?.addInteraction(snap);
  };

  const clearInteraction = () => {
    if (drawRef.current) {
      map?.removeInteraction(drawRef.current);
      drawRef.current = null;
    }
    if (snapRef.current) {
      map?.removeInteraction(snapRef.current);
      snapRef.current = null;
    }
  };

  const drawStartHandler = (event: any) => {
    createMeasureTooltip();

    const sketch = event.feature;
    let tooltipCoord = event.coordinate;
    map!.getTargetElement().style.cursor = 'none';

    sketchRef.current = sketch;
    sketch.getGeometry().on('change', (e: any) => {
      const geometry = e.target;
      let output = '';
      let tooltipCoord: any[] = [];
      if (geometry instanceof Polygon) {
        output = formatArea(geometry);
        tooltipCoord = geometry.getInteriorPoint().getCoordinates();
      } else if (geometry instanceof LineString) {
        output = formatLength(geometry);
        tooltipCoord = geometry.getLastCoordinate();
      }
      measureTooltipRef.current!.getElement()!.innerHTML = output;
      measureTooltipRef.current!.setPosition(tooltipCoord);
    });
  };

  const drawEndHandler = (event: any) => {
    console.log(mapMode);
    setTimeout(() => {
      drawRef.current!.setActive(true);
    }, 1000);
    drawRef.current!.setActive(false);

    measureTooltipRef.current!.getElement()!.className = 'tooltip tooltip-static';
    map!.getTargetElement().style.cursor = '';

    sketchRef.current = null;
    createMeasureTooltip();
  };

  const createMeasureTooltip = () => {
    if (measureTooltipRef.current) {
      map!.removeOverlay(measureTooltipRef.current);
    }

    const measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltipRef.current = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
    });
    measureTooltipRef.current.set('name', 'measureOverlay');
    map?.addOverlay(measureTooltipRef.current);
  };

  const formatLength = (line: LineString): string => {
    const length = line.getLength();
    const output = length > 1000 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`;
    return output;
  };

  const formatArea = (polygon: Polygon): string => {
    const area = polygon.getArea();
    const output = area > 10000 ? `${(area / 1000000).toFixed(2)} km²` : `${area.toFixed(2)} m²`;
    return output;
  };

  return (
    <>
      <IconButton
        //disabled={mapMode == MapMode.EDIT}
        style={{
          background: color ? color : 'rgb(64 152 68 / 70%)',
          borderRadius: 0,
        }}
        sx={{ color: 'white' }}
        onClick={(e) => {
          setAnchorElUser(e.currentTarget);
        }}
      >
        {mode === 'LineString' ? <Straighten /> : <SquareFoot />}
      </IconButton>
      <Menu
        onClose={() => setAnchorElUser(null)}
        keepMounted
        open={Boolean(anchorElUser)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        anchorEl={anchorElUser}
      >
        <MenuItem
          onClick={(e) => {
            setMode('Polygon');
            setAnchorElUser(null);
            setIsActive(true);
          }}
        >
          <SquareFoot />
          &nbsp; {t('measurement.square')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMode('LineString');
            setAnchorElUser(null);
            setIsActive(true);
          }}
        >
          <Straighten />
          &nbsp; {t('measurement.length')}
        </MenuItem>
        {isActive && (
          <MenuItem
            color="warning"
            onClick={() => {
              setAnchorElUser(null);
              setIsActive(false);
            }}
          >
            <Cancel color="warning" />
            &nbsp; {t('complete')}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Measurement;