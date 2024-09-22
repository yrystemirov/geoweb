// форма с полями FolderDto для создания папки
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FolderDto } from '../../../../api/types/mapFolders';
import { mapFoldersAPI } from '../../../../api/mapFolders';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CardHeader, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoBackButton } from '../../../common/goBackButton';

type CreateFolderRequest = Partial<FolderDto> & { nameRu: string };

const INITIAL_VALUES: CreateFolderRequest = {
  nameKk: '',
  nameRu: '',
  nameEn: '',
  descriptionKk: '',
  descriptionRu: '',
  descriptionEn: '',
  isPublic: false,
  parent: null,
};

export const MapFolderCreate: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useMutation<FolderDto, any, CreateFolderRequest>({
    mutationFn: (folder) => mapFoldersAPI.addFolder(folder).then((res) => res.data),
    onSuccess(data, variables, context) {
      navigate('/dashboard/maps');
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

  const methods = useForm<CreateFolderRequest>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = (data: CreateFolderRequest) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
        <GoBackButton text={t('backToList')} onClick={() => navigate('/dashboard/maps')} />
        <CardHeader title={t('maps.addMap')} sx={{ textAlign: 'center', flex: 1 }} />
      </Box>
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
          control={<Checkbox {...methods.register('isPublic')} color="primary" />}
          label={t('maps.isPublic')}
          sx={{ mt: 1 }}
        />
      </Box>
      <Button
        type="submit"
        size="large"
        sx={{ float: 'right' }}
        variant="contained"
        disabled={createMutation.isPending}
      >
        {t('create')}
      </Button>
    </form>
  );
};
