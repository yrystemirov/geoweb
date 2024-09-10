import axios from "axios";
import { getStoredToken } from "../auth/tokenStorage";

const instance = axios.create({
  baseURL: '/geoweb/api',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const isAuthUrl = config.url?.endsWith('/auth/token');

    const tokenData = getStoredToken();

    let accessToken;
    if (tokenData) {
      accessToken = JSON.parse(tokenData).accessToken;
    }

    if (accessToken && !isAuthUrl) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      config.headers['Authorization'] = null;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;