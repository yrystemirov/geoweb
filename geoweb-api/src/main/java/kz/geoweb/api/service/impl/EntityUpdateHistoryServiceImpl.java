package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.entity.EntityUpdateHistory;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.repository.EntityUpdateHistoryRepository;
import kz.geoweb.api.service.EntityUpdateHistoryService;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntityUpdateHistoryServiceImpl implements EntityUpdateHistoryService {
    private final EntityUpdateHistoryRepository entityUpdateHistoryRepository;
    private final UserService userService;

    @Override
    public void saveFolder(UUID entityId, Action action) {
        save(EntityType.FOLDER, entityId, action);
    }

    @Override
    public void saveLayer(UUID entityId, Action action) {
        save(EntityType.LAYER, entityId, action);
    }

    private void save(EntityType entityType, UUID entityId, Action action) {
        UserDto currentUser = userService.getCurrentUser();
        EntityUpdateHistory entityUpdateHistory = new EntityUpdateHistory();
        entityUpdateHistory.setEntityType(entityType);
        entityUpdateHistory.setEntityId(entityId);
        entityUpdateHistory.setAction(action);
        entityUpdateHistory.setUserId(currentUser.getId());
        entityUpdateHistory.setDate(LocalDateTime.now());
        entityUpdateHistoryRepository.save(entityUpdateHistory);
    }
}