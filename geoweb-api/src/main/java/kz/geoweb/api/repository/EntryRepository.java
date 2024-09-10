package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntryRepository extends JpaRepository<Entry, UUID>, JpaSpecificationExecutor<Entry> {
    Optional<Entry> findFirstByDictionaryIdAndCode(UUID dictionaryId, String code);
}
