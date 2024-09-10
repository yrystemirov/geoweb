import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/auth';
import { useForm, Controller } from 'react-hook-form';
import { setStoredToken } from '../utils/auth/tokenStorage';
import { useLoading } from '../components/common/loadingBar/loadingContext';

interface FormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { t } = useTranslation();

  const { mutate: getToken, isPending } = useMutation({
    mutationFn: (data: FormValues) => authAPI.getToken(data.username, data.password).then((res) => res.data),
    onSuccess: (tokenData) => {
      console.log('success');
      navigate('/dashboard');
      setStoredToken(JSON.stringify(tokenData.accessToken));
    },
    onError: (error) => {
      console.log('error', error);
    }
  });

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

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
      onSubmit={handleSubmit((data: any) => getToken(data))}
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
