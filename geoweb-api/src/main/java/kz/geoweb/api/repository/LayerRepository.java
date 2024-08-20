package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Layer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LayerRepository extends JpaRepository<Layer, UUID> {
    Optional<Layer> findByLayername(String layername);
}
