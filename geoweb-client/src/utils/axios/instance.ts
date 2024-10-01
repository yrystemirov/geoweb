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


async function refreshToken() {
  const tokenData = getStoredToken();
  const token = tokenData ? JSON.parse(tokenData) : null;

  return instance
    .post<AxiosResponse<TokenResponse>>('/auth/token/refresh', { refreshToken: token?.refreshToken })
    .then((res) => res.data) as Promise<TokenResponse>;
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
  },
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
          const newTokenResp = await refreshToken();

          setStoredToken(JSON.stringify(newTokenResp));
          instance.defaults.headers.common['Authorization'] = `Bearer ${newTokenResp.accessToken}`;
          return instance(originalConfig);
        } catch (_error) {
          clearStoredToken();
          window.location.href = '/login';

          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default instance;