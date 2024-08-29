package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import kz.geoweb.api.entity.base.IdEntity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Role extends IdEntity {
    private String code;
    private String name;
    private String description;
}