package kz.geoweb.api.repository;

import kz.geoweb.api.entity.FeatureFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FeatureFileRepository extends JpaRepository<FeatureFile, UUID> {
    List<FeatureFile> findByLayernameAndGid(String layername, Integer gid);
}
