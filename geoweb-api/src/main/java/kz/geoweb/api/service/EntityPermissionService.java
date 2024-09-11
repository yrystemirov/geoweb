package kz.geoweb.api.service;

import java.util.UUID;

public interface EntityPermissionService {
    void checkFolderRead(UUID entityId);

    void checkFolderWrite(UUID entityId);

    void checkLayerRead(UUID entityId);

    void checkLayerWrite(UUID entityId);
}
