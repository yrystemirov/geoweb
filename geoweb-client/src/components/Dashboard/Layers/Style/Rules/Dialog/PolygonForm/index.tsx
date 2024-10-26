import { FC, useEffect } from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { StyleRule } from '../../../../../../../api/types/style';
import { Box, Button, Checkbox, FormControlLabel, Slider, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, number, object, string } from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { layersAPI } from '../../../../../../../api/layer';
import { useTranslatedProp } from '../../../../../../../hooks/useTranslatedProp';
import { DashedFields } from '../DashedFields';
import { LineFormDataType } from '../LineForm';
import { TextSymbolizerFields } from '../TextSymbolizerFields';
import { PointFormDataType } from '../PointForm';

export type PolygonFormDataType = StyleRule.Polygon &
  StyleRule.Common &
  StyleRule.TextSymbolizer &
  StyleRule.Filter &
  StyleRule.Dashed;

type Props = {
  onSubmit: (data: PolygonFormDataType) => void;
  onClose: () => void;
  editData?: PolygonFormDataType;
};

const DEFAULT_VALUES: Partial<PolygonFormDataType> = {
  strokeColorOpacity: 1,
  fillColorOpacity: 1,
  textSymbolizerFillColorOpacity: 1,
  dashed: false,
};

export const PolygonForm: FC<Props> = ({ editData, onSubmit, onClose }) => {
  const { layerId } = useParams();
  const { t } = useTranslation();
  const nameProp = useTranslatedProp('name');
  const isEdit = !!editData;

  const { data: attrs = [], isLoading: isAttrsLoading } = useQuery({
    queryKey: ['layerAttrs', layerId],
    queryFn: () => layersAPI.getLayerAttrs(layerId!).then((res) => res.data),
    enabled: !!layerId,
  });

  const schema = object<PolygonFormDataType>({
    name: string().required(t('requiredField')),
    scaleMin: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    scaleMax: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    strokeColor: string().required(t('requiredField')),
    strokeColorOpacity: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    strokeWidth: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .required(t('requiredField'))
      .min(0, t('minValue', { value: 0 })),
    fillColor: string().required(t('requiredField')),
    fillColorOpacity: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    dashed: boolean(),
    strokeDashLength: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .when('dashed', {
        is: true,
        then: (schema) => schema.required(t('requiredField')).min(0, t('minValue', { value: 0 })),
      }),
    strokeSpaceLength: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .when('dashed', {
        is: true,
        then: (schema) => schema.required(t('requiredField')).min(0, t('minValue', { value: 0 })),
      }),
    hasTextSymbolizer: boolean(),
    textSymbolizerAttrName: string().nullable(),
    textSymbolizerDisplacementX: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable(),
    textSymbolizerDisplacementY: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable(),
    textSymbolizerRotation: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable(),
    textSymbolizerFillColor: string().nullable(),
    textSymbolizerFillColorOpacity: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    anchorpointX: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    anchorpointY: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    fontFamily: string().nullable(),
    fontSize: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    fontStyle: string().nullable(),
    fontWeight: string().nullable(),
  });

  const methods = useForm<PolygonFormDataType>({
    defaultValues: editData || DEFAULT_VALUES,
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    control,
    watch,
  } = methods;

  const formValues = watch();

  useEffect(() => {
    reset();
  }, [methods]);

  return (
    <Box
      component={'form'}
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: 500 }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <TextField
        margin="dense"
        {...register('name')}
        label={t('styleRules.name')}
        variant="outlined"
        fullWidth
        error={!!errors.name}
        helperText={errors.name?.message}
        required
      />
      <Box display="flex" gap={2} sx={{ width: '66%' }}>
        <TextField
          margin="dense"
          {...register('scaleMin')}
          label={t('styleRules.scaleMin')}
          variant="outlined"
          fullWidth
          error={!!errors.scaleMin}
          helperText={errors.scaleMin?.message}
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
          {...register('scaleMax')}
          label={t('styleRules.scaleMax')}
          variant="outlined"
          fullWidth
          error={!!errors.scaleMax}
          helperText={errors.scaleMax?.message}
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
      <Box display="flex" gap={2} alignItems={'center'}>
        <Typography>{t('styleRules.strokeColor')}</Typography>
        <TextField
          margin="dense"
          {...register('strokeColor')}
          variant="outlined"
          error={!!errors.strokeColor}
          helperText={errors.strokeColor?.message}
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
                    opacity: formValues.strokeColorOpacity,
                  },
                },
              },
            },
          }}
          required
        />
        <Controller
          name="strokeColorOpacity"
          control={control}
          render={({ field }) => (
            <Slider {...field} min={0} max={1} step={0.01} valueLabelDisplay="auto" sx={{ mr: 2, width: '100px' }} />
          )}
        />
      </Box>
      <TextField
        margin="dense"
        {...register('strokeWidth')}
        label={t('styleRules.strokeWidth')}
        variant="outlined"
        fullWidth
        error={!!errors.strokeWidth}
        helperText={errors.strokeWidth?.message}
        type="number"
        required
        slotProps={{
          input: {
            inputProps: {
              min: 0,
            },
          },
        }}
      />
      <Box display="flex" gap={2} alignItems={'center'}>
        <Typography>{t('styleRules.fillColor')}</Typography>
        <TextField
          margin="dense"
          {...register('fillColor')}
          variant="outlined"
          error={!!errors.fillColor}
          helperText={errors.fillColor?.message}
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
                    opacity: formValues.fillColorOpacity,
                  },
                },
              },
            },
          }}
          required
        />
        <Controller
          name="fillColorOpacity"
          control={control}
          render={({ field }) => (
            <Slider {...field} min={0} max={1} step={0.01} valueLabelDisplay="auto" sx={{ mr: 2, width: '100px' }} />
          )}
        />
      </Box>
      <Box
        sx={
          formValues.dashed
            ? {
                border: '1px solid #e0e0e0',
                p: 2,
                borderRadius: 1,
                mt: 2,
              }
            : {}
        }
      >
        <FormControlLabel
          control={<Checkbox {...register('dashed')} defaultChecked={formValues.dashed} />}
          label={t('styleRules.dashed')}
        />
        {formValues.dashed && (
          <DashedFields methods={methods as UseFormReturn<PolygonFormDataType | LineFormDataType>} />
        )}
      </Box>
      <Box
        sx={
          formValues.hasTextSymbolizer
            ? {
                border: '1px solid #e0e0e0',
                p: 2,
                borderRadius: 1,
                mt: 2,
              }
            : {}
        }
      >
        <FormControlLabel
          control={<Checkbox {...register('hasTextSymbolizer')} defaultChecked={formValues.hasTextSymbolizer} />}
          label={t('styleRules.hasTextSymbolizer')}
        />
        {formValues.hasTextSymbolizer && (
          <TextSymbolizerFields
            methods={methods as UseFormReturn<PolygonFormDataType | LineFormDataType | PointFormDataType>}
            attrs={attrs}
            isAttrsLoading={isAttrsLoading}
            nameProp={nameProp}
          />
        )}
      </Box>
      <Box display="flex" gap={2} mt={2} justifyContent="flex-end">
        <Button type="button" variant="text" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? t('save') : t('add')}
        </Button>
      </Box>
    </Box>
  );
};
