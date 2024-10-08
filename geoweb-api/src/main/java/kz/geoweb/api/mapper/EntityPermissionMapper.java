package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.EntityPermissionDto;
import kz.geoweb.api.entity.EntityPermission;
import kz.geoweb.api.enums.Permission;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EntityPermissionMapper {
    private final ModelMapper modelMapper;

    public EntityPermissionDto toDto(EntityPermission entityPermission) {
        EntityPermissionDto entityPermissionDto = modelMapper.map(entityPermission, EntityPermissionDto.class);
        Set<Permission> permissions = Arrays.stream(entityPermission.getPermissions().split(","))
                .map(Permission::valueOf).collect(Collectors.toSet());
        entityPermissionDto.setPermissions(permissions);
        return entityPermissionDto;
    }

    public List<EntityPermissionDto> toDto(List<EntityPermission> entityPermissions) {
        return entityPermissions.stream().map(this::toDto).collect(Collectors.toList());
    }

    public EntityPermission toEntity(EntityPermissionDto entityPermissionDto) {
        EntityPermission entityPermission = modelMapper.map(entityPermissionDto, EntityPermission.class);
        String permissions = entityPermissionDto.getPermissions().stream()
                .map(Permission::name).collect(Collectors.joining(","));
        entityPermission.setPermissions(permissions);
        return entityPermission;
    }

    public List<EntityPermission> toEntity(List<EntityPermissionDto> entityPermissions) {
        return entityPermissions.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
