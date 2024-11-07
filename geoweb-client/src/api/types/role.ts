export type RoleDto = {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
};

export const EDIT_FORBIDDEN_USER_NAMES = ['admin'];
export const SUPERADMIN_ROLE_CODE = 'SUPERADMIN';
