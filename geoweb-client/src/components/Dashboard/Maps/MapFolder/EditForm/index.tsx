import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FolderDto } from '../../../../../api/types/mapFolders';
import { mapFoldersAPI } from '../../../../../api/mapFolders';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNotifications } from '@toolpad/core';
import { constants } from '../../../../../constants';
import * as yup from 'yup';

type EditFolderRequest = Partial<FolderDto> & { nameRu: string };

const INITIAL_VALUES: EditFolderRequest = {
  nameKk: '',
  nameRu: '',
  nameEn: '',
  descriptionKk: '',
  descriptionRu: '',
  descriptionEn: '',
  isPublic: false,
  parent: null,
};

type Props = {
  id?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const MapFolderEditForm: FC<Props> = ({ id: idProp, onSuccess, onCancel }) => {
  const { show } = useNotifications();
  const { t } = useTranslation();
  const { id: idParam } = useParams();
  const id = idProp || idParam;
  const { data } = useQuery({
    queryKey: ['mapProperties', id],
    queryFn: () => mapFoldersAPI.getFolder(id!).then((res) => res.data),
    enabled: !!id,
  });

  const editMutation = useMutation<FolderDto, any, Partial<FolderDto>>({
    mutationFn: (folder) => mapFoldersAPI.updateFolder(folder).then((res) => res.data),
    onSuccess(data, variables, context) {
      onSuccess?.();
      show(t('success'), { severity: 'success', autoHideDuration: constants.ntfHideDelay });
    },
  });

  const schema = yup.object<Partial<FolderDto>>().shape({
    nameKk: yup.string(),
    nameRu: yup.string().required(t('requiredField')),
    nameEn: yup.string(),
    descriptionKk: yup.string(),
    descriptionRu: yup.string(),
    descriptionEn: yup.string(),
    isPublic: yup.boolean(),
    rank: yup.number().typeError(t('mustBeNumber')).required(t('requiredField')) as yup.NumberSchema,
  });

  const methods = useForm<EditFolderRequest>({
    defaultValues: data || INITIAL_VALUES,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: EditFolderRequest) => {
    editMutation.mutate(data);
  };

  useEffect(() => {
    methods.reset(data || INITIAL_VALUES);
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <Box onSubmit={handleSubmit(onSubmit)} noValidate component={'form'} sx={{ pt: 1 }}>
      <Box display="flex" gap={2} flexWrap={'wrap'} mb={2}>
        <TextField
          {...methods.register('nameRu')}
          label={t('nameRu')}
          fullWidth
          error={!!errors.nameRu}
          helperText={errors.nameRu?.message}
          required
          sx={{ flex: 0.5 }}
        />

        <TextField
          {...methods.register('nameKk')}
          label={t('nameKk')}
          fullWidth
          error={!!errors.nameKk}
          helperText={errors.nameKk?.message}
          sx={{ flex: 0.5 }}
        />

        <TextField
          {...methods.register('nameEn')}
          label={t('nameEn')}
          fullWidth
          error={!!errors.nameEn}
          helperText={errors.nameEn?.message}
          sx={{ flex: 0.5 }}
        />
      </Box>
      <Box display="flex" gap={2} flexWrap={'wrap'} mb={2}>
        <TextField
          {...methods.register('descriptionRu')}
          label={t('descriptionRu')}
          fullWidth
          error={!!errors.descriptionRu}
          helperText={errors.descriptionRu?.message}
          sx={{ flex: 1 }}
        />

        <TextField
          {...methods.register('descriptionKk')}
          label={t('descriptionKk')}
          fullWidth
          error={!!errors.descriptionKk}
          helperText={errors.descriptionKk?.message}
          sx={{ flex: 1 }}
        />

        <TextField
          {...methods.register('descriptionEn')}
          label={t('descriptionEn')}
          fullWidth
          error={!!errors.descriptionEn}
          helperText={errors.descriptionEn?.message}
          sx={{ flex: 1 }}
        />
      </Box>
      <Box display={'flex'} gap={2} alignItems={'flex-start'}>
        <TextField
          {...methods.register('rank')}
          label={t('rank')}
          error={!!errors.rank}
          helperText={errors.rank?.message}
          type="number"
          required
          sx={{ width: 150 }}
        />
        <FormControlLabel
          control={<Checkbox {...methods.register('isPublic')} checked={methods.watch('isPublic')} color="primary" />}
          label={t('maps.isPublic')}
          sx={{ mt: 1 }}
        />
      </Box>
      <Button type="submit" size="large" sx={{ float: 'right' }} variant="contained" disabled={editMutation.isPending}>
        {t('save')}
      </Button>
      <Button
        type="button"
        size="large"
        sx={{ float: 'right' }}
        variant="text"
        onClick={() => {
          onCancel?.();
          methods.reset(data || INITIAL_VALUES);
        }}
      >
        {t('cancel')}
      </Button>
    </Box>
  );
};