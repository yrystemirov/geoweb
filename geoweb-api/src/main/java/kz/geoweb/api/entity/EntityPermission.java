package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
public class EntityPermission extends IdEntity {
    @Enumerated(EnumType.STRING)
    private EntityType entityType;
    private UUID entityId;
    private UUID roleId;
    @Enumerated(EnumType.STRING)
    private Permission permission;
}
