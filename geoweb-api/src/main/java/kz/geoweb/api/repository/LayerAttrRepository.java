package kz.geoweb.api.repository;

import kz.geoweb.api.entity.LayerAttr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface LayerAttrRepository extends JpaRepository<LayerAttr, UUID> {
    Set<LayerAttr> findByLayerIdOrderByRank(UUID layerId);
    Optional<LayerAttr> findByAttrnameAndLayerId(String attrname, UUID layerId);
    @Modifying
    @Transactional
    void deleteByLayerId(UUID layerId);
}
