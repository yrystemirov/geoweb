import 'ol/ol.css';
import { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import "./map.css";
import React from 'react';



const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapObj = new Map({
      view: new View({
        center: [7739532.205446683, 6290648.115801078],
        zoom: 5.15,
      }),
      layers: [new Tile({ source: new OSM() })],
    });

    mapObj.setTarget(mapRef.current);

    return () => mapObj.setTarget('');
  }, []);

  return (<div className="map" style={{ position: 'absolute',top: 0, bottom: 0, width: '100%',height:'100vh', minHeight:"100vh" }} ref={mapRef}></div>);
};

export default MapComponent;