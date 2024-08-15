package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.RoleEnum;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Role extends IdEntity {
    @Enumerated(EnumType.STRING)
    private RoleEnum name;
}