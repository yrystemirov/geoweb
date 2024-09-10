import axios, { AxiosResponse } from 'axios';
import { clearStoredToken, getStoredToken, setStoredToken } from '../auth/tokenStorage';
import { TokenResponse } from '../../api/types/auth';

const instance = axios.create({
  baseURL: '/geoweb/api',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

const refreshInstance = axios.create({
  baseURL: '/geoweb/api',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

async function refreshToken() {
  const tokenData = getStoredToken();
  const token = tokenData ? JSON.parse(tokenData) : null;

  return refreshInstance.post<AxiosResponse<TokenResponse>>('/auth/token/refresh', { refreshToken: token?.refreshToken }).then((res) => {
    return res.data;
  });
}

instance.interceptors.request.use(
  (config) => {
    const isAuthUrl = config.url?.includes('/auth/token');
    const tokenData = getStoredToken();
    const token: TokenResponse = tokenData ? JSON.parse(tokenData) : null;

    if (token?.accessToken && !isAuthUrl) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    } else {
      config.headers['Authorization'] = null;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const { data: tokenData } = await refreshToken();

          setStoredToken(JSON.stringify(tokenData));
          instance.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`;
          return instance(originalConfig);
        } catch (_error) {
          // if refresh token expired
          clearStoredToken();
          window.location.href = '/login';

          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
