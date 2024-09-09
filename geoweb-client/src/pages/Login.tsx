import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  if (!authContext) {
    // Handle the case where the context is not provided (this should never happen if used correctly)
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    login();
    navigate('/dashboard');
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
