import { Navigate } from 'react-router-dom';
import { getStoredToken } from '../utils/auth/tokenStorage';

interface PrivateRouteProps {
  children: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = Boolean(getStoredToken());

  // If the user is not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
