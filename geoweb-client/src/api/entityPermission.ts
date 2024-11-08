import instance from '../utils/axios/instance';
import { EntityPermissionDto, EntityType } from './types/entityPermission';

const ENTITY_PERMISSIONS_URL = '/entity-permissions';

const getEntityPermissions = (params: { entityType: EntityType; entityId: string }) => {
  return instance.get<EntityPermissionDto[]>(ENTITY_PERMISSIONS_URL, { params });
};

const setEntityPermissions = (entities: EntityPermissionDto[]) => {
  return instance.put<void>(ENTITY_PERMISSIONS_URL, entities);
};

export const entityPermissionAPI = {
  getEntityPermissions,
  setEntityPermissions,
};