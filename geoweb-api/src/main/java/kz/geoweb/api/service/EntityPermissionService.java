package kz.geoweb.api.service;

import java.util.UUID;

public interface EntityPermissionService {
    boolean allowFolderRead(UUID entityId, UUID userId);
    boolean allowFolderWrite(UUID entityId, UUID userId);
    boolean allowLayerRead(UUID entityId, UUID userId);
    boolean allowLayerWrite(UUID entityId, UUID userId);
}
