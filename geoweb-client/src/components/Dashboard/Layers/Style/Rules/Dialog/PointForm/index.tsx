import { FC, useEffect } from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { StyleRule } from '../../../../../../../api/types/style';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Slider, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, number, object, string } from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { layersAPI } from '../../../../../../../api/layer';
import { useTranslatedProp } from '../../../../../../../hooks/useTranslatedProp';
import { TextSymbolizerFields } from '../TextSymbolizerFields';
import { LineFormDataType } from '../LineForm';

export type PointFormDataType = StyleRule.Point &
  StyleRule.Common &
  StyleRule.TextSymbolizer &
  StyleRule.Cluster &
  StyleRule.Filter;

type Props = {
  onSubmit: (data: PointFormDataType) => void;
  onClose: () => void;
  editData?: PointFormDataType;
};

const DEFAULT_VALUES: Partial<PointFormDataType> = {
  fillColorOpacity: 1,
  textSymbolizerFillColorOpacity: 1,
  clusterTextColorOpacity: 1,
  clusterTextHaloFillOpacityWeight: 1,
};

export const PointForm: FC<Props> = ({ editData, onSubmit, onClose }) => {
  const { layerId } = useParams();
  const { t } = useTranslation();
  const nameProp = useTranslatedProp('name');
  const isEdit = !!editData;

  const { data: attrs = [], isLoading: isAttrsLoading } = useQuery({
    queryKey: ['layerAttrs', layerId],
    queryFn: () => layersAPI.getLayerAttrs(layerId!).then((res) => res.data),
    enabled: !!layerId,
  });

  const schema = object<PointFormDataType>({
    name: string().required(t('requiredField')),
    scaleMin: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    scaleMax: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    fillColor: string().required(t('requiredField')),
    fillColorOpacity: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    pointShape: string<StyleRule.PointShape>().nullable(),
    pointRadius: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    imgFormat: string().nullable(),
    imgSrc: string().nullable(),
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
    cluster: boolean(),
    clusterTitle: string().nullable(),
    clusterStrokeColor: string().nullable(),
    clusterStrokeWidth: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterFillColor: string().nullable(),
    clusterGreaterThanOrEqual: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterLessThanOrEqual: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterPointSize: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterTextType: string().nullable(),
    clusterTextSize: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterTextWeight: string().nullable(),
    clusterTextColor: string().nullable(),
    clusterTextColorOpacity: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterAnchorPointX: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterAnchorPointY: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterTextHaloRadius: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    clusterTextHaloFillColor: string().nullable(),
    clusterTextHaloFillOpacityWeight: string().nullable(),
  });

  const methods = useForm<PointFormDataType>({
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
      <Box display="flex" gap={2}>
        <TextField
          margin="dense"
          {...register('pointShape')}
          label={t('styleRules.pointShape')}
          variant="outlined"
          fullWidth
          error={!!errors.pointShape}
          helperText={errors.pointShape?.message}
          select
          value={formValues.pointShape}
        >
          {Object.values(StyleRule.PointShape).map((shape) => (
            <MenuItem key={shape} value={shape}>
              {t(`styleRules.pointShapes.${shape}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          {...register('pointRadius')}
          label={t('styleRules.pointRadius')}
          variant="outlined"
          fullWidth
          error={!!errors.pointRadius}
          helperText={errors.pointRadius?.message}
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
      <Box display="flex" gap={2}>
        <TextField
          margin="dense"
          {...register('imgFormat')}
          label={t('styleRules.imgFormat')}
          variant="outlined"
          fullWidth
          error={!!errors.imgFormat}
          helperText={errors.imgFormat?.message}
        />
        <TextField
          margin="dense"
          {...register('imgSrc')}
          label={t('styleRules.imgSrc')}
          variant="outlined"
          fullWidth
          error={!!errors.imgSrc}
          helperText={errors.imgSrc?.message}
        />
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
            methods={methods as UseFormReturn<LineFormDataType | PointFormDataType>}
            attrs={attrs}
            isAttrsLoading={isAttrsLoading}
            nameProp={nameProp}
          />
        )}
      </Box>
      <Box
        sx={
          formValues.cluster
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
          control={<Checkbox {...register('cluster')} defaultChecked={formValues.cluster} />}
          label={t('styleRules.cluster')}
        />

        {formValues.cluster && (
          <Box display="flex" gap={1} flexDirection="column">
            <TextField
              margin="dense"
              {...register('clusterTitle')}
              label={t('styleRules.clusterTitle')}
              variant="outlined"
              fullWidth
              error={!!errors.clusterTitle}
              helperText={errors.clusterTitle?.message}
            />
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                {...register('clusterGreaterThanOrEqual')}
                label={t('styleRules.clusterGreaterThanOrEqual')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterGreaterThanOrEqual}
                helperText={errors.clusterGreaterThanOrEqual?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...register('clusterLessThanOrEqual')}
                label={t('styleRules.clusterLessThanOrEqual')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterLessThanOrEqual}
                helperText={errors.clusterLessThanOrEqual?.message}
                type="number"
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                {...register('clusterPointSize')}
                label={t('styleRules.clusterPointSize')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterPointSize}
                helperText={errors.clusterPointSize?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...register('clusterTextType')}
                label={t('styleRules.clusterTextType')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterTextType}
                helperText={errors.clusterTextType?.message}
              />
              <TextField
                margin="dense"
                {...register('clusterTextSize')}
                label={t('styleRules.clusterTextSize')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterTextSize}
                helperText={errors.clusterTextSize?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...register('clusterTextWeight')}
                label={t('styleRules.clusterTextWeight')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterTextWeight}
                helperText={errors.clusterTextWeight?.message}
              />
            </Box>
            <Box display="flex" gap={2} alignItems={'center'}>
              <Typography>{t('styleRules.clusterTextColor')}</Typography>
              <TextField
                margin="dense"
                {...register('clusterTextColor')}
                variant="outlined"
                error={!!errors.clusterTextColor}
                helperText={errors.clusterTextColor?.message}
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
                          opacity: formValues.clusterTextColorOpacity,
                        },
                      },
                    },
                  },
                }}
              />
              <Controller
                name="clusterTextColorOpacity"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={1}
                    step={0.01}
                    valueLabelDisplay="auto"
                    sx={{ mr: 2, width: '100px' }}
                  />
                )}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                {...register('clusterAnchorPointX')}
                label={t('styleRules.clusterAnchorPointX')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterAnchorPointX}
                helperText={errors.clusterAnchorPointX?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...register('clusterAnchorPointY')}
                label={t('styleRules.clusterAnchorPointY')}
                variant="outlined"
                fullWidth
                error={!!errors.clusterAnchorPointY}
                helperText={errors.clusterAnchorPointY?.message}
                type="number"
              />
            </Box>
            <Box display="flex" gap={2} alignItems={'center'}>
              <Typography>{t('styleRules.clusterTextHaloFillColor')}</Typography>
              <TextField
                margin="dense"
                {...register('clusterTextHaloFillColor')}
                variant="outlined"
                error={!!errors.clusterTextHaloFillColor}
                helperText={errors.clusterTextHaloFillColor?.message}
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
                          opacity: formValues.clusterTextHaloFillOpacityWeight,
                        },
                      },
                    },
                  },
                }}
              />
              <Controller
                name="clusterTextHaloFillOpacityWeight"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    min={0}
                    max={1}
                    step={0.01}
                    valueLabelDisplay="auto"
                    sx={{ mr: 2, width: '100px' }}
                  />
                )}
              />
              <TextField
                margin="dense"
                {...register('clusterTextHaloRadius')}
                label={t('styleRules.clusterTextHaloRadius')}
                variant="outlined"
                error={!!errors.clusterTextHaloRadius}
                helperText={errors.clusterTextHaloRadius?.message}
                type="number"
              />
            </Box>
          </Box>
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
