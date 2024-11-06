import { FC, useEffect } from 'react';
import { Controller, FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { StyleRule } from '../../../../../../../api/types/style';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { boolean, number, object, string } from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { layersAPI } from '../../../../../../../api/layer';
import { useTranslatedProp } from '../../../../../../../hooks/useTranslatedProp';
import { TextSymbolizerFields } from '../TextSymbolizerFields';
import { LineFormDataType } from '../LineForm';
import { FormToggleGroup } from '../../../../../../common/FormToggleGroup';
import { AttachFileOutlined } from '@mui/icons-material';
import { styleAPI } from '../../../../../../../api/style';
import { useNotify } from '../../../../../../../hooks/useNotify';
import { Loader } from '../../../../../../common/Loader';
import { grey } from '@mui/material/colors';

enum IconType {
  SHAPE = 'shape',
  FILE = 'file',
}

export type PointFormDataType = StyleRule.Point &
  StyleRule.Common &
  StyleRule.TextSymbolizer &
  StyleRule.Cluster &
  StyleRule.Filter & {
    iconType?: IconType; // not for API, just for frontend form
  };

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
  iconType: IconType.SHAPE,
};

export const PointForm: FC<Props> = ({ editData, onSubmit, onClose }) => {
  const { showError } = useNotify();
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
    iconType: string<IconType>().nullable(),
    fillColor: string()
      .nullable()
      .test('requiredIfShape', t('requiredField'), function (value, context) {
        return context.parent.iconType === IconType.SHAPE ? !!value : true;
      }),
    fillColorOpacity: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .min(0, t('minValue', { value: 0 })),
    pointShape: string<StyleRule.PointShape>()
      .nullable()
      .test('requiredIfShape', t('requiredField'), function (value, context) {
        return context.parent.iconType === IconType.SHAPE ? !!value : true;
      }),
    pointRadius: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .required(t('requiredField'))
      .min(0, t('minValue', { value: 0 })),
    imgFormat: string()
      .nullable()
      .test('requiredIfFile', t('requiredField'), function (value, context) {
        return context.parent.iconType === IconType.FILE ? !!value : true;
      }),
    imgSrc: string()
      .nullable()
      .test('requiredIfFile', t('requiredField'), function (value, context) {
        return context.parent.iconType === IconType.FILE ? !!value : true;
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
    defaultValues: editData
      ? {
          ...editData,
          fillColorOpacity: editData.fillColorOpacity === null ? 1 : editData.fillColorOpacity,
          iconType: editData.imgSrc ? IconType.FILE : IconType.SHAPE,
        }
      : DEFAULT_VALUES,
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
    setValue,
  } = methods;

  const formValues = watch();

  const uploadIconMutation = useMutation({
    mutationFn: (files: FileList) => styleAPI.uploadIcon(files[0]).then((res) => res.data),
    onSuccess: ({ imgSrc, imgFormat }) => {
      setValue('imgSrc', imgSrc, { shouldValidate: true });
      setValue('imgFormat', imgFormat, { shouldValidate: true });
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const prepareAndSubmit = (data: PointFormDataType) => {
    const preparedData = {
      ...data,
      pointShape: data.iconType === IconType.SHAPE ? data.pointShape : undefined,
      fillColor: data.iconType === IconType.SHAPE ? data.fillColor : undefined,
      fillColorOpacity: data.iconType === IconType.SHAPE ? data.fillColorOpacity : undefined,
      imgSrc: data.iconType === IconType.FILE ? data.imgSrc : undefined,
      imgFormat: data.iconType === IconType.FILE ? data.imgFormat : undefined,
    };
    delete preparedData.iconType;
    onSubmit(preparedData as PointFormDataType);
  };

  useEffect(() => {
    reset();
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <Box
        component={'form'}
        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: 500 }}
        onSubmit={handleSubmit(prepareAndSubmit)}
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
        <Box display="flex" gap={2}>
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
        <Box
          sx={{
            border: `1px solid ${grey[300]}`,
            p: 2,
            borderRadius: 1,
            mt: 2,
          }}
        >
          {uploadIconMutation.isPending && <Loader />}
          <FormToggleGroup
            required
            disabled={uploadIconMutation.isPending}
            sx={{ my: 1 }}
            label={t('styleRules.iconType.title')}
            name="iconType"
            options={[
              { value: IconType.SHAPE, label: t('styleRules.iconType.shape') },
              { value: IconType.FILE, label: t('styleRules.iconType.file') },
            ]}
          />
          {formValues.iconType === IconType.SHAPE && (
            <Box display="flex" gap={2} alignItems={'center'}>
              <TextField
                margin="dense"
                {...register('pointShape')}
                label={t('styleRules.pointShape')}
                variant="outlined"
                sx={{ width: '50%' }}
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
              {/* <Divider orientation="vertical" flexItem sx={{ height: 50, alignSelf: 'center' }} /> */}
              <Typography whiteSpace={'nowrap'}>{t('styleRules.fillColor')}</Typography>
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
          )}
          {formValues.iconType === IconType.FILE && (
            <>
              <Box display="flex" gap={2}>
                {formValues.imgSrc && (
                  <TextField
                    margin="dense"
                    {...register('imgSrc')}
                    label={t('styleRules.imgSrc')}
                    variant="outlined"
                    sx={{ width: '66%' }}
                    value={formValues.imgSrc}
                    disabled
                  />
                )}
                {formValues.imgFormat && (
                  <TextField
                    margin="dense"
                    {...register('imgFormat')}
                    label={t('styleRules.imgFormat')}
                    variant="outlined"
                    sx={{ width: '33%' }}
                    error={!!errors.imgFormat}
                    helperText={errors.imgFormat?.message}
                    disabled
                  />
                )}
              </Box>
              <Button component="label" disabled={uploadIconMutation.isPending}>
                <AttachFileOutlined sx={{ mr: 1 }} />
                {formValues.imgSrc ? t('styleRules.changeIcon') : t('styleRules.addIcon')}
                <input
                  type="file"
                  hidden
                  onChange={(e) => e.target.files?.length && uploadIconMutation.mutate(e.target.files)}
                />
              </Button>
              {errors.imgSrc && <FormHelperText error>{errors.imgSrc.message}</FormHelperText>}
            </>
          )}
        </Box>
        <Box
          sx={
            formValues.hasTextSymbolizer
              ? {
                  border: `1px solid ${grey[300]}`,
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
                  border: `1px solid ${grey[300]}`,
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
    </FormProvider>
  );
};
