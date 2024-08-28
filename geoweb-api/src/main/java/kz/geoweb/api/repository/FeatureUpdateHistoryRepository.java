package kz.geoweb.api.repository;

import kz.geoweb.api.entity.FeatureUpdateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FeatureUpdateHistoryRepository extends JpaRepository<FeatureUpdateHistory, UUID> {
}
