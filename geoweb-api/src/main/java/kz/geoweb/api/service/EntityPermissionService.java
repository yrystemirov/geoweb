package kz.geoweb.api.service;

import kz.geoweb.api.dto.EntityPermissionDto;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;

import java.util.List;
import java.util.UUID;

public interface EntityPermissionService {
    boolean hasPermission(EntityType entityType, UUID entityId, Permission permission);

    List<EntityPermissionDto> getEntityPermissions(EntityType entityType, UUID entityId);

    void updateEntityPermission(List<EntityPermissionDto> entityPermissions);
}
