package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Layer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LayerRepository extends JpaRepository<Layer, UUID> {
    Optional<Layer> findByLayername(String layername);

    Optional<Layer> findByStyleId(UUID styleId);

    Page<Layer> findByLayernameContainingIgnoreCaseOrNameKkContainingIgnoreCaseOrNameRuContainingIgnoreCaseOrNameEnContainingIgnoreCase(String layername, String nameKk, String nameRu, String nameEn, Pageable pageable);
}
