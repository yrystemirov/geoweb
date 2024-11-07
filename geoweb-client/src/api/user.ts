import instance from '../utils/axios/instance';
import { Pages, PaginationRequest } from './types/page';
import { UserCreateDto, UserDto, UserUpdateDto } from './types/user';

const USER_URL = '/users';

const getUser = (id: UserDto['id']) => {
  return instance.get<UserDto>(`${USER_URL}/${id}`);
};

const updateUser = (id: UserDto['id'], user: UserUpdateDto) => {
  return instance.put<UserDto>(`${USER_URL}/${id}`, user);
};

const deleteUser = (id: UserDto['id']) => {
  return instance.delete<void>(`${USER_URL}/${id}`);
};

const getUsers = (pagination?: PaginationRequest) => {
  return instance.get<Pages<UserDto>>(USER_URL, {
    params: pagination,
  });
};

const createUser = (user: UserCreateDto) => {
  return instance.post<UserDto>(USER_URL, user);
}

const getCurrentUser = () => {
  return instance.get<UserDto>('/users/current');
}

export const userAPI = {
  getCurrentUser,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
};