package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.EntityPermissionDto;
import kz.geoweb.api.dto.RoleDto;
import kz.geoweb.api.entity.EntityPermission;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import kz.geoweb.api.mapper.EntityPermissionMapper;
import kz.geoweb.api.repository.EntityPermissionRepository;
import kz.geoweb.api.service.EntityPermissionService;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static kz.geoweb.api.enums.RoleEnum.SUPERADMIN;

@Service
@RequiredArgsConstructor
public class EntityPermissionServiceImpl implements EntityPermissionService {
    private final EntityPermissionRepository entityPermissionRepository;
    private final UserService userService;
    private final EntityPermissionMapper entityPermissionMapper;

    @Override
    public boolean hasPermission(EntityType entityType, UUID entityId, Permission permission) {
        Set<RoleDto> roles = userService.getCurrentUserRoles();
        if (isSuperadmin(roles)) return true;
        Set<UUID> roleIds = roles.stream().map(RoleDto::getId).collect(Collectors.toSet());
        Optional<EntityPermission> entityPermissionOptional = entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleIdIn(entityType, entityId, roleIds);
        if (entityPermissionOptional.isEmpty()) {
            return false;
        } else {
            EntityPermission entityPermission = entityPermissionOptional.get();
            Set<Permission> permissions = Arrays.stream(entityPermission.getPermissions().split(","))
                    .map(Permission::valueOf).collect(Collectors.toSet());
            return permissions.contains(permission);
        }
    }

    private boolean isSuperadmin(Set<RoleDto> roles) {
        return roles.stream().anyMatch(role -> role.getCode().equals(SUPERADMIN.name()));
    }

    @Override
    public List<EntityPermissionDto> getEntityPermissions(EntityType entityType, UUID entityId) {
        List<EntityPermission> entityPermissions = entityPermissionRepository.findByEntityTypeAndEntityId(entityType, entityId);
        return entityPermissionMapper.toDto(entityPermissions);
    }

    @Override
    @Transactional
    public void updateEntityPermission(List<EntityPermissionDto> entityPermissions) {
        List<EntityPermissionDto> entityPermissionsToDelete = new ArrayList<>();
        List<EntityPermission> entityPermissionsToSave = new ArrayList<>();
        for (EntityPermissionDto entityPermissionDto : entityPermissions) {
            if (entityPermissionDto.getPermissions().isEmpty()) {
                entityPermissionsToDelete.add(entityPermissionDto);
            }
            Optional<EntityPermission> dbEntityPermissionOptional = entityPermissionRepository.findByEntityTypeAndEntityIdAndRoleId(
                    entityPermissionDto.getEntityType(),
                    entityPermissionDto.getEntityId(),
                    entityPermissionDto.getRole().getId()
            );
            if (dbEntityPermissionOptional.isPresent()) {
                EntityPermission dbEntityPermission = dbEntityPermissionOptional.get();
                dbEntityPermission.setPermissions(entityPermissionDto.getPermissions().stream()
                        .map(Permission::name).collect(Collectors.joining(",")));
                entityPermissionsToSave.add(dbEntityPermission);
            } else {
                entityPermissionsToSave.add(entityPermissionMapper.toEntity(entityPermissionDto));
            }
        }
        entityPermissionRepository.saveAll(entityPermissionsToSave);
        for (EntityPermissionDto entityPermissionDto : entityPermissionsToDelete) {
            entityPermissionRepository.deleteByEntityTypeAndEntityIdAndRoleId(
                    entityPermissionDto.getEntityType(),
                    entityPermissionDto.getEntityId(),
                    entityPermissionDto.getRole().getId()
            );
        }
    }
}
