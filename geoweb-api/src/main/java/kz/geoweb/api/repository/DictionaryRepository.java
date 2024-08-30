package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Dictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DictionaryRepository extends JpaRepository<Dictionary, UUID> {
}
