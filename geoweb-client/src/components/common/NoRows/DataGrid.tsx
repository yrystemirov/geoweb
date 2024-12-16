import { Box, Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  text?: string;
}

const CustomNoRowsOverlay: FC<Props> = ({ text }) => {
  const { t } = useTranslation();

  return (
    <GridOverlay>
      <Box sx={{ margin: '0 auto' }}>
        <Typography variant="body2">{text || t('noData')}</Typography>
      </Box>
    </GridOverlay>
  );
};

export default CustomNoRowsOverlay;