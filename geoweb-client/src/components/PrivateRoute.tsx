import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SUPERADMIN_ROLE_CODE } from '../api/types/role';

interface PrivateRouteProps {
  children: JSX.Element;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(SUPERADMIN_ROLE_CODE)

  return isAdmin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
