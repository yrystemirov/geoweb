package kz.geoweb.api.repository;

import kz.geoweb.api.entity.LayerAttr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface LayerAttrRepository extends JpaRepository<LayerAttr, UUID> {
    Set<LayerAttr> findByLayerIdOrderByOrderNumber(UUID layerId);
    Optional<LayerAttr> findByAttrnameAndLayerId(String attrname, UUID layerId);
}
