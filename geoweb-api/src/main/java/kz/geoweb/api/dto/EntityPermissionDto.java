package kz.geoweb.api.dto;

import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class EntityPermissionDto {
    private EntityType entityType;
    private UUID entityId;
    private RoleDto role;
    private Set<Permission> permissions = new HashSet<>();
}
