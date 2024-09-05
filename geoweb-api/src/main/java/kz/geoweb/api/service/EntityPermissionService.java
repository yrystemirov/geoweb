package kz.geoweb.api.service;

import java.util.Set;
import java.util.UUID;

public interface EntityPermissionService {
    void checkFolderRead(UUID entityId, Set<UUID> roleIds);
    void checkFolderWrite(UUID entityId, Set<UUID> roleIds);
    void checkLayerRead(UUID entityId, Set<UUID> roleIds);
    void checkLayerWrite(UUID entityId, Set<UUID> roleIds);
}
