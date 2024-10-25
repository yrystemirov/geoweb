import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleRule } from '../../../../../../../api/types/style';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Slider, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, number, object, string } from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { layersAPI } from '../../../../../../../api/layer';
import { useTranslatedProp } from '../../../../../../../hooks/useTranslatedProp';

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

  useEffect(() => {
    methods.reset();
  }, [methods]);

  console.log('errors', methods.formState.errors);

  return (
    <Box
      component={'form'}
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: 500 }}
      onSubmit={methods.handleSubmit(onSubmit)}
      noValidate
    >
      <TextField
        margin="dense"
        {...methods.register('name')}
        label={t('name')}
        variant="outlined"
        fullWidth
        error={!!methods.formState.errors.name}
        helperText={methods.formState.errors.name?.message}
        required
      />
      <Box display="flex" gap={2} sx={{ width: '50%' }}>
        <TextField
          margin="dense"
          {...methods.register('scaleMin')}
          label={t('scaleMin')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.scaleMin}
          helperText={methods.formState.errors.scaleMin?.message}
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
          {...methods.register('scaleMax')}
          label={t('scaleMax')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.scaleMax}
          helperText={methods.formState.errors.scaleMax?.message}
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
        <Typography>{t('fillColor')}</Typography>
        <TextField
          margin="dense"
          {...methods.register('fillColor')}
          variant="outlined"
          error={!!methods.formState.errors.fillColor}
          helperText={methods.formState.errors.fillColor?.message}
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
                    opacity: methods.watch('fillColorOpacity'),
                  },
                },
              },
            },
          }}
          required
        />
        <Controller
          name="fillColorOpacity"
          control={methods.control}
          render={({ field }) => (
            <Slider {...field} min={0} max={1} step={0.01} valueLabelDisplay="auto" sx={{ mr: 2, width: '100px' }} />
          )}
        />
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          margin="dense"
          {...methods.register('pointShape')}
          label={t('pointShape')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.pointShape}
          helperText={methods.formState.errors.pointShape?.message}
          select
          value={methods.watch('pointShape')}
        >
          {Object.values(StyleRule.PointShape).map((shape) => (
            <MenuItem key={shape} value={shape}>
              {t(`styles.pointShapes.${shape}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          {...methods.register('pointRadius')}
          label={t('pointRadius')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.pointRadius}
          helperText={methods.formState.errors.pointRadius?.message}
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
          {...methods.register('imgFormat')}
          label={t('imgFormat')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.imgFormat}
          helperText={methods.formState.errors.imgFormat?.message}
        />
        <TextField
          margin="dense"
          {...methods.register('imgSrc')}
          label={t('imgSrc')}
          variant="outlined"
          fullWidth
          error={!!methods.formState.errors.imgSrc}
          helperText={methods.formState.errors.imgSrc?.message}
        />
      </Box>
      <Box
        sx={
          methods.watch('hasTextSymbolizer')
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
          control={
            <Checkbox {...methods.register('hasTextSymbolizer')} defaultChecked={methods.watch('hasTextSymbolizer')} />
          }
          label={t('hasTextSymbolizer')}
        />
        {methods.watch('hasTextSymbolizer') && (
          <Box display="flex" gap={1} flexDirection="column">
            <TextField
              margin="dense"
              {...methods.register('textSymbolizerAttrName')}
              label={t('textSymbolizerAttrName')}
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
              {/* if no attrs */}
              {attrs.length === 0 && <MenuItem disabled>{t('noData')}</MenuItem>}
            </TextField>
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                {...methods.register('textSymbolizerDisplacementX')}
                label={t('textSymbolizerDisplacementX')}
                variant="outlined"
                //   fullWidth
                error={!!methods.formState.errors.textSymbolizerDisplacementX}
                helperText={methods.formState.errors.textSymbolizerDisplacementX?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('textSymbolizerDisplacementY')}
                label={t('textSymbolizerDisplacementY')}
                variant="outlined"
                //   fullWidth
                error={!!methods.formState.errors.textSymbolizerDisplacementY}
                helperText={methods.formState.errors.textSymbolizerDisplacementY?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('textSymbolizerRotation')}
                label={t('textSymbolizerRotation')}
                variant="outlined"
                //   fullWidth
                error={!!methods.formState.errors.textSymbolizerRotation}
                helperText={methods.formState.errors.textSymbolizerRotation?.message}
                type="number"
              />
            </Box>
            <Box display="flex" gap={2} alignItems={'center'}>
              <Typography>{t('textSymbolizerFillColor')}</Typography>
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
                {...methods.register('anchorpointX')}
                label={t('anchorpointX')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.anchorpointX}
                helperText={methods.formState.errors.anchorpointX?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('anchorpointY')}
                label={t('anchorpointY')}
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
                label={t('fontFamily')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.fontFamily}
                helperText={methods.formState.errors.fontFamily?.message}
              />
              <TextField
                margin="dense"
                {...methods.register('fontSize')}
                label={t('fontSize')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.fontSize}
                helperText={methods.formState.errors.fontSize?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('fontStyle')}
                label={t('fontStyle')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.fontStyle}
                helperText={methods.formState.errors.fontStyle?.message}
              />
              <TextField
                margin="dense"
                {...methods.register('fontWeight')}
                label={t('fontWeight')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.fontWeight}
                helperText={methods.formState.errors.fontWeight?.message}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={
          methods.watch('cluster')
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
          control={<Checkbox {...methods.register('cluster')} defaultChecked={methods.watch('cluster')} />}
          label={t('cluster')}
        />

        {methods.watch('cluster') && (
          <Box display="flex" gap={1} flexDirection="column">
            <TextField
              margin="dense"
              {...methods.register('clusterTitle')}
              label={t('clusterTitle')}
              variant="outlined"
              fullWidth
              error={!!methods.formState.errors.clusterTitle}
              helperText={methods.formState.errors.clusterTitle?.message}
            />
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                {...methods.register('clusterGreaterThanOrEqual')}
                label={t('clusterGreaterThanOrEqual')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterGreaterThanOrEqual}
                helperText={methods.formState.errors.clusterGreaterThanOrEqual?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('clusterLessThanOrEqual')}
                label={t('clusterLessThanOrEqual')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterLessThanOrEqual}
                helperText={methods.formState.errors.clusterLessThanOrEqual?.message}
                type="number"
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                {...methods.register('clusterPointSize')}
                label={t('clusterPointSize')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterPointSize}
                helperText={methods.formState.errors.clusterPointSize?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('clusterTextType')}
                label={t('clusterTextType')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterTextType}
                helperText={methods.formState.errors.clusterTextType?.message}
              />
              <TextField
                margin="dense"
                {...methods.register('clusterTextSize')}
                label={t('clusterTextSize')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterTextSize}
                helperText={methods.formState.errors.clusterTextSize?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('clusterTextWeight')}
                label={t('clusterTextWeight')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterTextWeight}
                helperText={methods.formState.errors.clusterTextWeight?.message}
              />
            </Box>
            <Box display="flex" gap={2} alignItems={'center'}>
              <Typography>{t('clusterTextColor')}</Typography>
              <TextField
                margin="dense"
                {...methods.register('clusterTextColor')}
                variant="outlined"
                error={!!methods.formState.errors.clusterTextColor}
                helperText={methods.formState.errors.clusterTextColor?.message}
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
                          opacity: methods.watch('clusterTextColorOpacity'),
                        },
                      },
                    },
                  },
                }}
              />
              <Controller
                name="clusterTextColorOpacity"
                control={methods.control}
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
                {...methods.register('clusterAnchorPointX')}
                label={t('clusterAnchorPointX')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterAnchorPointX}
                helperText={methods.formState.errors.clusterAnchorPointX?.message}
                type="number"
              />
              <TextField
                margin="dense"
                {...methods.register('clusterAnchorPointY')}
                label={t('clusterAnchorPointY')}
                variant="outlined"
                fullWidth
                error={!!methods.formState.errors.clusterAnchorPointY}
                helperText={methods.formState.errors.clusterAnchorPointY?.message}
                type="number"
              />
            </Box>
            <Box display="flex" gap={2} alignItems={'center'}>
              <Typography>{t('clusterTextHalo')}</Typography>
              <TextField
                margin="dense"
                {...methods.register('clusterTextHaloFillColor')}
                label={t('clusterTextHaloFillColor')}
                variant="outlined"
                error={!!methods.formState.errors.clusterTextHaloFillColor}
                helperText={methods.formState.errors.clusterTextHaloFillColor?.message}
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
                          opacity: methods.watch('clusterTextHaloFillOpacityWeight'),
                        },
                      },
                    },
                  },
                }}
              />
              <Controller
                name="clusterTextHaloFillOpacityWeight"
                control={methods.control}
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
                {...methods.register('clusterTextHaloRadius')}
                label={t('clusterTextHaloRadius')}
                variant="outlined"
                error={!!methods.formState.errors.clusterTextHaloRadius}
                helperText={methods.formState.errors.clusterTextHaloRadius?.message}
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