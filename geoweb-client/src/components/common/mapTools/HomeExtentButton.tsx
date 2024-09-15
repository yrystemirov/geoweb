import { IconButton, Tooltip} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { useTranslation } from 'react-i18next';
import { Map } from 'ol';
import { CSSProperties, FC } from 'react';

type Props = {
  map: Map;
  color?: CSSProperties['background'];
};

export const HomeExtentButton: FC<Props> = ({ map, color }) => {
  const { t } = useTranslation();

  const handleButtonClick = () => {
    if (map) {
      let zoom = 5.15;
      let center = [7739532.205446683, 6290648.115801078];
      map.getView()?.setZoom(zoom);
      map.getView()?.setCenter(center);
    }
  };

  return (
    <>
      <Tooltip title={t('main_extent')} placement="left">
        <IconButton
          style={{
            background: color ? color : 'rgb(64 152 68 / 70%)',
            borderRadius: 0,
          }}
          onClick={handleButtonClick}
          sx={{ color: 'white' }}
        >
          <PublicIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};