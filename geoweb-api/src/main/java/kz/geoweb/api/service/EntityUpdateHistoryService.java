package kz.geoweb.api.service;

import kz.geoweb.api.enums.Action;

import java.util.UUID;

public interface EntityUpdateHistoryService {
    void saveFolder(UUID entityId, Action action);
    void saveLayer(UUID entityId, Action action);
    void saveLayerAttr(UUID entityId, Action action);
}
