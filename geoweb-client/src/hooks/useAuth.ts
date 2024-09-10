import { localStorageKeys } from '../utils/localStorage/keys';
import { useNavigate } from 'react-router-dom';
import { TokenResponse } from '../api/types/auth';
import { useEffect, useState } from 'react';
import { clearStoredToken, getStoredToken } from '../utils/auth/tokenStorage';

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

  const logout = () => {
    clearStoredToken();
    navigate('/login');
  };

  const setStoredToken = (token: TokenResponse) => {
    localStorage.setItem(localStorageKeys.token, JSON.stringify(token));
  };

  useEffect(() => {
    const tokenData = getToken();
    setIsAuthorized(Boolean(tokenData));
    setToken(tokenData!);
  }, [getStoredToken()]);

  return { token, setToken: setStoredToken, logout, isAuthorized };
};
