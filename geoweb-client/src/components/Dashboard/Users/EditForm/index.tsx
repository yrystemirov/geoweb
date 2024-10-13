import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { UserDto, UserUpdateDto } from '../../../../api/types/user';
import { useNotify } from '../../../../hooks/useNotify';
import { userAPI } from '../../../../api/user';

const INITIAL_VALUES: UserUpdateDto = {
  email: '',
  name: '',
  phoneNumber: '',
  blocked: false,
  roles: [],
};

type Props = {
  id?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const UserEditForm: FC<Props> = ({ id: idProp, onSuccess, onCancel }) => {
  const { showSuccess } = useNotify();
  const { t } = useTranslation();
  const { id: idParam } = useParams();
  const id = idProp || (idParam as string);
  const { data } = useQuery({
    queryKey: ['userProperties', id],
    queryFn: () => userAPI.getUser(id!).then((res) => res.data),
    enabled: !!id,
  });

  const editMutation = useMutation<UserDto, any, UserUpdateDto>({
    mutationFn: (user) => userAPI.updateUser(id, user).then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
    },
  });

  const schema = yup.object<Partial<UserDto>>().shape({
    email: yup.string().email(t('invalidEmail')).required(t('requiredField')),
    name: yup.string().required(t('requiredField')),
    phoneNumber: yup.string(),
    password: yup.string(),
    blocked: yup.boolean(),
  });

  const methods = useForm<UserUpdateDto>({
    defaultValues: data || INITIAL_VALUES,
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: UserUpdateDto) => {
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
          {...methods.register('email')}
          label={t('users.email')}
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          required
          sx={{ flex: 0.5 }}
        />

        <TextField
          {...methods.register('name')}
          label={t('users.name')}
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          required
          sx={{ flex: 0.5 }}
        />
      </Box>

      <Box display="flex" gap={2} flexWrap={'wrap'} mb={2}>
        <TextField
          {...methods.register('phoneNumber')}
          label={t('users.phoneNumber')}
          fullWidth
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          sx={{ flex: 0.5 }}
        />
      </Box>

      <Box display={'flex'} gap={2} alignItems={'flex-start'}>
        <FormControlLabel
          control={<Checkbox {...methods.register('blocked')} checked={methods.watch('blocked')} color="primary" />}
          label={t('users.blocked')}
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