package kz.geoweb.api.service.impl;

import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import kz.geoweb.api.repository.EntityPermissionRepository;
import kz.geoweb.api.service.EntityPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntityPermissionServiceImpl implements EntityPermissionService {
    private final EntityPermissionRepository entityPermissionRepository;

    @Override
    public boolean allowFolderRead(UUID entityId, UUID userId) {
        return entityPermissionRepository.findByEntityTypeAndEntityIdAndUserIdAndPermission(EntityType.FOLDER, entityId, userId, Permission.READ).isPresent();
    }

    @Override
    public boolean allowFolderWrite(UUID entityId, UUID userId) {
        return entityPermissionRepository.findByEntityTypeAndEntityIdAndUserIdAndPermission(EntityType.FOLDER, entityId, userId, Permission.WRITE).isPresent();
    }

    @Override
    public boolean allowLayerRead(UUID entityId, UUID userId) {
        return entityPermissionRepository.findByEntityTypeAndEntityIdAndUserIdAndPermission(EntityType.LAYER, entityId, userId, Permission.READ).isPresent();
    }

    @Override
    public boolean allowLayerWrite(UUID entityId, UUID userId) {
        return entityPermissionRepository.findByEntityTypeAndEntityIdAndUserIdAndPermission(EntityType.LAYER, entityId, userId, Permission.WRITE).isPresent();
    }
}
