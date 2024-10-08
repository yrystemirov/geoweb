package kz.geoweb.api.controller;

import kz.geoweb.api.dto.EntityPermissionDto;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.service.EntityPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/entity-permissions")
@RequiredArgsConstructor
public class EntityPermissionController {
    private final EntityPermissionService entityPermissionService;

    @GetMapping
    public List<EntityPermissionDto> getEntityPermissions(@RequestParam EntityType entityType,
                                                          @RequestParam UUID entityId) {
        return entityPermissionService.getEntityPermissions(entityType, entityId);
    }

    @PutMapping
    public void updateEntityPermissions(@RequestBody List<EntityPermissionDto> entityPermissions) {
        entityPermissionService.updateEntityPermission(entityPermissions);
    }
}
