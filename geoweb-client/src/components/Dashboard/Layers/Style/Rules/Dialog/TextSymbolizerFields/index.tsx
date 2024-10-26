import { FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Box, MenuItem, Slider, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PointFormDataType } from '../PointForm';
import { LineFormDataType } from '../LineForm';
import { LayerAttrDto } from '../../../../../../../api/types/mapFolders';
import { PolygonFormDataType } from '../PolygonForm';

type Props = {
  methods: UseFormReturn<PointFormDataType | LineFormDataType | PolygonFormDataType>;
  attrs: LayerAttrDto[];
  isAttrsLoading: boolean;
  nameProp: 'nameRu' | 'nameKk' | 'nameEn';
};

export const TextSymbolizerFields: FC<Props> = ({ methods, attrs, isAttrsLoading, nameProp }) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" gap={1} flexDirection="column">
      <TextField
        margin="dense"
        {...methods.register('textSymbolizerAttrName')}
        label={t('styleRules.textSymbolizerAttrName')}
        variant="outlined"
        fullWidth
        error={!!methods.formState.errors.textSymbolizerAttrName}
        helperText={methods.formState.errors.textSymbolizerAttrName?.message}
        select
        value={methods.watch('textSymbolizerAttrName')}
        disabled={isAttrsLoading}
      >
        {attrs.map((attr) => (
          <MenuItem key={attr.id} value={attr.attrname}>
            {attr[nameProp]}
          </MenuItem>
        ))}
        {attrs.length === 0 && <MenuItem disabled>{t('noData')}</MenuItem>}
      </TextField>
      <Box display="flex" gap={2}>
        <TextField
          margin="dense"
          {...methods.register('textSymbolizerDisplacementX')}
          label={t('styleRules.textSymbolizerDisplacementX')}
          variant="outlined"
          error={!!methods.formState.errors.textSymbolizerDisplacementX}
          helperText={methods.formState.errors.textSymbolizerDisplacementX?.message}
          type="number"
        />
        <TextField
          margin="dense"
          {...methods.register('textSymbolizerDisplacementY')}
          label={t('styleRules.textSymbolizerDisplacementY')}
          variant="outlined"
          error={!!methods.formState.errors.textSymbolizerDisplacementY}
          helperText={methods.formState.errors.textSymbolizerDisplacementY?.message}
          type="number"
        />
        <TextField
          margin="dense"
          {...methods.register('textSymbolizerRotation')}
          label={t('styleRules.textSymbolizerRotation')}
          variant="outlined"
          error={!!methods.formState.errors.textSymbolizerRotation}
          helperText={methods.formState.errors.textSymbolizerRotation?.message}
          type="number"
        />
      </Box>
      <Box display="flex" gap={2} alignItems={'center'}>
        <Typography>{t('styleRules.textSymbolizerFillColor')}</Typography>
        <TextField
          margin="dense"
          {...methods.register('textSymbolizerFillColor')}
          variant="outlined"
          error={!!methods.formState.errors.textSymbolizerFillColor}
          helperText={methods.formState.errors.textSymbolizerFillColor?.message}
          type="color"
          sx={{ minWidth: 40 }}
          slotProps={{
            input: {
              inputProps: {
                sx: {
                  padding: 0,
                  width: 40,
                  height: 40,
                  '::-webkit-color-swatch-wrapper': {
                    p: 1,
                    opacity: methods.watch('textSymbolizerFillColorOpacity'),
                  },
                },
              },
            },
          }}
        />
        <Controller
          name="textSymbolizerFillColorOpacity"
          control={methods.control}
          render={({ field }) => (
            <Slider {...field} min={0} max={1} step={0.01} valueLabelDisplay="auto" sx={{ mr: 2, width: '100px' }} />
          )}
        />
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          margin="dense"
          {...methods.register('anchorpointX')}
          label={t('styleRules.anchorpointX')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.anchorpointX}
          helperText={methods.formState.errors.anchorpointX?.message}
          type="number"
        />
        <TextField
          margin="dense"
          {...methods.register('anchorpointY')}
          label={t('styleRules.anchorpointY')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.anchorpointY}
          helperText={methods.formState.errors.anchorpointY?.message}
          type="number"
        />
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          margin="dense"
          {...methods.register('fontFamily')}
          label={t('styleRules.fontFamily')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.fontFamily}
          helperText={methods.formState.errors.fontFamily?.message}
        />
        <TextField
          margin="dense"
          {...methods.register('fontSize')}
          label={t('styleRules.fontSize')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.fontSize}
          helperText={methods.formState.errors.fontSize?.message}
          type="number"
        />
        <TextField
          margin="dense"
          {...methods.register('fontStyle')}
          label={t('styleRules.fontStyle')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.fontStyle}
          helperText={methods.formState.errors.fontStyle?.message}
        />
        <TextField
          margin="dense"
          {...methods.register('fontWeight')}
          label={t('styleRules.fontWeight')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.fontWeight}
          helperText={methods.formState.errors.fontWeight?.message}
        />
      </Box>
    </Box>
  );
};
