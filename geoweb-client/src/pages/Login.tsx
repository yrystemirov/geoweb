import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    // Handle the case where the context is not provided (this should never happen if used correctly)
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login } = authContext;

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
