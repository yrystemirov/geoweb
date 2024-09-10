package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Dictionary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DictionaryRepository extends JpaRepository<Dictionary, UUID> {
    Page<Dictionary> findAllByCodeContainingIgnoreCaseOrNameKkContainingIgnoreCaseOrNameRuContainingIgnoreCaseOrNameEnContainingIgnoreCase(
            String code, String nameKk, String nameRu, String nameEn, Pageable pageable);

    Optional<Dictionary> findFirstByCode(String code);
}
