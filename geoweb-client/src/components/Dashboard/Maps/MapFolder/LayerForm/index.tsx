import { useMutation, useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { layersAPI } from '../../../../../api/layer';
import { FolderDto, GeometryType, LayerDto, LayerRequestDto, LayerType } from '../../../../../api/types/mapFolders';
import { boolean, object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { Loader } from '../../../../common/Loader';
import { InfiniteScrollSelect } from '../../../../common/InfiniteScrollSelect';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';
import { useNotify } from '../../../../../hooks/useNotify';
import { useNavigate, useParams } from 'react-router-dom';

type LayerRequestForm = Omit<LayerRequestDto, 'folders'>;

type Props = {
  editLayerId?: LayerDto['id']; // when editing layer
  addFolderId?: string; // when adding new layer to folder
  onSuccess?: () => void;
  onCancel?: () => void;
  goBackPath?: string;
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
  isPublic: false,
};

export const LayerForm: FC<Props> = ({
  editLayerId: editLayerIdParam,
  addFolderId,
  onSuccess,
  onCancel,
  goBackPath,
}) => {
  const navigate = useNavigate();
  const { layerId } = useParams();
  const editLayerId = editLayerIdParam || layerId;
  const isEditing = Boolean(editLayerId);
  const isAdding = Boolean(addFolderId);
  const translatedNameProp = useTranslatedProp('name');
  const { showSuccess, showError } = useNotify();
  const { t } = useTranslation();
  const [useExistingLayer, setUseExistingLayer] = useState<boolean>(false); // just for adding new layer
  const [existingLayerId, setExistingLayerId] = useState<string | null>(null);
  const { data: layerToEdit, isLoading: isLayerLoading } = useQuery({
    queryKey: ['layers', editLayerId],
    queryFn: () => layersAPI.getLayer(editLayerId!).then((res) => res.data),
    enabled: isEditing,
  });

  const { data: existingLayer } = useQuery({
    queryKey: ['layers', existingLayerId],
    queryFn: () => layersAPI.getLayer(existingLayerId!).then((res) => res.data),
    enabled: useExistingLayer && !!existingLayerId,
  });

  const onError = (error: any) => {
    showError({ text: error?.response?.data?.message });
  };

  const createMutation = useMutation<LayerDto, any, LayerRequestForm>({
    mutationFn: async (layer) =>
      layersAPI
        .createLayer({
          ...layer,
          folders: addFolderId ? [{ id: addFolderId } as FolderDto] : [],
        })
        .then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
      goBackPath && navigate(goBackPath);
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
      showSuccess();
      goBackPath && navigate(goBackPath);
    },
    onError,
  });

  const addExistingLayerMutation = useMutation({
    mutationFn: async () =>
      layersAPI
        .updateLayer(existingLayerId!, {
          ...existingLayer!,
          folders: [...existingLayer!.folders, { id: addFolderId! } as FolderDto],
        })
        .then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
    },
    onError,
  });

  const schema = object<LayerRequestForm>().shape({
    nameRu: string().required(t('requiredField')),
    nameKk: string().required(t('requiredField')),
    nameEn: string().nullable(),
    descriptionRu: string().nullable(),
    descriptionKk: string().nullable(),
    descriptionEn: string().nullable(),
    layername: string().required(t('requiredField')),
    geometryType: string<GeometryType>().required(t('requiredField')),
    layerType: string<LayerType>().required(t('requiredField')),
    url: string().nullable(),
    isPublic: boolean(),
  });

  const methods = useForm<LayerRequestForm>({
    defaultValues: layerToEdit || INITIAL_VALUES,
    resolver: yupResolver(schema),
  });

  const existingLayerMethods = useForm<{ id: string }>({
    defaultValues: { id: '' },
    resolver: yupResolver(object({ id: string().required(t('requiredField')) })),
  });

  const { handleSubmit: existingLayerHandleSubmit } = existingLayerMethods;

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

  const onExistingLayerSubmit = () => {
    addExistingLayerMutation.mutate();
  };

  useEffect(() => {
    if (layerToEdit) {
      methods.reset(layerToEdit);
    }
  }, [layerToEdit]);

  useEffect(() => {
    if (useExistingLayer) {
      Object.keys(methods.formState).forEach((key) => methods.unregister(key as any));
    }
  }, [useExistingLayer]); // TODO: check if it needs at all

  if (!layerToEdit && isLayerLoading) {
    return <Loader />;
  }

  if (useExistingLayer) {
    return (
      <Box minWidth={'min(100%, 550px)'}>
        <FormControlLabel
          control={<Checkbox checked={useExistingLayer} onChange={(e) => setUseExistingLayer(e.target.checked)} />}
          label={t('maps.useExistingLayer')}
        />
        <FormProvider {...existingLayerMethods}>
          <Box
            component={'form'}
            onSubmit={existingLayerHandleSubmit(onExistingLayerSubmit)}
            noValidate
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            flexWrap={'wrap'}
            sx={{ pt: 1 }}
          >
            <InfiniteScrollSelect
              fetchFn={layersAPI.getLayers}
              name="id"
              label={t('maps.layername')}
              getOptionLabel={(option) => option[translatedNameProp]}
              getOptionValue={(option) => option.id}
              searchIsEnabled
              onChange={(value) => setExistingLayerId(value)}
              required
            />
            <Box display="flex" gap={2} sx={{ width: '100%' }} justifyContent="flex-end">
              <Button onClick={onCancel} variant="text" type="button">
                {t('cancel')}
              </Button>
              <Button type="submit" variant="contained" disabled={!existingLayerMethods.formState.isValid}>
                {t('save')}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    );
  }

  return (
    <Box minWidth={'min(100%, 550px)'}>
      {isAdding && (
        <FormControlLabel
          control={<Checkbox checked={useExistingLayer} onChange={(e) => setUseExistingLayer(e.target.checked)} />}
          label={t('maps.useExistingLayer')}
        />
      )}
      <Box
        component={'form'}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        display={'flex'}
        flexDirection={'row'}
        gap={2}
        flexWrap={'wrap'}
        sx={{ pt: 1 }}
        maxWidth={1000}
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
            disabled={isEditing}
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
            disabled={isEditing}
          >
            {Object.values(LayerType).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <TextField
          {...register('layername')}
          label={t('maps.layername')}
          fullWidth
          error={!!errors.layername}
          helperText={errors.layername?.message}
          required
          disabled={isEditing}
          sx={{ flex: 0.5 }}
        />
        <TextField {...register('url')} label={t('maps.url')} fullWidth />
        <FormControlLabel
          control={<Checkbox checked={methods.watch('isPublic')} {...register('isPublic')} />}
          label={t('maps.isPublic')}
        />
        <Box display="flex" gap={2} sx={{ width: '100%' }} justifyContent="flex-end">
          <Button
            onClick={() => {
              onCancel?.();
              goBackPath && navigate(goBackPath);
            }}
            variant="text"
            type="button"
          >
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {t('save')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
