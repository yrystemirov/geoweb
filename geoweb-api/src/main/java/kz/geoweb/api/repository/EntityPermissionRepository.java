package kz.geoweb.api.repository;

import kz.geoweb.api.entity.EntityPermission;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface EntityPermissionRepository extends JpaRepository<EntityPermission, UUID> {
    Optional<EntityPermission> findByEntityTypeAndEntityIdAndRoleIdInAndPermission(EntityType entityType, UUID entityId, Set<UUID> roleIds, Permission permission);
}
