import { localStorageKeys } from '../utils/localStorage/keys';
import { useNavigate } from 'react-router-dom';
import { TokenResponse } from '../api/types/auth';
import { useEffect, useState } from 'react';
import { clearStoredToken, getStoredToken } from '../utils/auth/tokenStorage';
import { useUserStore } from './useUserStore';
import { UserDto } from '../api/types/user';

export const useAuth = () => {
  const getToken = (): TokenResponse | null => {
    try {
      const token = getStoredToken();
      return JSON.parse(token!);
    } catch (error) {
      logout();
      return null;
    }
  };

  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(Boolean(getToken()));
  const [token, setToken] = useState<TokenResponse | null>(getToken()!);
  const { user: currentUser, setUser } = useUserStore();

  const logout = () => {
    clearStoredToken();
    navigate('/login');
    setUser(null);
  };

  const setStoredToken = (token: TokenResponse) => {
    localStorage.setItem(localStorageKeys.token, JSON.stringify(token));
  };

  const hasRole = (role: string, user: UserDto | null = currentUser) => {
    return user?.roles.map(({ code }) => code).includes(role);
  };

  useEffect(() => {
    const tokenData = getToken();
    setIsAuthorized(Boolean(tokenData));
    setToken(tokenData!);
  }, [getStoredToken()]);

  return { token, setToken: setStoredToken, logout, isAuthorized, hasRole };
};
