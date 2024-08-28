package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.Action;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
public class FeatureUpdateHistory extends IdEntity {
    private String layername;
    private Integer gid;
    @Enumerated(EnumType.STRING)
    private Action action;
    private UUID userId;
    private LocalDateTime date;
}
