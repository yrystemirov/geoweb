import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { FolderDto } from '../../../../../api/types/mapFolders';
import { mapFoldersAPI } from '../../../../../api/mapFolders';
import { boolean, number, NumberSchema, object, string } from 'yup';
import { useNotify } from '../../../../../hooks/useNotify';
import { useNavigate } from 'react-router-dom';

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

type Props = {
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  goBackPath?: string;
};

export const MapFolderCreateForm: FC<Props> = ({ goBackPath, parentId, onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotify();
  const createMutation = useMutation<FolderDto, any, CreateFolderRequest>({
    mutationFn: (folder) =>
      mapFoldersAPI
        .addFolder({ ...folder, ...(parentId ? { parent: { id: parentId } } : {}) } as CreateFolderRequest)
        .then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
      goBackPath && navigate(goBackPath);
    },
    onError: (error) => {
      showError({ text: error?.response?.data?.message });
    },
  });

  const schema = object<Partial<FolderDto>>().shape({
    nameKk: string(),
    nameRu: string().required(t('requiredField')),
    nameEn: string(),
    descriptionKk: string(),
    descriptionRu: string(),
    descriptionEn: string(),
    isPublic: boolean(),
    rank: number().typeError(t('mustBeNumber')).required(t('requiredField')) as NumberSchema,
  });

  const methods = useForm<CreateFolderRequest>({
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: CreateFolderRequest) => {
    createMutation.mutate(data);
  };

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
      <Button
        type="button"
        size="large"
        sx={{ float: 'right' }}
        variant="text"
        onClick={() => {
          onCancel?.();
          methods.reset();
          goBackPath && navigate(goBackPath);
        }}
      >
        {t('cancel')}
      </Button>
    </Box>
  );
};