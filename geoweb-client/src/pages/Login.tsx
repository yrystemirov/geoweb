import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { useForm, Controller } from 'react-hook-form';
import { useLoading } from '../components/common/loadingBar/loadingContext';
import { useAuth } from '../hooks/useAuth';
import { dashboardUrl } from '../components/Dashboard/routes';
import { useNotify } from '../hooks/useNotify';
import { userAPI } from '../api/user';
import { useUserStore } from '../hooks/useUserStore';
import { SUPERADMIN_ROLE_CODE } from '../api/types/role';

interface FormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { setUser } = useUserStore();
  const { showSuccess, showError } = useNotify();
  const { setToken, hasRole } = useAuth();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { t } = useTranslation();

  const { mutate: getToken, isPending } = useMutation({
    mutationFn: (data: FormValues) => authAPI.getToken(data.username, data.password).then((res) => res.data),
    onSuccess: (tokenData) => {
      setToken(tokenData);
      getCurrentUserMutation.mutate();
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const getCurrentUserMutation = useMutation({
    mutationFn: () => userAPI.getCurrentUser().then((res) => res.data),
    onSuccess: (user) => {
      showSuccess();
      setUser(user);
      const isAdmin = hasRole(SUPERADMIN_ROLE_CODE, user);
      if (isAdmin) {
        navigate(dashboardUrl);
      } else {
        navigate('/');
      }
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="min(100vh, 600px)"
      flexDirection="column"
      component="form"
      onSubmit={handleSubmit((data) => getToken(data))}
    >
      <Typography variant="h6" gutterBottom>
        {t('signInTitle')}
      </Typography>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <Controller
          name="username"
          control={control}
          rules={{ required: 'Username is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('login')}
              variant="outlined"
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('password')}
              variant="outlined"
              margin="normal"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" disabled={isPending}>
          {t('signIn')}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
