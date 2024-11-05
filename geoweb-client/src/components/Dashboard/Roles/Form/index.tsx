import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField } from '@mui/material';
import { object, string } from 'yup';
import { useNotify } from '../../../../hooks/useNotify';
import { RoleDto } from '../../../../api/types/role';
import { roleAPI } from '../../../../api/roles';

const INITIAL_VALUES: RoleDto = {
  name: '',
  code: '',
  description: '',
};

type Props = {
  editData?: RoleDto;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const RoleForm: FC<Props> = ({ editData, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotify();

  const createMutation = useMutation<RoleDto, any, RoleDto>({
    mutationFn: (role) => roleAPI.createRole(role).then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const updateMutation = useMutation<RoleDto, any, RoleDto>({
    mutationFn: (role) => roleAPI.updateRole(editData?.id!, role).then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const schema = object<RoleDto>({
    name: string().required(t('requiredField')),
    code: string().required(t('requiredField')),
    description: string(),
  });

  const methods = useForm<RoleDto>({
    defaultValues: editData || INITIAL_VALUES,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: RoleDto) => {
    if (editData) {
      updateMutation.mutate(data);
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <Box onSubmit={handleSubmit(onSubmit)} noValidate component={'form'} sx={{ pt: 1 }} minWidth={'min(100%, 550px)'}>
      <Box display="flex" gap={2} flexWrap={'wrap'} mb={2} flexDirection="column" width={{ xs: '100%', md: '70%' }}>
        <TextField
          label={t('roles.name')}
          variant="outlined"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...methods.register('name')}
          required
        />
        <TextField
          label={t('roles.code')}
          variant="outlined"
          fullWidth
          error={!!errors.code}
          helperText={errors.code?.message}
          {...methods.register('code')}
          required
        />
        <TextField
          label={t('roles.description')}
          variant="outlined"
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
          {...methods.register('description')}
          multiline
          rows={2}
        />
      </Box>

      <Button
        type="submit"
        size="large"
        sx={{ float: 'right' }}
        variant="contained"
        disabled={createMutation.isPending}
      >
        {editData ? t('save') : t('create')}
      </Button>
      <Button
        type="button"
        size="large"
        sx={{ float: 'right' }}
        variant="text"
        onClick={() => {
          onCancel?.();
          methods.reset();
        }}
      >
        {t('cancel')}
      </Button>
    </Box>
  );
};
