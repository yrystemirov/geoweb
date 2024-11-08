export type RoleDto = {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
};


export const SUPERADMIN_ROLE_CODE = 'SUPERADMIN'; // зарезервированный код роли суперадмина
export const ADMIN_USERNAME = 'ADMIN'; // зарезервированное имя пользователя админа
export const EDIT_FORBIDDEN_USER_NAMES = [ADMIN_USERNAME];
