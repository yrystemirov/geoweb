import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // Handle the case where context is not provided, which should never happen if used correctly
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isAuthenticated } = authContext;

  // If the user is not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
