package kz.geoweb.api.service.impl;

import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.repository.EntityPermissionRepository;
import kz.geoweb.api.service.EntityPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntityPermissionServiceImpl implements EntityPermissionService {
    private final EntityPermissionRepository entityPermissionRepository;

    @Override
    public void checkFolderRead(UUID entityId, Set<UUID> roleIds) {
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.FOLDER, entityId, roleIds, Permission.READ)
                .orElseThrow(() -> new ForbiddenException("folder.read.forbidden"));
    }

    @Override
    public void checkFolderWrite(UUID entityId, Set<UUID> roleIds) {
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.FOLDER, entityId, roleIds, Permission.WRITE)
                .orElseThrow(() -> new ForbiddenException("folder.write.forbidden"));
    }

    @Override
    public void checkLayerRead(UUID entityId, Set<UUID> roleIds) {
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.LAYER, entityId, roleIds, Permission.READ)
                .orElseThrow(() -> new ForbiddenException("layer.read.forbidden"));
    }

    @Override
    public void checkLayerWrite(UUID entityId, Set<UUID> roleIds) {
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.LAYER, entityId, roleIds, Permission.WRITE)
                .orElseThrow(() -> new ForbiddenException("layer.write.forbidden"));
    }
}
