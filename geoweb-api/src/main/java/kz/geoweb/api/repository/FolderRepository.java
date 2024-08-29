package kz.geoweb.api.repository;

import kz.geoweb.api.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {
    Set<Folder> findByParentIdOrderByRank(UUID id);
}
