package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.enums.EntityType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
public class EntityUpdateHistory extends IdEntity {
    @Enumerated(EnumType.STRING)
    private EntityType entityType;
    private UUID entityId;
    private UUID userId;
    @Enumerated(EnumType.STRING)
    private Action action;
    private LocalDateTime date;
}
