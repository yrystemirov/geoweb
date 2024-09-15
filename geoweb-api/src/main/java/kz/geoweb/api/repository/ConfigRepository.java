package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Config;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface ConfigRepository extends JpaRepository<Config, UUID> {
    Set<Config> findAllByOrderByConfigType();
}
