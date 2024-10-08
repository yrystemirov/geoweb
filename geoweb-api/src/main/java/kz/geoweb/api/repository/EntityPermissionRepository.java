package kz.geoweb.api.repository;

import kz.geoweb.api.entity.EntityPermission;
import kz.geoweb.api.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface EntityPermissionRepository extends JpaRepository<EntityPermission, UUID> {
    List<EntityPermission> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);

    Optional<EntityPermission> findByEntityTypeAndEntityIdAndRoleId(EntityType entityType, UUID entityId, UUID roleId);

    Optional<EntityPermission> findByEntityTypeAndEntityIdAndRoleIdIn(EntityType entityType, UUID entityId, Set<UUID> roleIds);

    @Modifying
    @Transactional
    void deleteByEntityTypeAndEntityIdAndRoleId(EntityType entityType, UUID entityId, UUID roleId);
}
