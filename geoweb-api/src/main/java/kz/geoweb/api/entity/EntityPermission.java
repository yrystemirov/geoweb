package kz.geoweb.api.entity;

import jakarta.persistence.*;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.EntityType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "entity_permission")
public class EntityPermission extends IdEntity {
    @Enumerated(EnumType.STRING)
    private EntityType entityType;
    private UUID entityId;
    @ManyToOne
    private Role role;
    private String permissions;
}
