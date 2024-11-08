import { RoleDto } from './role';

export enum EntityType {
  LAYER = 'LAYER',
  FOLDER = 'FOLDER',
}

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
}

export type EntityPermissionDto = {
  entityType: EntityType;
  entityId: string;
  role: RoleDto;
  permissions: Permission[];
};