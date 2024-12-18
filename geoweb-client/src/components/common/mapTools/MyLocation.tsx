import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { MyLocation as MyLocationIcon } from '@mui/icons-material';
import { Feature, Map } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Fill, Style, Text } from 'ol/style';
import { FC, useEffect, useState } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Coords = {
  longitude: number;
  latitude: number;
};

interface Props {
  map?: Map;
  color?: any;
}

const MyLocation: FC<Props> = ({ map, color }) => {
  const [temporaryLayer, setTemporaryLayer] = useState<any>(null);
  const [locating, setLocating] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const temporaryLayer = new VectorLayer({
      source: new VectorSource(),
    });
    map?.addLayer(temporaryLayer);
    setTemporaryLayer(temporaryLayer);

    return () => {
      map?.removeLayer(temporaryLayer);
    };
  }, [map]);

  const handleButtonClick = async () => {
    try {
      setLocating(true);
      const location = await findLocation();
      insertMarker(location);
    } catch (ex) {
      const e = ex as { code: number; message: string };
      console.error(e);
      setLocating(false);
      const withoutCode = !('code' in e);

      if (withoutCode) {
        toast.error(t('myLocationError'));
        return;
      }

      switch (e.code) {
        case 3:
          toast.error(e.message || t('myLocationTimeout'));
          break;
        case 1000:
          toast.error(e.message || t('myLocationGeoNotSupported'));
          break;
        default:
          toast.error(e?.message || t('myLocationError'));
          break;
      }
    }
  };

  const insertMarker = (location: Coords) => {
    const { longitude, latitude } = location;

    const pointFeature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });
    temporaryLayer.getSource().clear();
    temporaryLayer.getSource().addFeature(pointFeature);
    const style = new Style({
      text: new Text({
        text: '📍',
        font: '24px sans-serif',
        fill: new Fill({ color: 'red' }),
        offsetY: -12, // Смещение по оси Y для выравнивания метки
      }),
    });
    pointFeature.setStyle(style);
    map?.getView().setCenter(fromLonLat([longitude, latitude]));
    setLocating(false);

    setTimeout(() => {
      temporaryLayer.getSource().clear();
    }, 5000);
  };

  const findLocation = () => {
    return new Promise<Coords>((resolve, reject) => {
      const positionOption = { enableHighAccuracy: true, timeout: 5000, maximumAge: 5000 };
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
            reject(error);
          },
          positionOption,
        );
      } else {
        throw { message: 'Navigator does not support geolocation', code: 1000 };
      }
    });
  };

  return (
    <>
      <Tooltip title={t('myLocationTitle')} placement="left">
        <IconButton
          style={{
            background: color,
            borderRadius: 0,
          }}
          onClick={handleButtonClick}
          sx={{ color: 'white' }}
          disabled={locating}
        >
          {locating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <MyLocationIcon />}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default MyLocation;
