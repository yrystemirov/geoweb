import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { UserDto, UserUpdateDto } from '../../../../api/types/user';
import { useNotify } from '../../../../hooks/useNotify';
import { userAPI } from '../../../../api/user';
import { roleAPI } from '../../../../api/roles';
import { EDIT_FORBIDDEN_USER_NAMES, RoleDto } from '../../../../api/types/role';

type UserUpdateFormData = UserUpdateDto & { roles: string[] };

const INITIAL_VALUES: UserUpdateFormData = {
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
  goBackPath?: string;
};

export const UserEditForm: FC<Props> = ({ id: idProp, goBackPath, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { showSuccess } = useNotify();
  const { t } = useTranslation();
  const { id: idParam } = useParams();
  const id = idProp || (idParam as string);
  const { data } = useQuery({
    queryKey: ['userProperties', id],
    queryFn: () => userAPI.getUser(id!).then((res) => res.data),
    select: (data) => ({
      ...data,
      roles: data.roles.map((role) => role.id),
    }),
    enabled: !!id,
  });
  const { data: first1000Roles } = useQuery({
    queryKey: ['first-1000-roles'],
    queryFn: () => roleAPI.getRoles({ page: 0, size: 1000 }).then((res) => res.data), // TODO: pagination
  });
  const roles = first1000Roles?.content || [];

  const editMutation = useMutation<UserDto, any, UserUpdateFormData>({
    mutationFn: (user) =>
      userAPI
        .updateUser(id, {
          ...user,
          roles: user.roles.map((role) => ({ id: role }) as RoleDto),
        })
        .then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
      goBackPath && navigate(goBackPath);
    },
  });

  const schema = yup.object<Partial<UserDto>>().shape({
    email: yup.string().email(t('invalidEmail')).required(t('requiredField')),
    name: yup.string().required(t('requiredField')),
    phoneNumber: yup.string(),
    password: yup.string(),
    blocked: yup.boolean(),
    roles: yup.array().of(yup.string()),
  });

  const methods = useForm<UserUpdateFormData>({
    defaultValues: data || INITIAL_VALUES,
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: UserUpdateFormData) => {
    editMutation.mutate(data);
  };

  useEffect(() => {
    methods.reset(data || INITIAL_VALUES);
  }, [data]);

  if (!data) {
    return null;
  }

  const isEditForbidden = EDIT_FORBIDDEN_USER_NAMES.includes(data.username);

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

        <FormControl sx={{ flex: 0.5 }}>
          <InputLabel>{t('roles.title')}</InputLabel>
          <Select<string[]>
            {...methods.register('roles')}
            multiple
            label={t('roles.title')}
            fullWidth
            error={!!errors.roles}
            value={methods.watch('roles')}
            renderValue={(selected) =>
              roles
                .filter((role) => selected.includes(role.id))
                .map((role) => role.name)
                .join(', ')
            }
            disabled={isEditForbidden}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                <Checkbox checked={methods.watch('roles').includes(role.id)} />
                <ListItemText primary={role.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box display={'flex'} gap={2} alignItems={'flex-start'}>
        <FormControlLabel
          control={
            <Checkbox
              {...methods.register('blocked')}
              checked={methods.watch('blocked')}
              color="primary"
              disabled={isEditForbidden}
            />
          }
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
          goBackPath && navigate(goBackPath);
        }}
      >
        {t('cancel')}
      </Button>
    </Box>
  );
};
