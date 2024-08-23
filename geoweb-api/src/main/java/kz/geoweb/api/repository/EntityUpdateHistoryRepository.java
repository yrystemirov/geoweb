package kz.geoweb.api.repository;

import kz.geoweb.api.entity.EntityUpdateHistory;
import kz.geoweb.api.enums.EntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EntityUpdateHistoryRepository extends JpaRepository<EntityUpdateHistory, UUID> {
    Page<EntityUpdateHistory> findByEntityTypeAndEntityIdOrderByDateDesc(EntityType entityType, UUID entityId, Pageable pageable);
}
