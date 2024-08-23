package kz.geoweb.api.repository;

import kz.geoweb.api.entity.EntityPermission;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntityPermissionRepository extends JpaRepository<EntityPermission, UUID> {
    Optional<EntityPermission> findByEntityTypeAndEntityIdAndUserIdAndPermission(EntityType entityType, UUID entityId, UUID userId, Permission permission);
}
