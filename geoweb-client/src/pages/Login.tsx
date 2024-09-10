import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/auth';

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const authMutation = useMutation({
    mutationFn: (data: any) => authAPI.getToken(data.username, data.password),
    onSuccess: () => {
      console.log('success');
      
      navigate('/dashboard');
    },
  });

  if (!authContext) {
    // Handle the case where the context is not provided (this should never happen if used correctly)
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(123)
    // login();
    // navigate('/dashboard');
    authMutation.mutate({ username: 'admin', password: 'geoweb' });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="min(100vh, 600px)"
      flexDirection="column"
      component={'form'}
      onSubmit={handleLogin}
    >
      <Typography variant="h6" gutterBottom>
        {t('signInTitle')}
      </Typography>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
      <TextField
        label={t('login')}
        variant="outlined"
        margin="normal"
      />
      <TextField
        label={t('password')}
        variant="outlined"
        margin="normal"
        type="password"
      />
      <Button type="submit" variant="contained" color="primary">
        {t('signIn')}
      </Button>
    </Box>
    </Box>
  );
}

export default Login;
