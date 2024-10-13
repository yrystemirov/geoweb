
import instance from '../utils/axios/instance';
import { Pages, PaginationRequest } from './types/page';
import { RoleDto } from './types/role';

const ROLE_URL = '/roles';

const getRole = (id: RoleDto['id']) => {
  return instance.get<RoleDto>(`${ROLE_URL}/${id}`);
};

const updateRole = (id: RoleDto['id'], role: RoleDto) => {
  return instance.put<RoleDto>(`${ROLE_URL}/${id}`, role);
};

const deleteRole = (id: RoleDto['id']) => {
  return instance.delete<void>(`${ROLE_URL}/${id}`);
};

const getRoles = (pagination?: PaginationRequest) => {
  return instance.get<Pages<RoleDto & { id: string }>>(ROLE_URL, {
    params: pagination,
  });
};

const createRole = (role: RoleDto) => {
  return instance.post<RoleDto>(ROLE_URL, role);
}

export const roleAPI = {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
};