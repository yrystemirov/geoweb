import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthorized } = useAuth();

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
