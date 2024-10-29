import { FC, useMemo, useState } from 'react';
import { LayerDto } from '../../../../api/types/mapFolders';
import { useTranslatedProp } from '../../../../hooks/useTranslatedProp';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

const legendUrlPrefix =
  'http://77.240.39.93:8082/geoserver/geoweb/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=geoweb:';

export const LegendImage: FC<{ layer: LayerDto }> = ({ layer }) => {
  const nameProp = useTranslatedProp('name');
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [isError, setIsError] = useState(false);
  const languageParam = useMemo(() => {
    switch (language) {
      case 'kk':
        return 'ita';
      case 'ru':
        return 'eng';
      default:
        return '';
    }
  }, [language]);

  if (isError) {
    return (
      <Typography color={'error'} variant={'body2'}>
        {t('layerPanel.legendIsUnavailable')}
      </Typography>
    );
  }

  return (
    <img
      src={`${legendUrlPrefix}${layer.layername}&LANGUAGE=${languageParam}`}
      alt={layer[nameProp]}
      onError={() => setIsError(true)}
      style={{ maxWidth: '45vw', maxHeight: '45vh' }}
    />
  );
};
