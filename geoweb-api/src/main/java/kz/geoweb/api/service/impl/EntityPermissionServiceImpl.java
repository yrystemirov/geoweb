package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.RoleDto;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.repository.EntityPermissionRepository;
import kz.geoweb.api.service.EntityPermissionService;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static kz.geoweb.api.enums.RoleEnum.SUPERADMIN;

@Service
@RequiredArgsConstructor
public class EntityPermissionServiceImpl implements EntityPermissionService {
    private final EntityPermissionRepository entityPermissionRepository;
    private final UserService userService;

    @Override
    public void checkFolderRead(UUID entityId) {
        Set<RoleDto> roles = userService.getCurrentUserRoles();
        if (isSuperadmin(roles)) return;
        Set<UUID> roleIds = roles.stream().map(RoleDto::getId).collect(Collectors.toSet());
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.FOLDER, entityId, roleIds, Permission.READ)
                .orElseThrow(() -> new ForbiddenException("folder.read.forbidden"));
    }

    @Override
    public void checkFolderWrite(UUID entityId) {
        Set<RoleDto> roles = userService.getCurrentUserRoles();
        if (isSuperadmin(roles)) return;
        Set<UUID> roleIds = roles.stream().map(RoleDto::getId).collect(Collectors.toSet());
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.FOLDER, entityId, roleIds, Permission.WRITE)
                .orElseThrow(() -> new ForbiddenException("folder.write.forbidden"));
    }

    @Override
    public void checkLayerRead(UUID entityId) {
        Set<RoleDto> roles = userService.getCurrentUserRoles();
        if (isSuperadmin(roles)) return;
        Set<UUID> roleIds = roles.stream().map(RoleDto::getId).collect(Collectors.toSet());
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.LAYER, entityId, roleIds, Permission.READ)
                .orElseThrow(() -> new ForbiddenException("layer.read.forbidden"));
    }

    @Override
    public void checkLayerWrite(UUID entityId) {
        Set<RoleDto> roles = userService.getCurrentUserRoles();
        if (isSuperadmin(roles)) return;
        Set<UUID> roleIds = roles.stream().map(RoleDto::getId).collect(Collectors.toSet());
        entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType.LAYER, entityId, roleIds, Permission.WRITE)
                .orElseThrow(() -> new ForbiddenException("layer.write.forbidden"));
    }

    private boolean isSuperadmin(Set<RoleDto> roles) {
        return roles.stream().anyMatch(role -> role.getCode().equals(SUPERADMIN.name()));
    }
}
