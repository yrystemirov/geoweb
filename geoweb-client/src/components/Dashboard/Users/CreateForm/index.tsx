import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { array, object, string } from 'yup';
import { UserCreateDto, UserDto } from '../../../../api/types/user';
import { useNotify } from '../../../../hooks/useNotify';
import { userAPI } from '../../../../api/user';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { RoleDto } from '../../../../api/types/role';
import { roleAPI } from '../../../../api/roles';

const INITIAL_VALUES: UserCreateDto = {
  username: '',
  email: '',
  name: '',
  phoneNumber: '',
  password: '',
  roles: [],
};

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const UserCreateForm: FC<Props> = ({ onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotify();
  const [showPassword, setShowPassword] = useState(true);
  const { data: first1000Roles } = useQuery({
    queryKey: ['first-1000-roles'],
    queryFn: () => roleAPI.getRoles({ page: 0, size: 1000 }).then((res) => res.data), // TODO: pagination
  });
  const roles = first1000Roles?.content || [];

  const createMutation = useMutation<UserDto, any, UserCreateDto>({
    mutationFn: (user) => userAPI.createUser(user).then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
    },
    onError: (error) => {
      showError({ text: error?.response?.data?.message });
    },
  });

  const schema = object<UserCreateDto>().shape({
    username: string().required(t('requiredField')),
    email: string().email(t('invalidEmail')).required(t('requiredField')),
    name: string().required(t('requiredField')),
    phoneNumber: string(),
    password: string().required(t('requiredField')),
    roles: array<RoleDto[]>(),
  });

  const methods = useForm<UserCreateDto>({
    defaultValues: INITIAL_VALUES,
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: UserCreateDto) => {
    createMutation.mutate(data);
  };

  return (
    <Box onSubmit={handleSubmit(onSubmit)} noValidate component={'form'} sx={{ pt: 1 }}>
      <FormProvider {...methods}>
        <Box display="flex" gap={2} flexWrap={'wrap'} mb={2} flexDirection="column" width={{ xs: '100%', md: '50%' }}>
          <TextField
            {...methods.register('username')}
            label={t('users.username')}
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
            required
            sx={{ flex: 0.5 }}
          />

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

          <TextField
            {...methods.register('phoneNumber')}
            label={t('users.phoneNumber')}
            fullWidth
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            sx={{ flex: 0.5 }}
          />
          <TextField
            {...methods.register('password')}
            label={t('users.password')}
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            type={showPassword ? 'text' : 'password'}
            sx={{ flex: { xs: 1, md: 0.5 } }}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword((prev) => !prev);
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              },
            }}
            required
          />
          <FormControl>
            <InputLabel>{t('roles.title')}</InputLabel>
            <Select<RoleDto[]>
              {...methods.register('roles')}
              multiple
              label={t('roles.title')}
              fullWidth
              error={!!errors.roles}
              value={methods.watch('roles')}
              renderValue={(selected) => selected.map((role) => role.name).join(', ')}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role as any}>
                  <Checkbox
                    checked={methods
                      .watch('roles')
                      .map((role) => role.id)
                      .includes(role.id)}
                  />
                  <ListItemText primary={role.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </FormProvider>

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
        }}
      >
        {t('cancel')}
      </Button>
    </Box>
  );
};