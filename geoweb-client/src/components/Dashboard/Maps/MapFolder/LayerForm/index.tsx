import { useMutation, useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { layersAPI } from '../../../../../api/layer';
import { FolderDto, GeometryType, LayerDto, LayerRequestDto, LayerType } from '../../../../../api/types/mapFolders';
import { boolean, object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { Loader } from '../../../../common/loader';
import { useNotifications } from '@toolpad/core';
import { constants } from '../../../../../constants';

type LayerRequestForm = Omit<LayerRequestDto, 'folders'>;

type Props = {
  editLayerId?: LayerDto['id'];
  onSuccess?: () => void;
  onCancel?: () => void;
  newLayerFolderId?: string;
};

const INITIAL_VALUES: LayerRequestForm = {
  nameKk: '',
  nameRu: '',
  nameEn: '',
  descriptionKk: '',
  descriptionRu: '',
  descriptionEn: '',
  layername: '',
  geometryType: GeometryType.POINT,
  layerType: LayerType.SIMPLE,
  url: '',
  baseLayer: false,
  checkIntersection: false,
  isBlockLayer: false,
  isDynamic: false,
  isPublic: false,
};

export const LayerForm: FC<Props> = ({ editLayerId, newLayerFolderId, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { show } = useNotifications();
  const { data: layerToEdit, isLoading: isLayerLoading } = useQuery({
    queryKey: ['layers', editLayerId],
    queryFn: () => layersAPI.getLayer(editLayerId!).then((res) => res.data),
    enabled: !!editLayerId,
  });

  const onError = (error: any) => {
    show(error?.response?.data?.message || t('errorOccurred'), {
      severity: 'error',
      autoHideDuration: constants.ntfHideDelay,
    });
  };

  const createMutation = useMutation<LayerDto, any, LayerRequestForm>({
    mutationFn: async (layer) =>
      layersAPI
        .createLayer({
          ...layer,
          folders: [{ id: newLayerFolderId! } as FolderDto],
        })
        .then((res) => res.data),

    onSuccess: () => {
      onSuccess?.();
    },
    onError,
  });

  const updateMutation = useMutation<LayerDto, any, LayerRequestForm>({
    mutationFn: async (layer) =>
      layersAPI
        .updateLayer(layerToEdit!.id, {
          ...layer,
          folders: layerToEdit!.folders,
        })
        .then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
    },
    onError,
  });

  const schema = object<LayerRequestForm>().shape({
    nameRu: string().required(t('requiredField')),
    nameKk: string().required(t('requiredField')),
    nameEn: string(),
    descriptionRu: string(),
    descriptionKk: string(),
    descriptionEn: string(),
    layername: string().required(t('requiredField')),
    geometryType: string<GeometryType>().required(t('requiredField')),
    layerType: string<LayerType>().required(t('requiredField')),
    url: string(),
    baseLayer: boolean(),
    checkIntersection: boolean(),
    isBlockLayer: boolean(),
    isDynamic: boolean(),
    isPublic: boolean(),
  });

  const methods = useForm<LayerRequestForm>({
    defaultValues: layerToEdit || INITIAL_VALUES,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: LayerRequestForm) => {
    if (layerToEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (layerToEdit) {
      methods.reset(layerToEdit);
    }
  }, [layerToEdit]);

  if (!layerToEdit && isLayerLoading) {
    return <Loader />;
  }

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      display={'flex'}
      flexDirection={'row'}
      gap={2}
      flexWrap={'wrap'}
      sx={{ pt: 1 }}
    >
      <Box display="flex" gap={2} sx={{ width: '100%' }}>
        <TextField
          {...register('nameRu')}
          label={t('nameRu')}
          sx={{ flex: 0.5 }}
          error={!!errors.nameRu}
          helperText={errors.nameRu?.message}
          required
        />
        <TextField
          {...register('nameKk')}
          label={t('nameKk')}
          sx={{ flex: 0.5 }}
          error={!!errors.nameKk}
          helperText={errors.nameKk?.message}
          required
        />
      </Box>
      <TextField {...register('nameEn')} label={t('nameEn')} sx={{ flex: 0.5, pr: 2 }} />
      <TextField multiline {...register('descriptionRu')} label={t('descriptionRu')} fullWidth />
      <TextField multiline {...register('descriptionKk')} label={t('descriptionKk')} fullWidth />
      <TextField multiline {...register('descriptionEn')} label={t('descriptionEn')} fullWidth />
      <TextField
        {...register('layername')}
        label={t('maps.layername')}
        fullWidth
        error={!!errors.layername}
        helperText={errors.layername?.message}
        required
      />
      <Box display="flex" gap={2} sx={{ width: '100%' }}>
        <TextField
          select
          {...register('geometryType')}
          label={t('maps.geometryType')}
          sx={{ flex: 0.5 }}
          error={!!errors.geometryType}
          helperText={errors.geometryType?.message}
          value={methods.watch('geometryType')}
          required
        >
          {Object.values(GeometryType).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          {...register('layerType')}
          label={t('maps.layerType')}
          sx={{ flex: 0.5 }}
          error={!!errors.layerType}
          helperText={errors.layerType?.message}
          value={methods.watch('layerType')}
          required
        >
          {Object.values(LayerType).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <TextField {...register('url')} label={t('maps.url')} fullWidth />
      <FormControlLabel
        control={<Checkbox checked={methods.watch('baseLayer')} {...register('baseLayer')} />}
        label={t('maps.baseLayer')}
      />
      <FormControlLabel
        control={<Checkbox checked={methods.watch('checkIntersection')} {...register('checkIntersection')} />}
        label={t('maps.checkIntersection')}
      />
      <FormControlLabel
        control={<Checkbox checked={methods.watch('isBlockLayer')} {...register('isBlockLayer')} />}
        label={t('maps.isBlockLayer')}
      />
      <FormControlLabel
        control={<Checkbox checked={methods.watch('isDynamic')} {...register('isDynamic')} />}
        label={t('maps.isDynamic')}
      />
      <FormControlLabel
        control={<Checkbox checked={methods.watch('isPublic')} {...register('isPublic')} />}
        label={t('maps.isPublic')}
      />
      <Box display="flex" gap={2} sx={{ width: '100%' }} justifyContent="flex-end">
        <Button onClick={onCancel} variant="text" type="button">
          {t('cancel')}
        </Button>
        <Button type="submit" variant="contained">
          {t('save')}
        </Button>
      </Box>
    </Box>
  );
};
