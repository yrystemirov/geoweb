import instance from '../utils/axios/instance';
import { TokenResponse } from './types/auth';

const getToken = (username: string, password: string) => {
  return instance.post<TokenResponse>('/auth/token', { username, password });
};

export const authAPI = {
  getToken,
};
