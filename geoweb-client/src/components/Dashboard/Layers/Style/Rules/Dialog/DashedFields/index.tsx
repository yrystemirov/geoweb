import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LineFormDataType } from '../LineForm';
import { PolygonFormDataType } from '../PolygonForm';

type Props = {
  methods: UseFormReturn<LineFormDataType | PolygonFormDataType>;
};

export const DashedFields: FC<Props> = ({ methods }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" gap={2}>
      <TextField
        margin="dense"
        {...methods.register('strokeDashLength')}
        label={t('styleRules.strokeDashLength')}
        variant="outlined"
        fullWidth
        error={!!methods.formState.errors.strokeDashLength}
        helperText={methods.formState.errors.strokeDashLength?.message}
        type="number"
        slotProps={{
          input: {
            inputProps: {
              min: 0,
            },
          },
        }}
      />
      <TextField
        margin="dense"
        {...methods.register('strokeSpaceLength')}
        label={t('styleRules.strokeSpaceLength')}
        variant="outlined"
        fullWidth
        error={!!methods.formState.errors.strokeSpaceLength}
        helperText={methods.formState.errors.strokeSpaceLength?.message}
        type="number"
        slotProps={{
          input: {
            inputProps: {
              min: 0,
            },
          },
        }}
      />
    </Box>
  );
};
