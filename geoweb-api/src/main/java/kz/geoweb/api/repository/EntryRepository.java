package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Entry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EntryRepository extends JpaRepository<Entry, UUID> {
    List<Entry> findByDictionaryIdOrderByRank(UUID dictionaryId);
    Page<Entry> findByDictionaryIdOrderByRank(UUID dictionaryId, Pageable pageable);
}
